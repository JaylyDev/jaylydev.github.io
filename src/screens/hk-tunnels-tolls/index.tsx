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

type LocalizedString = string | { id: string };

type VehicleTypeIdentifier = keyof typeof registryInfo.vehicleTypes;

type HKTunnelIdentifier = keyof typeof registryInfo.tunnels;

type TrafficSource = "journey" | "detector";

interface JTIIndicator {
  loc: string;
  dest: string;
  approachMinutes: number;
  mapUrl?: string;
}

interface IrnSegment {
  id: string;
  name: string;
  type: "approach" | "bore";
}

interface DirectionRoute {
  direction: string;
  fromEntrance: number;
  loc?: string;
  dest?: string;
  approachMinutes?: number;
  speedLimitKmh?: number;
  approachSpeedLimitKmh?: number;
  indicators?: JTIIndicator[];
  irnSegments?: IrnSegment[];
}

interface TunnelInfo {
  name: LocalizedString;
  category: string;
  color: string;
  trafficSource: TrafficSource;
  lengthKm: number;
  maxLegalSpeedKmh?: number;
  entrances: Coordinates[];
  journeyRoutes: DirectionRoute[];
}

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
  speedKmh?: number | null;
  speedLimitKmh?: number | null;
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
  irnSpeeds: Record<string, number> | null;
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

interface HKTunnelsTollsAboutProps {
  aboutHtml: string;
}

function HKTunnelsTollsAbout({ aboutHtml }: HKTunnelsTollsAboutProps): JSX.Element {
  return <div className="markdown-body" dangerouslySetInnerHTML={{ __html: aboutHtml }} />;
}

interface HKTunnelsTollsAppProps {
  t: TranslateFunction;
  lang?: string;
  isAppleDevice?: boolean;
  isPWA?: boolean;
  aboutHtml: string;
  iosGuideHtml: string;
}

interface BadgeColors {
  background: string;
  text: string;
}

interface AlertBadgeProps {
  background: string;
  text: string;
  children: ReactNode;
}

function resolveLocalizedString(value: LocalizedString, t: TranslateFunction): string {
  if (typeof value === "string") return value;
  return t(value.id);
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function isTimeInRange(time: string, start: string, end: string): boolean {
  const timeMinutes = timeToMinutes(time);
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  if (startMinutes <= endMinutes) {
    return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
  }
  return timeMinutes >= startMinutes || timeMinutes <= endMinutes;
}

function getHongKongDate(utcDate: Date): { date: Date; dateString: string; timeString: string; dayOfWeek: number } {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Hong_Kong",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(utcDate).reduce(
    (acc, part) => {
      acc[part.type] = part.value;
      return acc;
    },
    {} as Record<string, string>,
  );
  const hkDate = new Date(`${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`);
  return {
    date: hkDate,
    dateString: `${parts.year}${parts.month}${parts.day}`,
    timeString: `${parts.hour}:${parts.minute}`,
    dayOfWeek: hkDate.getDay(),
  };
}

