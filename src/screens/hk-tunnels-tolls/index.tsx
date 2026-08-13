import Head from "next/head";
import { StatsCollection, SiteFooter, SiteHeader } from "@/components/SiteFormat";
import { useState, useEffect, useMemo, useRef, useCallback, JSX, ReactNode } from "react";
import { Button, ButtonGroup, HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { createTranslateFunction, getHreflang, LocaleProps, TranslateFunction } from "@/locale/i18n";
import publicHolidayData from "./data/public_holidays.json";
import registryInfo from "./data/registry.json";
import tollData from "./data/tolls.json";
import { InArticleAdUnit } from "@/components/AdUnit";

// Type for localized strings that can be either a plain string or a translation reference
type LocalizedString = string | { id: string };

type VehicleTypeIdentifier = keyof typeof registryInfo.vehicleTypes;

type HKTunnelIdentifier = keyof typeof registryInfo.tunnels;

// "journey" tunnels read official Transport Department times; "detector" tunnels
// derive the time from live in-tunnel loop-detector speeds and the tunnel length.
type TrafficSource = "journey" | "detector";

interface DirectionRoute {
  direction: string;
  fromEntrance: number;
  loc?: string; // journey source: JTI display origin
  dest?: string; // journey source: JTI destination
  detectors?: string[]; // detector source: in-tunnel detector IDs for this direction
  approachMinutes?: number; // journey source: free-flow time from JTI sign to tunnel entrance
}

interface TunnelInfo {
  name: LocalizedString;
  category: string;
  color: string;
  trafficSource: TrafficSource;
  lengthKm?: number;
  maxLegalSpeedKmh?: number;
  entrances: Coordinates[];
  journeyRoutes: DirectionRoute[];
}

// registry.json tunnels are heterogeneous (detector vs journey), so index through this
// typed view instead of the widened union TypeScript infers from the JSON import.
function getTunnelInfo(key: HKTunnelIdentifier): TunnelInfo {
  return registryInfo.tunnels[key] as unknown as TunnelInfo;
}

enum SortMode {
  Default,
  Nearest,
}

enum TrafficStatus {
  Unknown,
  Smooth,
  Slow,
  Congested,
  Closed,
}

interface JourneyReading {
  status: TrafficStatus;
  minutes: number | null;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface TunnelGroup {
  labelId: string;
  category: string;
}

interface GroupedTunnel {
  key: HKTunnelIdentifier;
  distanceKm: number | null;
}

// Cross-harbour crossings are the primary decision, so they always sit on top.
const TUNNEL_GROUPS: TunnelGroup[] = [
  { labelId: "group.harbour", category: "harbour" },
  { labelId: "group.other", category: "other" },
];

interface NumberRange {
  range: number[];
}

interface TollPeriod {
  type: string;
  name: LocalizedString;
  timeRange: string;
  toll: number | NumberRange;
}

interface VehicleType {
  hasTimeVaryingToll: boolean;
  fixedTolls?: Record<HKTunnelIdentifier, number | undefined>;
  multiplier?: number;
  description?: LocalizedString;
}

interface TollCardProps {
  tunnelKey: HKTunnelIdentifier;
  vehicle: VehicleTypeIdentifier;
  priceAlert?: string;
  currentDate: Date | null;
  isPublicHoliday: boolean;
  isClient: boolean;
  journeyReadings: Record<string, JourneyReading> | null;
  detectorSpeeds: Record<string, number> | null;
  sortMode: SortMode;
  userCoords: Coordinates | null;
  t: TranslateFunction;
}

interface CurrentTollResult {
  message: string;
  isTransitionTime?: true;
}

interface TunnelTableProps {
  tunnelKey: HKTunnelIdentifier;
  selectedVehicle: VehicleTypeIdentifier;
  t: TranslateFunction;
}

interface HKTunnelsTollsAppProps {
  t: TranslateFunction;
  lang?: string;
  isAppleDevice?: boolean;
  isPWA?: boolean;
}

interface AlertBadgeProps {
  // Full Tailwind classes so both light and dark variants stay statically scannable,
  // e.g. background="bg-amber-100 dark:bg-amber-900" text="text-amber-800 dark:text-amber-200"
  background: string;
  text: string;
  children: ReactNode;
}

function AlertBadge({ background, text, children }: AlertBadgeProps): JSX.Element {
  return (
    <span
      className={`text-[1.45rem] md:text-lg ${background} ${text} px-3 rounded-md font-medium inline-block text-center`}
    >
      {children}
    </span>
  );
}

interface TrafficRowsProps {
  tunnelKey: HKTunnelIdentifier;
  journeyReadings: Record<string, JourneyReading> | null;
  detectorSpeeds: Record<string, number> | null;
  sortMode: SortMode;
  userCoords: Coordinates | null;
  t: TranslateFunction;
}

function TrafficRows({
  tunnelKey,
  journeyReadings,
  detectorSpeeds,
  sortMode,
  userCoords,
  t,
}: TrafficRowsProps): JSX.Element | null {
  const tunnel = getTunnelInfo(tunnelKey);
  const routes = tunnel.journeyRoutes;
  if (!routes) return null;

  // Default: show every direction the feed provides. Nearest: show only the direction you'd
  // drive — you enter the portal closest to you and head toward the far one, so keep the route
  // that starts from your nearest entrance. Fall back to all routes when none match.
  const activeRoutes = useMemo(() => {
    if (sortMode === SortMode.Nearest && userCoords) {
      const nearIndex = nearestEntranceIndex(tunnel.entrances, userCoords);
      const towards = routes.filter((route) => route.fromEntrance === nearIndex);
      if (towards.length > 0) return towards;
    }
    return routes;
  }, [sortMode, userCoords, routes, tunnel.entrances]);

  const rows = activeRoutes
    .map((route) => ({ route, reading: readingForRoute(tunnel, route, journeyReadings, detectorSpeeds) }))
    .filter((row): row is { route: DirectionRoute; reading: JourneyReading } => row.reading !== null);
  if (rows.length === 0) return null;

  const TRAFFIC_LABEL_IDS: Record<TrafficStatus, string> = {
    [TrafficStatus.Unknown]: "traffic.unavailable",
    [TrafficStatus.Smooth]: "traffic.smooth",
    [TrafficStatus.Slow]: "traffic.slow",
    [TrafficStatus.Congested]: "traffic.congested",
    [TrafficStatus.Closed]: "traffic.closed",
  };

  return (
    <div className="flex flex-col gap-1 py-1">
      {rows.map(({ route, reading }) => {
        const colors = TRAFFIC_COLORS[reading.status];
        return (
          <div key={route.direction} className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xl md:text-base text-gray-600 dark:text-gray-300">
              {t(`direction.${route.direction}`)}
            </span>
            <div className="flex items-center gap-2">
              <AlertBadge background={colors.background} text={colors.text}>
                {t(TRAFFIC_LABEL_IDS[reading.status])}
              </AlertBadge>
              {reading.minutes !== null && (
                <AlertBadge background={colors.background} text={colors.text}>
                  {t("traffic.minutes", String(reading.minutes))}
                </AlertBadge>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function resolveLocalizedString(value: LocalizedString, t: TranslateFunction): string {
  if (typeof value === "string") {
    return value;
  }
  return t(value.id);
}

function getHongKongDate(utcDate: Date): { date: Date; dateString: string; timeString: string; dayOfWeek: number } {
  const hkFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Hong_Kong",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const hkParts = hkFormatter.formatToParts(utcDate);
  const hkPartsObj = hkParts.reduce(
    (acc, part) => {
      acc[part.type] = part.value;
      return acc;
    },
    {} as Record<string, string>,
  );

  const hkDate = new Date(
    `${hkPartsObj.year}-${hkPartsObj.month}-${hkPartsObj.day}T${hkPartsObj.hour}:${hkPartsObj.minute}:${hkPartsObj.second}`,
  );

  return {
    date: hkDate,
    dateString: `${hkPartsObj.year}${hkPartsObj.month}${hkPartsObj.day}`, // YYYYMMDD format
    timeString: `${hkPartsObj.hour}:${hkPartsObj.minute}`, // HH:MM format
    dayOfWeek: hkDate.getDay(), // 0 = Sunday, 1 = Monday, etc.
  };
}

function isValidVehicle(vehicle: string): vehicle is VehicleTypeIdentifier {
  return Object.keys(registryInfo.vehicleTypes).includes(vehicle);
}

function isValidTunnel(tunnel: string): tunnel is HKTunnelIdentifier {
  return Object.keys(registryInfo.tunnels).includes(tunnel);
}

function isTimeInRange(time: string, start: string, end: string): boolean {
  const timeMinutes = timeToMinutes(time);
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);

  if (startMinutes <= endMinutes) {
    return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
  } else {
    return timeMinutes >= startMinutes || timeMinutes <= endMinutes;
  }
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// Great-circle distance in kilometres between two coordinates.
function haversineKm(a: Coordinates, b: Coordinates): number {
  const toRad = (deg: number): number => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function nearestEntranceKm(entrances: Coordinates[], coords: Coordinates): number {
  return Math.min(...entrances.map((entrance) => haversineKm(coords, entrance)));
}

function nearestEntranceIndex(entrances: Coordinates[], coords: Coordinates): number {
  let bestIndex = 0;
  let bestDistance = Infinity;
  entrances.forEach((entrance, index) => {
    const distance = haversineKm(coords, entrance);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });
  return bestIndex;
}

// Cache the last fix so "Nearest" can be restored on reload without a gesture-less geolocation call.
const COORDS_STORAGE_KEY = "hk-tunnel-coords";

function readStoredCoords(): Coordinates | null {
  try {
    const raw = localStorage.getItem(COORDS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Coordinates;
    if (typeof parsed?.lat === "number" && typeof parsed?.lng === "number") return parsed;
  } catch {
    // Ignore malformed or unavailable storage.
  }
  return null;
}

function storeCoords(coords: Coordinates): void {
  try {
    localStorage.setItem(COORDS_STORAGE_KEY, JSON.stringify(coords));
  } catch {
    // Ignore storage failures (private mode quota, etc.).
  }
}

// Transport Department Journey Time Indicators (2nd generation), updated every 2 minutes.
// The endpoint sends `access-control-allow-origin: *`, so it can be read directly here.
const JOURNEY_TIME_URL = "https://resource.data.one.gov.hk/td/jss/Journeytimev2.xml";
const JOURNEY_REFRESH_MS = 120000;

function journeyKey(loc: string, dest: string): string {
  return `${loc}|${dest}`;
}

// COLOUR_ID: 1 = red, 2 = amber, 3 = green. JOURNEY_TYPE 2 with JOURNEY_DATA 3 means the tunnel is closed.
function parseJourneyTimes(xml: string): Record<string, JourneyReading> {
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const readings: Record<string, JourneyReading> = {};

  Array.from(doc.getElementsByTagName("jtis_journey_time")).forEach((node) => {
    const value = (tag: string): string => node.getElementsByTagName(tag)[0]?.textContent?.trim() ?? "";
    const loc = value("LOCATION_ID");
    const dest = value("DESTINATION_ID");
    if (!loc || !dest) return;

    const journeyType = Number(value("JOURNEY_TYPE"));
    const journeyData = Number(value("JOURNEY_DATA"));

    if (journeyType === 2) {
      if (journeyData === 3) readings[journeyKey(loc, dest)] = { status: TrafficStatus.Closed, minutes: null };
      return;
    }

    const colourStatus: Record<number, TrafficStatus> = {
      1: TrafficStatus.Congested,
      2: TrafficStatus.Slow,
      3: TrafficStatus.Smooth,
    };
    const status = colourStatus[Number(value("COLOUR_ID"))] ?? TrafficStatus.Unknown;
    readings[journeyKey(loc, dest)] = { status, minutes: journeyData > 0 ? journeyData : null };
  });

  return readings;
}

// Transport Department loop-detector speeds (2 x 30s samples), updated about every minute.
// Also sends `access-control-allow-origin: *`, so it can be read directly here.
const DETECTOR_URL = "https://resource.data.one.gov.hk/td/traffic-detectors/rawSpeedVol-all.xml";
const DETECTOR_REFRESH_MS = 60000;

// Mean valid-lane speed (km/h) per detector, averaged across every lane and sampling period.
function parseDetectorSpeeds(xml: string): Record<string, number> {
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const totals: Record<string, { sum: number; count: number }> = {};

  Array.from(doc.getElementsByTagName("detector")).forEach((detector) => {
    const id = detector.getElementsByTagName("detector_id")[0]?.textContent?.trim();
    if (!id) return;
    Array.from(detector.getElementsByTagName("lane")).forEach((lane) => {
      const valid = lane.getElementsByTagName("valid")[0]?.textContent?.trim();
      const speed = Number(lane.getElementsByTagName("speed")[0]?.textContent);
      if (valid !== "Y" || !(speed > 0)) return;
      const bucket = (totals[id] ??= { sum: 0, count: 0 });
      bucket.sum += speed;
      bucket.count += 1;
    });
  });

  const speeds: Record<string, number> = {};
  Object.entries(totals).forEach(([id, { sum, count }]) => {
    if (count > 0) speeds[id] = sum / count;
  });
  return speeds;
}

function speedCongestionStatus(tunnel: TunnelInfo, minutes: number): TrafficStatus {
  if (tunnel.lengthKm == null || tunnel.maxLegalSpeedKmh == null || !(minutes > 0)) {
    return TrafficStatus.Unknown;
  }
  const seconds = minutes * 60;
  const avgSpeedKmh = (tunnel.lengthKm / seconds) * 3600;
  if (avgSpeedKmh < tunnel.maxLegalSpeedKmh * 0.15) return TrafficStatus.Congested;
  if (avgSpeedKmh < tunnel.maxLegalSpeedKmh * 0.3) return TrafficStatus.Slow;
  return TrafficStatus.Unknown;
}

// Balance the official status against our speed-derived read, keeping whichever is more severe.
// TrafficStatus is ordered by severity, so Math.max picks the worse of the two — our measurement
// can escalate the alert (e.g. a "smooth"-flagged crawl) but never soften the government's.
function withSpeedCongestion(tunnel: TunnelInfo, reading: JourneyReading): JourneyReading {
  if (reading.minutes === null) return reading;
  const ourStatus = speedCongestionStatus(tunnel, reading.minutes);
  return { ...reading, status: Math.max(reading.status, ourStatus) as TrafficStatus };
}

// Detector tunnels: time = length / min(measured speed, legal limit). Capping at the legal
// limit keeps a free-flowing carriageway (detectors often read above 70) from reporting an
// impossibly short time, while congestion still pulls the mean speed — and the time — down.
function readingForRoute(
  tunnel: TunnelInfo,
  route: DirectionRoute,
  journeyReadings: Record<string, JourneyReading> | null,
  detectorSpeeds: Record<string, number> | null,
): JourneyReading | null {
  if (tunnel.trafficSource === "detector") {
    if (!detectorSpeeds || !route.detectors || tunnel.lengthKm == null || tunnel.maxLegalSpeedKmh == null) {
      return null;
    }
    const speeds = route.detectors
      .map((id) => detectorSpeeds[id])
      .filter((speed): speed is number => typeof speed === "number" && speed > 0);
    if (speeds.length === 0) return null;

    const meanSpeed = speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;
    const effectiveSpeed = Math.min(meanSpeed, tunnel.maxLegalSpeedKmh);
    const minutes = Math.round((tunnel.lengthKm / effectiveSpeed) * 60);
    const status =
      meanSpeed >= 60 ? TrafficStatus.Smooth : meanSpeed >= 30 ? TrafficStatus.Slow : TrafficStatus.Congested;
    return withSpeedCongestion(tunnel, { status, minutes });
  }

  if (!journeyReadings || !route.loc || !route.dest) return null;

  const floorMinutes =
    tunnel.lengthKm != null && tunnel.maxLegalSpeedKmh != null
      ? Math.round((tunnel.lengthKm * 1000) / (tunnel.maxLegalSpeedKmh / 3.6) / 60)
      : 2;

  const reading = journeyReadings[journeyKey(route.loc, route.dest)] ?? null;
  if (reading === null) return null;

  const adjusted =
    reading.minutes !== null && route.approachMinutes
      ? { ...reading, minutes: Math.max(floorMinutes, reading.minutes - route.approachMinutes) }
      : reading;
  return withSpeedCongestion(tunnel, adjusted);
}

interface BadgeColors {
  background: string;
  text: string;
}

const TRAFFIC_COLORS: Record<TrafficStatus, BadgeColors> = {
  [TrafficStatus.Unknown]: { background: "bg-gray-100 dark:bg-gray-800", text: "text-gray-800 dark:text-gray-200" },
  [TrafficStatus.Smooth]: { background: "bg-green-100 dark:bg-green-900", text: "text-green-800 dark:text-green-200" },
  [TrafficStatus.Slow]: { background: "bg-amber-100 dark:bg-amber-900", text: "text-amber-800 dark:text-amber-200" },
  [TrafficStatus.Congested]: { background: "bg-red-100 dark:bg-red-900", text: "text-red-800 dark:text-red-200" },
  [TrafficStatus.Closed]: { background: "bg-red-100 dark:bg-red-900", text: "text-red-800 dark:text-red-200" },
};

interface ScheduleContext {
  isHolidaySchedule: boolean;
  currentTimeStr: string;
}

// Sundays and public holidays use one toll schedule; weekdays use the other.
function getScheduleContext(currentTime: Date, isPublicHoliday: boolean): ScheduleContext {
  const hkInfo = getHongKongDate(currentTime);
  return { isHolidaySchedule: hkInfo.dayOfWeek === 0 || isPublicHoliday, currentTimeStr: hkInfo.timeString };
}

// Function to get current toll for a specific tunnel
function getCurrentTollForTunnel(
  selectedVehicle: VehicleTypeIdentifier,
  tunnelKey: HKTunnelIdentifier,
  currentTime: Date | null,
  isPublicHoliday: boolean,
  isClient: boolean,
  t: TranslateFunction,
): CurrentTollResult {
  // Show loading until everything is properly loaded
  if (!currentTime || !isClient) return { message: t("loading") };

  const vehicle = tollData.vehicleTypes[selectedVehicle];
  const tunnel = tollData.tunnels[tunnelKey];

  // Fixed toll vehicles
  if (vehicle.fixedTolls && tunnelKey in vehicle.fixedTolls) {
    return { message: `$${vehicle.fixedTolls[tunnelKey as keyof typeof vehicle.fixedTolls]}` };
  }

  if (!tunnel || !("timeVaryingTolls" in tunnel)) {
    return { message: t("unableToCalculate") };
  }

  const { isHolidaySchedule, currentTimeStr } = getScheduleContext(currentTime, isPublicHoliday);
  const timeSlots = isHolidaySchedule ? tunnel.timeVaryingTolls.sundays_and_holidays : tunnel.timeVaryingTolls.weekdays;

  // Find current period
  for (const period of timeSlots.periods) {
    const [startTime, endTime] = period.timeRange.split(" - ");
    if (isTimeInRange(currentTimeStr, startTime, endTime)) {
      const tollForTunnel = period.toll;

      if (typeof tollForTunnel === "object" && "range" in tollForTunnel) {
        // Transition period - show range
        const [min, max] = tollForTunnel.range;
        const timePeriod = Math.trunc((timeToMinutes(currentTimeStr) - timeToMinutes(startTime)) / 2);
        const currentToll = min > max ? min - timePeriod * 2 : min + timePeriod * 2;
        if ("multiplier" in vehicle) {
          return { message: `$${(currentToll * vehicle.multiplier).toFixed(1)}`, isTransitionTime: true };
        }
        return { message: `$${currentToll}`, isTransitionTime: true };
      } else {
        // Apply multiplier for motorcycles
        if ("multiplier" in vehicle) {
          const motorcycleToll = Math.round(tollForTunnel * vehicle.multiplier * 10) / 10;
          return { message: `$${motorcycleToll}` };
        }
        return { message: `$${tollForTunnel}` };
      }
    }
  }

  return { message: t("unableToCalculate") };
}

function HKTollCard(props: TollCardProps): JSX.Element {
  const { tunnelKey, priceAlert, vehicle, currentDate, isPublicHoliday, isClient } = props;
  const { journeyReadings, detectorSpeeds, sortMode, userCoords, t } = props;
  const tollResult = getCurrentTollForTunnel(vehicle, tunnelKey, currentDate, isPublicHoliday, isClient, t);
  const tunnel = getTunnelInfo(tunnelKey);

  return (
    <div key={tunnelKey} className="flex gap-3 border-b border-black dark:border-white pb-1 last:border-b-0">
      <span
        className="w-1.5 self-stretch rounded-full shrink-0"
        style={{ backgroundColor: tunnel.color }}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <div className="flex flex-row justify-between items-start gap-2">
          <div className="text-left">
            <span className="text-3xl md:text-2xl font-medium">{resolveLocalizedString(tunnel.name, t)}</span>
          </div>
          <p className="text-right text-5xl py-1 md:py-2 font-bold text-green-600">{tollResult.message}</p>
        </div>
        <TrafficRows
          tunnelKey={tunnelKey}
          journeyReadings={journeyReadings}
          detectorSpeeds={detectorSpeeds}
          sortMode={sortMode}
          userCoords={userCoords}
          t={t}
        />
        {tollResult.isTransitionTime && (
          <div className="text-right py-1">
            <AlertBadge background="bg-amber-100 dark:bg-amber-900" text="text-amber-800 dark:text-amber-200">
              {t("transitionPeriod")}
            </AlertBadge>
          </div>
        )}
        {priceAlert && (
          <div className="text-right">
            <AlertBadge background="bg-amber-100 dark:bg-amber-900" text="text-amber-800 dark:text-amber-200">
              {priceAlert}
            </AlertBadge>
          </div>
        )}
      </div>
    </div>
  );
}

function TunnelTable({ tunnelKey, selectedVehicle, t }: TunnelTableProps): JSX.Element {
  const tunnel = tollData.tunnels[tunnelKey];
  const vehicle = tollData.vehicleTypes[selectedVehicle];
  const tunnelName = resolveLocalizedString(registryInfo.tunnels[tunnelKey].name, t);

  if (!tunnel || !("timeVaryingTolls" in tunnel)) {
    return <></>;
  }

  const formatToll = (period: TollPeriod, multiplier?: number) => {
    const toll = period.toll;

    if (typeof toll === "object" && "range" in toll) {
      const [min, max] = toll.range;
      if (multiplier) {
        return `$${(min * multiplier).toFixed(1)} - $${(max * multiplier).toFixed(1)}`;
      }
      return `$${min} - $${max}`;
    }
    if (multiplier) {
      return `$${(toll * multiplier).toFixed(1)}`;
    }
    return `$${toll}`;
  };

  const getFixedToll = (vehicle: VehicleType) => {
    if (vehicle.fixedTolls?.[tunnelKey]) {
      return `$${vehicle.fixedTolls[tunnelKey]}`;
    }
    return `$${vehicle.fixedTolls || 0}`;
  };

  // Weekday and weekend/holiday schedules render identically apart from the heading and periods.
  const renderSchedule = (labelId: string, colorClass: string, periods: TollPeriod[]) => (
    <div>
      <h4 className={`text-xl md:text-base font-medium mb-2 ${colorClass}`}>{t(labelId)}</h4>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {t("tableHeaderPeriod")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {t("tableHeaderTime")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {t("tableHeaderToll")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {periods.map((period: TollPeriod, index: number) => (
              <tr
                key={index}
                className={
                  period.type === "peak"
                    ? "bg-red-50 text-black"
                    : period.type === "transition"
                      ? "bg-yellow-50 text-black"
                      : ""
                }
              >
                <td className="px-6 py-4 whitespace-nowrap font-medium">{resolveLocalizedString(period.name, t)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{period.timeRange}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {vehicle.hasTimeVaryingToll
                    ? formatToll(period, "multiplier" in vehicle ? vehicle.multiplier : undefined)
                    : getFixedToll(vehicle as VehicleType)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="card-base-min mb-4">
      <h3 className="text-2xl md:text-lg font-semibold border-b mb-4">{t("tollRates", tunnelName)}</h3>
      <div className="mb-6">
        {renderSchedule("weekdaySchedule", "text-blue-600", tunnel.timeVaryingTolls.weekdays.periods)}
      </div>
      {renderSchedule("weekendSchedule", "text-green-600", tunnel.timeVaryingTolls.sundays_and_holidays.periods)}
    </div>
  );
}

interface IosHomeScreenGuideProps {
  t: TranslateFunction;
}

function IosHomeScreenGuide({ t }: IosHomeScreenGuideProps): JSX.Element {
  return (
    <>
      <h2 id="ios-app-guide" className="text-2xl font-bold py-2">
        {t("iosAppGuide.title")}
      </h2>
      <ol className="px-4">
        <li>
          {t("iosAppGuide.0")}
          <img src="/hk-tunnels-tolls/assets/ios-share-button.png" alt="iOS Share Button" />
        </li>
        <li>{t("iosAppGuide.1")}</li>
        <img src={t("iosAppGuide.image")} alt="iOS Home Screen Guide" className="w-full max-w-md" />
      </ol>
    </>
  );
}

function HKTunnelsTollsApp({ t, lang, isAppleDevice = false, isPWA = false }: HKTunnelsTollsAppProps): JSX.Element {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleTypeIdentifier>("privateCar");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isPublicHoliday, setIsPublicHoliday] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [sortMode, setSortMode] = useState<SortMode>(SortMode.Default);
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [journeyReadings, setJourneyReadings] = useState<Record<string, JourneyReading> | null>(null);
  const [detectorSpeeds, setDetectorSpeeds] = useState<Record<string, number> | null>(null);

  // Live-location stream: the active watch id, and whether a tap is still awaiting its first fix.
  const watchIdRef = useRef<number | null>(null);
  const awaitingFirstFixRef = useRef<boolean>(false);

  const stopLocationWatch = useCallback(() => {
    if (watchIdRef.current !== null && typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const startLocationWatch = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    // Replace any existing stream so a gesture-backed tap always establishes a working watch.
    stopLocationWatch();
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserCoords(coords);
        storeCoords(coords);
        if (awaitingFirstFixRef.current) {
          awaitingFirstFixRef.current = false;
          setSortMode(SortMode.Nearest);
          setIsLoadingLocation(false);
        }
      },
      () => {
        // Surface a failure only for the first fix; ignore transient errors on a working stream.
        if (awaitingFirstFixRef.current) {
          awaitingFirstFixRef.current = false;
          setSortMode(SortMode.Default);
          setIsLoadingLocation(false);
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 30000 },
    );
  }, [stopLocationWatch]);

  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());
  }, []);

  // Poll live journey times every 2 minutes (matches the feed's update cadence).
  useEffect(() => {
    let cancelled = false;

    const loadJourneyTimes = async () => {
      try {
        const response = await fetch(JOURNEY_TIME_URL);
        if (!response.ok) return;
        const xml = await response.text();
        if (!cancelled) setJourneyReadings(parseJourneyTimes(xml));
      } catch {
        // Keep the last successful reading on network failure.
      }
    };

    loadJourneyTimes();
    const intervalId = setInterval(loadJourneyTimes, JOURNEY_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  // Poll live detector speeds for the land tunnels (feed refreshes about every minute).
  useEffect(() => {
    let cancelled = false;

    const loadDetectorSpeeds = async () => {
      try {
        const response = await fetch(DETECTOR_URL);
        if (!response.ok) return;
        const xml = await response.text();
        if (!cancelled) setDetectorSpeeds(parseDetectorSpeeds(xml));
      } catch {
        // Keep the last successful reading on network failure.
      }
    };

    loadDetectorSpeeds();
    const intervalId = setInterval(loadDetectorSpeeds, DETECTOR_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  // Check if current date is a public holiday
  useEffect(() => {
    const holidays = new Set<string>();
    if (publicHolidayData.vcalendar && publicHolidayData.vcalendar[0] && publicHolidayData.vcalendar[0].vevent) {
      publicHolidayData.vcalendar[0].vevent.forEach((event) => {
        // Extract date from dtstart format "20240101"
        const dateStr = event.dtstart[0] as string;
        holidays.add(dateStr);
      });
    }

    if (currentTime) {
      const hkInfo = getHongKongDate(currentTime);
      setIsPublicHoliday(holidays.has(hkInfo.dateString));
    }
  }, [currentTime]);

  // Update current time every minute on the minute
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    const now = new Date();
    const delay = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());

    timeoutId = setTimeout(() => {
      setCurrentTime(new Date());
      intervalId = setInterval(() => {
        setCurrentTime(new Date());
      }, 60000);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  // Hide the full-screen AdSense vignette (not the anchor banner) once it has actually been
  // visible for 3–7s — anchored to when it's shown, since data-vignette-loaded is set earlier.
  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    let hasHiddenVignette = false;
    let hideTimer: number | null = null;
    const watched = new WeakSet<Element>();
    const elementObservers: MutationObserver[] = [];

    const isVignetteAd = (ad: Element | null): ad is HTMLElement =>
      ad instanceof HTMLElement &&
      ad.parentElement === root &&
      ad.matches('ins.adsbygoogle.adsbygoogle-noablate[data-vignette-loaded="true"]') &&
      !ad.matches("[data-anchor-status], [data-anchor-shown]");

    // A non-none computed display means the interstitial is genuinely on screen.
    const isVisible = (ad: HTMLElement): boolean => {
      const style = getComputedStyle(ad);
      return style.display !== "none" && style.visibility !== "hidden";
    };

    // Start the hide countdown the first time the vignette is both matched and actually visible.
    const evaluate = (ad: Element | null) => {
      if (hasHiddenVignette || hideTimer !== null) return;
      if (!isVignetteAd(ad) || !isVisible(ad)) return;

      const delayMs = 3000 + Math.floor(Math.random() * 4001); // 3s – 7s
      hideTimer = window.setTimeout(() => {
        hideTimer = null;
        if (ad.isConnected) {
          ad.style.setProperty("display", "none", "important");
          hasHiddenVignette = true;
        }
      }, delayMs);
    };

    // Re-check on the <ins>'s own style/attribute changes, which is how AdSense reveals it.
    const watch = (node: Node) => {
      if (!(node instanceof HTMLElement) || node.tagName !== "INS" || watched.has(node)) return;
      watched.add(node);
      const elementObserver = new MutationObserver(() => evaluate(node));
      elementObserver.observe(node, { attributes: true, attributeFilter: ["style", "data-vignette-loaded", "class"] });
      elementObservers.push(elementObserver);
      evaluate(node); // in case it is already shown
    };

    // The vignette is appended as a direct child of <html>; watch each <ins> that appears there.
    const rootObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) mutation.addedNodes.forEach(watch);
    });
    rootObserver.observe(root, { childList: true });

    // Handle a vignette that is already present when this effect mounts.
    Array.from(root.children).forEach(watch);

    return () => {
      rootObserver.disconnect();
      elementObservers.forEach((observer) => observer.disconnect());
      if (hideTimer !== null) clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const selectedVehicle = searchParams.get("vehicle") ?? localStorage.getItem("hk-tunnel-vehicle");
    if (selectedVehicle && isValidVehicle(selectedVehicle)) {
      setSelectedVehicle(selectedVehicle);
    }
  }, [setSelectedVehicle]);

  // Restore "Nearest" from the cached fix instantly, then resume the stream best-effort.
  useEffect(() => {
    if (localStorage.getItem("hk-tunnel-sort") !== "nearest") return;
    const cached = readStoredCoords();
    if (!cached) return;
    setUserCoords(cached);
    setSortMode(SortMode.Nearest);
    startLocationWatch();
  }, [startLocationWatch]);

  // Stop the location stream when the user leaves "Nearest", and always on unmount.
  useEffect(() => {
    if (sortMode === SortMode.Default) {
      stopLocationWatch();
      awaitingFirstFixRef.current = false;
      setIsLoadingLocation(false);
    }
  }, [sortMode, stopLocationWatch]);

  useEffect(() => stopLocationWatch, [stopLocationWatch]);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem("hk-tunnel-vehicle", selectedVehicle);
  }, [selectedVehicle]);

  useEffect(() => {
    localStorage.setItem("hk-tunnel-sort", sortMode === SortMode.Nearest ? "nearest" : "default");
  }, [sortMode]);

  // Function to get price change alert for a specific tunnel
  const getPriceChangeAlertForTunnel = (tunnelKey: HKTunnelIdentifier): string => {
    if (!tollData || !currentTime) return "";

    const vehicle = tollData.vehicleTypes[selectedVehicle];
    const tunnel = tollData.tunnels[tunnelKey];

    // Fixed toll vehicles don't have price changes
    if (!vehicle.hasTimeVaryingToll) {
      return "";
    }

    if (!tunnel || !("timeVaryingTolls" in tunnel)) {
      return "";
    }

    const { isHolidaySchedule, currentTimeStr } = getScheduleContext(currentTime, isPublicHoliday);
    const timeSlots = isHolidaySchedule
      ? tunnel.timeVaryingTolls.sundays_and_holidays
      : tunnel.timeVaryingTolls.weekdays;

    // Find current period
    let currentPeriod: TollPeriod | null = null;
    let currentPeriodIndex = -1;
    for (let i = 0; i < timeSlots.periods.length; i++) {
      const period = timeSlots.periods[i];
      const [startTime, endTime] = period.timeRange.split(" - ");
      if (isTimeInRange(currentTimeStr, startTime, endTime)) {
        currentPeriod = period;
        currentPeriodIndex = i;
        break;
      }
    }

    if (!currentPeriod) return "";

    // Find the next period that isn't a transition (where toll is not an object)
    let nextPeriodIndex = (currentPeriodIndex + 1) % timeSlots.periods.length;
    let nextPeriod = timeSlots.periods[nextPeriodIndex];

    // Skip transition periods to find the target price
    while (nextPeriod && typeof nextPeriod.toll === "object") {
      nextPeriodIndex = (nextPeriodIndex + 1) % timeSlots.periods.length;
      nextPeriod = timeSlots.periods[nextPeriodIndex];

      // Prevent infinite loops if all periods are somehow objects
      if (nextPeriodIndex === currentPeriodIndex) break;
    }

    if (nextPeriod && nextPeriod.toll !== currentPeriod.toll && typeof nextPeriod.toll !== "object") {
      const nextToll = nextPeriod.toll;
      let nextTollDisplay = "";

      if ("multiplier" in vehicle && vehicle.multiplier) {
        const motorcycleToll = Math.round(nextToll * vehicle.multiplier * 10) / 10;
        nextTollDisplay = `$${motorcycleToll}`;
      } else {
        nextTollDisplay = `$${nextToll}`;
      }

      return t("priceChangeAlert", nextPeriod.timeRange.split(" - ")[0], nextTollDisplay);
    }

    return "";
  };

  // Switch to distance sort and stream the device location so the order tracks movement.
  const requestNearestSort = () => {
    // Already have a fix: switch instantly and make sure the stream is running.
    if (userCoords) {
      setSortMode(SortMode.Nearest);
      startLocationWatch();
      return;
    }
    if (typeof navigator === "undefined" || !navigator.geolocation) return;

    // First fix: spinner now for instant feedback; the watch (started in-gesture for iOS) finishes the switch.
    setIsLoadingLocation(true);
    awaitingFirstFixRef.current = true;
    startLocationWatch();
  };

  const buildGroup = (category: string): GroupedTunnel[] => {
    const sortByDistance = sortMode === SortMode.Nearest && userCoords !== null;
    const tunnels: GroupedTunnel[] = Object.keys(registryInfo.tunnels)
      .filter((key): key is HKTunnelIdentifier => isValidTunnel(key) && registryInfo.tunnels[key].category === category)
      .map((key) => ({
        key,
        distanceKm: sortByDistance
          ? nearestEntranceKm(registryInfo.tunnels[key].entrances, userCoords as Coordinates)
          : null,
      }));

    if (sortByDistance) {
      tunnels.sort((a, b) => (a.distanceKm as number) - (b.distanceKm as number));
    }
    return tunnels;
  };

  const hkTime = currentTime;
  const vehicleName = resolveLocalizedString(registryInfo.vehicleTypes[selectedVehicle].name, t);
  const vehicleDescription = registryInfo.vehicleTypes[selectedVehicle].description;

  const groupedTunnels = useMemo(() => {
    return TUNNEL_GROUPS.map((group) => ({
      ...group,
      tunnels: buildGroup(group.category),
    }));
  }, [sortMode, userCoords]);

  return (
    <div className="max-w-4xl mx-auto px-2">
      {/* Header */}
      <h1 className="text-center m-2 md:m-4 text-3xl md:text-4xl font-bold md:p-2">{t("pageHeading")}</h1>
      {isAppleDevice && !isPWA && (
        <a href={"#ios-app-guide"}>
          <div className="mx-2 mb-4 p-2 rounded-md border bg-blue-50 border-blue-100 text-blue-800 font-bold text-lg text-center">
            <img
              src="/assets/posts/hk-toll-rate/ios-share-button.png"
              alt="iOS Share Button"
              className="h-6 inline-block mr-2"
            />
            <span>{t("iosAppGuide.title")}</span>
          </div>
        </a>
      )}
      {/* Current Toll Display */}
      <div className="card-base-min mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xl md:text-lg font-semibold">
            {t("currentToll")} - {vehicleName}{" "}
            {vehicleDescription ? `(${resolveLocalizedString(vehicleDescription, t)})` : ""}
          </h3>
          <ButtonGroup>
            <Button
              color={sortMode === SortMode.Default ? "primary" : "default"}
              onPress={() => setSortMode(SortMode.Default)}
              className="text-xl md:text-lg"
            >
              {t("sortDefault")}
            </Button>
            <Button
              color={sortMode === SortMode.Nearest || isLoadingLocation ? "primary" : "default"}
              className={`text-xl md:text-lg ${userCoords || isLoadingLocation ? "" : "hk-tunnel-glow"}`}
              onPress={requestNearestSort}
              isLoading={isLoadingLocation}
            >
              {t("sortNearest")}
            </Button>
          </ButtonGroup>
        </div>
        <div className="mt-2 space-y-4">
          {groupedTunnels.map((group) => {
            const tunnels = group.tunnels;
            if (tunnels.length === 0) return null;

            return (
              <div key={group.category}>
                <div className="border-b border-black/20 dark:border-white/20 pb-1 mb-2">
                  <span className="text-2xl md:text-lg font-bold">{t(group.labelId)}</span>
                </div>
                <div className="space-y-2">
                  {tunnels.map(({ key }) => (
                    <HKTollCard
                      key={key}
                      tunnelKey={key}
                      priceAlert={getPriceChangeAlertForTunnel(key)}
                      vehicle={selectedVehicle}
                      currentDate={hkTime}
                      isPublicHoliday={isPublicHoliday}
                      isClient={isClient}
                      journeyReadings={journeyReadings}
                      detectorSpeeds={detectorSpeeds}
                      sortMode={sortMode}
                      userCoords={userCoords}
                      t={t}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Selection Controls */}
      <div className="card-base-min mb-8">
        {/* Vehicle Type Selection */}
        <h3 className="text-xl md:text-lg font-semibold mb-2">{t("vehicleTypeSelection")}</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(tollData.vehicleTypes).map(([key], index, array) => {
            if (!isValidVehicle(key)) return null;
            const vehicle = resolveLocalizedString(registryInfo.vehicleTypes[key].name, t);
            return (
              <Button
                key={key}
                color={selectedVehicle === key ? "primary" : "default"}
                size="lg"
                className={`text-xl md:text-lg ${
                  array.length % 2 === 1 && index === array.length - 1 ? "col-span-2" : ""
                }`}
                onPress={() => setSelectedVehicle(key)}
              >
                {vehicle}
              </Button>
            );
          })}
        </div>
      </div>
      {/* Advertisement */}
      <InArticleAdUnit />
      {/* Individual Tunnel Tables */}
      {Object.keys(tollData.tunnels).map((key) => {
        if (!isValidTunnel(key)) {
          return null;
        }
        return <TunnelTable key={key} tunnelKey={key} selectedVehicle={selectedVehicle} t={t} />;
      })}
      {/* About, Notes and Links */}
      <div className="px-3">
        {isAppleDevice && !isPWA && <IosHomeScreenGuide t={t} />}
        <h2 className="text-2xl font-bold py-2 mt-4">{t("aboutHeading")}</h2>
        <p>{t("aboutDescription")}</p>
        <h3 className="text-xl font-bold py-2">{t("notesHeading")}</h3>
        <ul>
          {registryInfo.notes.map((note, index) => (
            <li key={index} className="flex items-start">
              <span className="w-2 h-2 bg-black dark:bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
              {resolveLocalizedString(note, t)}
            </li>
          ))}
        </ul>
        <h3 className="text-xl font-bold py-2">{t("linksHeading")}</h3>
        <ul>
          {registryInfo.links.map((link, index) => (
            <li key={index} className="flex items-start">
              <span className="w-2 h-2 bg-black dark:bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <a href={t(link.url)} target="_blank" rel="noopener noreferrer">
                {t(link.id)}
              </a>
            </li>
          ))}
        </ul>
      </div>
      {/* Footer */}
      <p className="text-center text-sm text-gray-500 p-4">
        {t("lastUpdated")}
        <span suppressHydrationWarning>
          {hkTime
            ? hkTime.toLocaleString("zh-HK", {
                timeZone: "Asia/Hong_Kong",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })
            : t("loading")}
        </span>
      </p>
    </div>
  );
}

export default function Page({ texts, lang, localizedRoutes }: LocaleProps): JSX.Element {
  const t = createTranslateFunction(texts);
  const hreflang = getHreflang(lang, localizedRoutes, true);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("faq.whc.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.whc.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.cht.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.cht.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.all.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.all.answer"),
        },
      },
    ],
  };

  const [isAppleDevice, setIsAppleDevice] = useState<boolean>(false);
  const [isPWA, setIsPWA] = useState<boolean>(false);

  useEffect(() => {
    // @ts-ignore
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    // @ts-ignore
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isMac = /Mac/.test(userAgent);
    setIsAppleDevice(isIOS || isMac);
  }, []);

  useEffect(() => {
    // @ts-ignore
    setIsPWA(!!window.navigator.standalone);
  }, []);

  return (
    <>
      <Head>
        <title>{t("pageTitle")}</title>
        <meta name="description" content={t("pageDescription")} />
        <meta property="og:title" content={t("pageTitle")} />
        <meta property="og:description" content={t("pageDescription")} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://jaylydev.github.io/hk-tunnels-tolls/icon.png" />
        <meta property="og:locale" content={hreflang} />
        <link rel="manifest" href={t("pwa.url")} crossOrigin="use-credentials" />
        <meta name="apple-mobile-web-app-title" content={t("appTitle")} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/hk-tunnels-tolls/apple-touch-icon.png" />
        <link rel="alternate" hrefLang="en" href="https://jaylydev.github.io/hk-tunnels-tolls/" />
        <link rel="alternate" hrefLang="zh" href="https://jaylydev.github.io/zh/hk-tunnels-tolls/" />
        <meta property="twitter:card" content="summary" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
        />
      </Head>
      <StatsCollection />
      <SiteHeader t={t} icon="/hk-tunnels-tolls/icon.png" lang={lang} localizedRoutes={localizedRoutes} />
      <HeroUIProvider>
        <ThemeProvider>
          <HKTunnelsTollsApp t={t} lang={lang} isAppleDevice={isAppleDevice} isPWA={isPWA} />
        </ThemeProvider>
      </HeroUIProvider>
      <SiteFooter t={t} lang={lang} localizedRoutes={localizedRoutes} />
    </>
  );
}