function haversineKm(a: Coordinates, b: Coordinates): number {
  const toRad = (deg: number): number => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function nearestEntranceKm(entrances: Coordinates[], coords: Coordinates): number {
  return Math.min(...entrances.map((e) => haversineKm(coords, e)));
}

function nearestEntranceIndex(entrances: Coordinates[], coords: Coordinates): number {
  let bestIndex = 0;
  let bestDistance = Infinity;
  entrances.forEach((e, i) => {
    const d = haversineKm(coords, e);
    if (d < bestDistance) {
      bestDistance = d;
      bestIndex = i;
    }
  });
  return bestIndex;
}

const COORDS_STORAGE_KEY = "hk-tunnel-coords";

function readStoredCoords(): Coordinates | null {
  try {
    const raw = localStorage.getItem(COORDS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Coordinates;
    if (typeof parsed?.lat === "number" && typeof parsed?.lng === "number") return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

function storeCoords(coords: Coordinates): void {
  try {
    localStorage.setItem(COORDS_STORAGE_KEY, JSON.stringify(coords));
  } catch {
    /* ignore */
  }
}

function isValidVehicle(v: string): v is VehicleTypeIdentifier {
  return Object.keys(registryInfo.vehicleTypes).includes(v);
}

function isValidTunnel(t: string): t is HKTunnelIdentifier {
  return Object.keys(registryInfo.tunnels).includes(t);
}

const JOURNEY_TIME_URL = "https://resource.data.one.gov.hk/td/jss/Journeytimev2.xml";
const JOURNEY_REFRESH_MS = 120000;

function journeyKey(loc: string, dest: string): string {
  return `${loc}|${dest}`;
}

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

const IRN_SPEED_URL = "https://resource.data.one.gov.hk/td/traffic-detectors/irnAvgSpeed-all.xml";
const IRN_REFRESH_MS = 60000;

function parseIrnSpeeds(xml: string): Record<string, number> {
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const speeds: Record<string, number> = {};
  Array.from(doc.getElementsByTagName("segment")).forEach((seg) => {
    const id = seg.getElementsByTagName("segment_id")[0]?.textContent?.trim();
    const valid = seg.getElementsByTagName("valid")[0]?.textContent?.trim();
    const speed = Number(seg.getElementsByTagName("speed")[0]?.textContent);
    if (id && valid === "Y" && speed > 0) {
      speeds[id] = speed;
    }
  });
  return speeds;
}

function speedCongestionStatus(tunnel: TunnelInfo, minutes: number, speedLimitKmh: number = 70): TrafficStatus {
  if (!(minutes > 0)) return TrafficStatus.Unknown;
  const effectiveLimit = speedLimitKmh || tunnel.maxLegalSpeedKmh || 70;
  const avgSpeedKmh = (tunnel.lengthKm / (minutes * 60)) * 3600;
  if (avgSpeedKmh < effectiveLimit * 0.15) return TrafficStatus.Congested;
  if (avgSpeedKmh < effectiveLimit * 0.4) return TrafficStatus.Slow;
  return TrafficStatus.Unknown;
}

function adjustMinutesForStatus(tunnel: TunnelInfo, status: TrafficStatus, minutes: number | null): number | null {
  if (minutes === null) return minutes;
  const limit = tunnel.maxLegalSpeedKmh || 70;
  if (status === TrafficStatus.Slow) {
    return Math.max(minutes, Math.round((tunnel.lengthKm / (limit * 0.5)) * 60));
  }
  if (status === TrafficStatus.Congested) {
    return Math.max(minutes, Math.round((tunnel.lengthKm / Math.max(15, limit * 0.2)) * 60));
  }
  return minutes;
}

function readingForRoute(
  tunnel: TunnelInfo,
  route: DirectionRoute,
  journeyReadings: Record<string, JourneyReading> | null,
  irnSpeeds: Record<string, number> | null,
): JourneyReading | null {
  const routeLimit = route.speedLimitKmh || tunnel.maxLegalSpeedKmh || 70;
  const floorMinutes = Math.round((tunnel.lengthKm * 1000) / (routeLimit / 3.6) / 60);

  const candidateIndicators: JTIIndicator[] =
    route.indicators && route.indicators.length > 0
      ? route.indicators
      : route.loc && route.dest
        ? [{ loc: route.loc, dest: route.dest, approachMinutes: route.approachMinutes || 0 }]
        : [];

  const validItems: { netMinutes: number; status: TrafficStatus }[] = [];
  if (candidateIndicators.length > 0 && journeyReadings) {
    for (const ind of candidateIndicators) {
      const rawReading = journeyReadings[journeyKey(ind.loc, ind.dest)] ?? null;
      if (rawReading && rawReading.minutes !== null && rawReading.minutes > 0) {
        const netMinutes = Math.max(floorMinutes, rawReading.minutes - ind.approachMinutes);
        validItems.push({ netMinutes, status: rawReading.status });
      }
    }
  }

  // 1. Primary: JTIS journey boards
  if (validItems.length > 0) {
    let best = validItems[0];
    for (const item of validItems) {
      if (item.netMinutes < best.netMinutes) best = item;
    }
    const medianMinutes = best.netMinutes;
    const minutesBasedEffectiveStatus = speedCongestionStatus(tunnel, medianMinutes, routeLimit);
    const status = Math.max(best.status, minutesBasedEffectiveStatus) as TrafficStatus;
    const finalMinutes = adjustMinutesForStatus(tunnel, status, medianMinutes);
    let finalSpeedKmh: number | null = null;
    if (finalMinutes != null && finalMinutes > 0) {
      finalSpeedKmh = Math.round((tunnel.lengthKm / finalMinutes) * 60);
    }

    return {
      status,
      minutes: finalMinutes,
      speedKmh: finalSpeedKmh,
      speedLimitKmh: routeLimit,
    };
  }

  // 2. Fallback: IRN Segments (Tunnel bore only)
  const validBoreSpeeds: number[] = [];
  if (route.irnSegments && route.irnSegments.length > 0 && irnSpeeds) {
    for (const seg of route.irnSegments) {
      if (seg.type === "bore") {
        const spd = irnSpeeds[seg.id];
        if (typeof spd === "number" && spd > 0) {
          validBoreSpeeds.push(spd);
        }
      }
    }
  }

  if (validBoreSpeeds.length > 0) {
    const govSpeed = validBoreSpeeds.reduce((a, b) => a + b, 0) / validBoreSpeeds.length;

    const smoothThresh = routeLimit * 0.75;
    const slowThresh = routeLimit * 0.4;
    const status =
      govSpeed >= smoothThresh
        ? TrafficStatus.Smooth
        : govSpeed >= slowThresh
          ? TrafficStatus.Slow
          : TrafficStatus.Congested;

    const minutes = Math.max(floorMinutes, Math.round((tunnel.lengthKm / Math.min(govSpeed, routeLimit)) * 60));

    return {
      status,
      minutes,
      speedKmh: Math.round(govSpeed),
      speedLimitKmh: routeLimit,
    };
  }

  return null;
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

function getScheduleContext(currentTime: Date, isPublicHoliday: boolean): ScheduleContext {
  const hkInfo = getHongKongDate(currentTime);
  return { isHolidaySchedule: hkInfo.dayOfWeek === 0 || isPublicHoliday, currentTimeStr: hkInfo.timeString };
}

function getCurrentTollForTunnel(
  selectedVehicle: VehicleTypeIdentifier,
  tunnelKey: HKTunnelIdentifier,
  currentTime: Date | null,
  isPublicHoliday: boolean,
  isClient: boolean,
  t: TranslateFunction,
): CurrentTollResult {
  if (!currentTime || !isClient) return { message: t("loading") };
  const vehicle = tollData.vehicleTypes[selectedVehicle];
  const tunnel = tollData.tunnels[tunnelKey];
  if (vehicle.fixedTolls && tunnelKey in vehicle.fixedTolls) {
    return { message: `$${vehicle.fixedTolls[tunnelKey as keyof typeof vehicle.fixedTolls]}` };
  }
  if (!tunnel || !("timeVaryingTolls" in tunnel)) return { message: t("unableToCalculate") };
  const { isHolidaySchedule, currentTimeStr } = getScheduleContext(currentTime, isPublicHoliday);
  const timeSlots = isHolidaySchedule ? tunnel.timeVaryingTolls.sundays_and_holidays : tunnel.timeVaryingTolls.weekdays;
  for (const period of timeSlots.periods) {
    const [startTime, endTime] = period.timeRange.split(" - ");
    if (isTimeInRange(currentTimeStr, startTime, endTime)) {
      const tollForTunnel = period.toll;
      if (typeof tollForTunnel === "object" && "range" in tollForTunnel) {
        const [min, max] = tollForTunnel.range;
        const timePeriod = Math.trunc((timeToMinutes(currentTimeStr) - timeToMinutes(startTime)) / 2);
        const currentToll = min > max ? min - timePeriod * 2 : min + timePeriod * 2;
        if ("multiplier" in vehicle) {
          return { message: `$${(currentToll * vehicle.multiplier).toFixed(1)}`, isTransitionTime: true };
        }
        return { message: `$${currentToll}`, isTransitionTime: true };
      } else {
        if ("multiplier" in vehicle) {
          return { message: `$${Math.round(tollForTunnel * vehicle.multiplier * 10) / 10}` };
        }
        return { message: `$${tollForTunnel}` };
      }
    }
  }
  return { message: t("unableToCalculate") };
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
  irnSpeeds: Record<string, number> | null;
  sortMode: SortMode;
  userCoords: Coordinates | null;
  t: TranslateFunction;
}

function TrafficRows({
  tunnelKey,
  journeyReadings,
  irnSpeeds,
  sortMode,
  userCoords,
  t,
}: TrafficRowsProps): JSX.Element | null {
  const tunnel = getTunnelInfo(tunnelKey);
  const routes = tunnel.journeyRoutes;
  if (!routes) return null;

  const activeRoutes = useMemo(() => {
    if (sortMode === SortMode.Nearest && userCoords) {
      const nearIndex = nearestEntranceIndex(tunnel.entrances, userCoords);
      const towards = routes.filter((route) => route.fromEntrance === nearIndex);
      if (towards.length > 0) return towards;
    }
    return routes;
  }, [sortMode, userCoords, routes, tunnel.entrances]);

  const TRAFFIC_LABEL_IDS: Record<TrafficStatus, string> = {
    [TrafficStatus.Unknown]: "traffic.unavailable",
    [TrafficStatus.Smooth]: "traffic.smooth",
    [TrafficStatus.Slow]: "traffic.slow",
    [TrafficStatus.Congested]: "traffic.congested",
    [TrafficStatus.Closed]: "traffic.closed",
  };

  const rows = activeRoutes
    .map((route) => ({ route, reading: readingForRoute(tunnel, route, journeyReadings, irnSpeeds) }))
    .filter((row): row is { route: DirectionRoute; reading: JourneyReading } => row.reading !== null);
  if (rows.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5 py-1">
      {rows.map(({ route, reading }) => {
        const colors = TRAFFIC_COLORS[reading.status];
        return (
          <div key={route.direction} className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xl md:text-base text-gray-600 dark:text-gray-300">
              {t(`direction.${route.direction}`)}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
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

function HKTollCard(props: TollCardProps): JSX.Element {
  const { tunnelKey, priceAlert, vehicle, currentDate, isPublicHoliday, isClient } = props;
  const { journeyReadings, irnSpeeds, sortMode, userCoords, t } = props;
  const tollResult = getCurrentTollForTunnel(vehicle, tunnelKey, currentDate, isPublicHoliday, isClient, t);
  const tunnel = getTunnelInfo(tunnelKey);

  return (
    <div className="flex gap-3 border-b border-black dark:border-white pb-1 last:border-b-0">
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
          irnSpeeds={irnSpeeds}
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
  iosGuideHtml: string;
}

function IosHomeScreenGuide({ iosGuideHtml }: IosHomeScreenGuideProps): JSX.Element {
  return <div className="markdown-body" dangerouslySetInnerHTML={{ __html: iosGuideHtml }} />;
}

function HKTunnelsTollsApp({
  t,
  lang,
  isAppleDevice = false,
  isPWA = false,
  aboutHtml,
  iosGuideHtml,
}: HKTunnelsTollsAppProps): JSX.Element {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleTypeIdentifier>("privateCar");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isPublicHoliday, setIsPublicHoliday] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [sortMode, setSortMode] = useState<SortMode>(SortMode.Default);
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [journeyReadings, setJourneyReadings] = useState<Record<string, JourneyReading> | null>(null);
  const [irnSpeeds, setIrnSpeeds] = useState<Record<string, number> | null>(null);

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

  useEffect(() => {
    let cancelled = false;
    const loadJourneyTimes = async () => {
      try {
        const response = await fetch(JOURNEY_TIME_URL);
        if (!response.ok) return;
        const xml = await response.text();
        if (!cancelled) setJourneyReadings(parseJourneyTimes(xml));
      } catch {
        /* keep last successful reading */
      }
    };
    loadJourneyTimes();
    const intervalId = setInterval(loadJourneyTimes, JOURNEY_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadIrnSpeeds = async () => {
      try {
        const response = await fetch(IRN_SPEED_URL);
        if (!response.ok) return;
        const xml = await response.text();
        if (!cancelled) setIrnSpeeds(parseIrnSpeeds(xml));
      } catch {
        /* keep last successful reading */
      }
    };
    loadIrnSpeeds();
    const intervalId = setInterval(loadIrnSpeeds, IRN_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  const holidays = useMemo(() => {
    const set = new Set<string>();
    if (publicHolidayData.vcalendar?.[0]?.vevent) {
      publicHolidayData.vcalendar[0].vevent.forEach((event) => {
        const dateStr = event.dtstart[0] as string;
        set.add(dateStr);
      });
    }
    return set;
  }, []);

  useEffect(() => {
    if (currentTime) {
      const hkInfo = getHongKongDate(currentTime);
      setIsPublicHoliday(holidays.has(hkInfo.dateString));
    }
  }, [currentTime, holidays]);

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

    const isVisible = (ad: HTMLElement): boolean => {
      const style = getComputedStyle(ad);
      return style.display !== "none" && style.visibility !== "hidden";
    };

    const evaluate = (ad: Element | null) => {
      if (hasHiddenVignette || hideTimer !== null) return;
      if (!isVignetteAd(ad) || !isVisible(ad)) return;
      const delayMs = 3000 + Math.floor(Math.random() * 4001);
      hideTimer = window.setTimeout(() => {
        hideTimer = null;
        if (ad.isConnected) {
          ad.style.setProperty("display", "none", "important");
          hasHiddenVignette = true;
        }
      }, delayMs);
    };

    const watch = (node: Node) => {
      if (!(node instanceof HTMLElement) || node.tagName !== "INS" || watched.has(node)) return;
      watched.add(node);
      const elementObserver = new MutationObserver(() => evaluate(node));
      elementObserver.observe(node, { attributes: true, attributeFilter: ["style", "data-vignette-loaded", "class"] });
      elementObservers.push(elementObserver);
      evaluate(node);
    };

    const rootObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) mutation.addedNodes.forEach(watch);
    });
    rootObserver.observe(root, { childList: true });
    Array.from(root.children).forEach(watch);

    return () => {
      rootObserver.disconnect();
      elementObservers.forEach((observer) => observer.disconnect());
      if (hideTimer !== null) clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const v = searchParams.get("vehicle") ?? localStorage.getItem("hk-tunnel-vehicle");
    if (v && isValidVehicle(v)) setSelectedVehicle(v);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("hk-tunnel-sort") !== "nearest") return;
    const cached = readStoredCoords();
    if (!cached) return;
    setUserCoords(cached);
    setSortMode(SortMode.Nearest);
    startLocationWatch();
  }, [startLocationWatch]);

  useEffect(() => {
    if (sortMode === SortMode.Default) {
      stopLocationWatch();
      awaitingFirstFixRef.current = false;
      setIsLoadingLocation(false);
    }
  }, [sortMode, stopLocationWatch]);

  useEffect(() => stopLocationWatch, [stopLocationWatch]);

  useEffect(() => {
    localStorage.setItem("hk-tunnel-vehicle", selectedVehicle);
  }, [selectedVehicle]);

  useEffect(() => {
    localStorage.setItem("hk-tunnel-sort", sortMode === SortMode.Nearest ? "nearest" : "default");
  }, [sortMode]);

  const getPriceChangeAlertForTunnel = (tunnelKey: HKTunnelIdentifier): string => {
    if (!tollData || !currentTime) return "";
    const vehicle = tollData.vehicleTypes[selectedVehicle];
    const tunnel = tollData.tunnels[tunnelKey];
    if (!vehicle.hasTimeVaryingToll) return "";
    if (!tunnel || !("timeVaryingTolls" in tunnel)) return "";
    const { isHolidaySchedule, currentTimeStr } = getScheduleContext(currentTime, isPublicHoliday);
    const timeSlots = isHolidaySchedule
      ? tunnel.timeVaryingTolls.sundays_and_holidays
      : tunnel.timeVaryingTolls.weekdays;
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
    let nextPeriodIndex = (currentPeriodIndex + 1) % timeSlots.periods.length;
    let nextPeriod = timeSlots.periods[nextPeriodIndex];
    while (nextPeriod && typeof nextPeriod.toll === "object") {
      nextPeriodIndex = (nextPeriodIndex + 1) % timeSlots.periods.length;
      nextPeriod = timeSlots.periods[nextPeriodIndex];
      if (nextPeriodIndex === currentPeriodIndex) break;
    }
    if (nextPeriod && nextPeriod.toll !== currentPeriod.toll && typeof nextPeriod.toll !== "object") {
      const nextToll = nextPeriod.toll;
      const nextTollDisplay =
        "multiplier" in vehicle && vehicle.multiplier
          ? `$${Math.round(nextToll * vehicle.multiplier * 10) / 10}`
          : `$${nextToll}`;
      return t("priceChangeAlert", nextPeriod.timeRange.split(" - ")[0], nextTollDisplay);
    }
    return "";
  };

  const requestNearestSort = () => {
    if (userCoords) {
      setSortMode(SortMode.Nearest);
      startLocationWatch();
      return;
    }
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
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
    if (sortByDistance) tunnels.sort((a, b) => (a.distanceKm as number) - (b.distanceKm as number));
    return tunnels;
  };

  const vehicleName = resolveLocalizedString(registryInfo.vehicleTypes[selectedVehicle].name, t);
  const vehicleDescription = registryInfo.vehicleTypes[selectedVehicle].description;

  const groupedTunnels = useMemo(() => {
    return TUNNEL_GROUPS.map((group) => ({ ...group, tunnels: buildGroup(group.category) }));
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
                      currentDate={currentTime}
                      isPublicHoliday={isPublicHoliday}
                      isClient={isClient}
                      journeyReadings={journeyReadings}
                      irnSpeeds={irnSpeeds}
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
        if (!isValidTunnel(key)) return null;
        return <TunnelTable key={key} tunnelKey={key} selectedVehicle={selectedVehicle} t={t} />;
      })}

      {/* About, Notes and Links */}
      <div>
        {isAppleDevice && !isPWA && <IosHomeScreenGuide iosGuideHtml={iosGuideHtml} />}
        <HKTunnelsTollsAbout aboutHtml={aboutHtml} />
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-gray-500 p-4">
        {t("lastUpdated")}
        <span suppressHydrationWarning>
          {currentTime
            ? currentTime.toLocaleString(lang === "zh" ? "zh-HK" : "en-US", {
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

export interface HKTunnelsTollsScreenProps extends LocaleProps {
  aboutHtml: string;
  iosGuideHtml: string;
}

export default function Page({
  texts,
  lang,
  localizedRoutes,
  aboutHtml,
  iosGuideHtml,
}: HKTunnelsTollsScreenProps): JSX.Element {
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
          <HKTunnelsTollsApp
            t={t}
            lang={lang}
            isAppleDevice={isAppleDevice}
            isPWA={isPWA}
            aboutHtml={aboutHtml}
            iosGuideHtml={iosGuideHtml}
          />
        </ThemeProvider>
      </HeroUIProvider>
      <SiteFooter t={t} lang={lang} localizedRoutes={localizedRoutes} />
    </>
  );
}
