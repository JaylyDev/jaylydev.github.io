import Head from "next/head";
import dynamic from "next/dynamic";
import { StatsCollection, SiteFooter, SiteHeader } from "@/components/SiteFormat";
import { useState, useEffect, useMemo, useRef, useCallback, JSX, ReactNode } from "react";
import { Button, ButtonGroup, HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { createTranslateFunction, getHreflang, LocaleProps, TranslateFunction } from "@/locale/i18n";
import publicHolidayData from "../data/public_holidays.json";
import registryInfo from "../data/registry.insider.json";
import tollData from "../data/tolls.json";

const SegmentMap = dynamic(() => import("./SegmentMap"), {
  ssr: false,
  loading: () => (
    <div className="card-base-min mb-6 h-[450px] flex items-center justify-center text-gray-500 font-mono">
      Loading IRN Network Map...
    </div>
  ),
});

// ─── Type definitions ─────────────────────────────────────────────────────────

type LocalizedString = string | { id: string };

type VehicleTypeIdentifier = keyof typeof registryInfo.vehicleTypes;

type HKTunnelIdentifier = keyof typeof registryInfo.tunnels;

type TrafficSource = "journey" | "detector";

interface DetectorEntry {
  id: string;
  mapUrl?: string;
}

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
  detectors?: (string | DetectorEntry)[];
  approachMinutes?: number;
  approachDetectors?: (string | DetectorEntry)[];
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
  lengthKm?: number;
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

interface DebugDetectorInfo {
  id: string;
  speedKmh: number | null;
  isApproach?: boolean;
  mapUrl?: string;
}

interface DebugIndicatorInfo {
  loc: string;
  dest: string;
  rawMinutes: number | null;
  approachMinutes: number;
  netMinutes: number | null;
  status: TrafficStatus;
  mapUrl?: string;
}

interface DebugIrnSegment {
  id: string;
  name: string;
  type: "approach" | "bore";
  speedKmh: number | null;
}

interface JourneyReading {
  status: TrafficStatus;
  minutes: number | null;
  speedKmh?: number | null;
  speedLimitKmh?: number | null;
  debugIndicators?: DebugIndicatorInfo[];
  debugDetectors?: DebugDetectorInfo[];
  debugIrnSegments?: DebugIrnSegment[];
  debugMedianMinutes?: number | null;
  debugStatusSource?: "irn" | "detector" | "journey-fallback";
  debugGovSpeedKmh?: number | null;
  debugThresholds?: {
    slowMinutes: number;
    congestedMinutes: number;
  };
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

interface CurrentTollResult {
  message: string;
  isTransitionTime?: true;
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

interface TrafficRowsProps {
  tunnelKey: HKTunnelIdentifier;
  journeyReadings: Record<string, JourneyReading> | null;
  detectorSpeeds: Record<string, number> | null;
  irnSpeeds: Record<string, number> | null;
  sortMode: SortMode;
  userCoords: Coordinates | null;
  t: TranslateFunction;
}

interface TollCardProps {
  tunnelKey: HKTunnelIdentifier;
  vehicle: VehicleTypeIdentifier;
  priceAlert?: string;
  tomorrowToll?: { dayType: string; time?: string; toll: string; periodName?: LocalizedString } | null;
  currentDate: Date | null;
  isPublicHoliday: boolean;
  isClient: boolean;
  journeyReadings: Record<string, JourneyReading> | null;
  detectorSpeeds: Record<string, number> | null;
  irnSpeeds: Record<string, number> | null;
  sortMode: SortMode;
  userCoords: Coordinates | null;
  t: TranslateFunction;
}

interface ScheduleContext {
  isHolidaySchedule: boolean;
  currentTimeStr: string;
}

// ─── Pure utility functions ───────────────────────────────────────────────────

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

// ─── Live feed URLs and parsers ───────────────────────────────────────────────

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

const DETECTOR_URL = "https://resource.data.one.gov.hk/td/traffic-detectors/rawSpeedVol-all.xml";
const DETECTOR_REFRESH_MS = 60000;

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

// ─── Traffic status logic ─────────────────────────────────────────────────────

function speedCongestionStatus(
  tunnel: TunnelInfo,
  minutes: number,
  speedLimitKmh: number = 70,
): TrafficStatus {
  if (tunnel.lengthKm == null || !(minutes > 0)) return TrafficStatus.Unknown;
  const effectiveLimit = speedLimitKmh || tunnel.maxLegalSpeedKmh || 70;
  const avgSpeedKmh = (tunnel.lengthKm / (minutes * 60)) * 3600;
  if (avgSpeedKmh < effectiveLimit * 0.15) return TrafficStatus.Congested;
  if (avgSpeedKmh < effectiveLimit * 0.4) return TrafficStatus.Slow;
  return TrafficStatus.Unknown;
}

function normalizeDetector(d: string | DetectorEntry): DetectorEntry {
  if (typeof d === "string") return { id: d };
  return d;
}

function calculateApproachStatus(
  detectors: (string | DetectorEntry)[],
  detectorSpeeds: Record<string, number>,
  speedLimitKmh: number = 70,
): { status: TrafficStatus; averageSpeed: number | null } {
  let green = 0;
  let yellow = 0;
  let red = 0;
  let validCount = 0;
  let totalSpeed = 0;
  const smoothThreshold = speedLimitKmh * 0.75;
  const slowThreshold = speedLimitKmh * 0.4;
  for (const d of detectors) {
    const id = typeof d === "string" ? d : d.id;
    const speed = detectorSpeeds[id];
    if (typeof speed === "number" && speed > 0) {
      validCount++;
      totalSpeed += speed;
      if (speed >= smoothThreshold) green++;
      else if (speed >= slowThreshold) yellow++;
      else red++;
    }
  }
  if (validCount === 0) return { status: TrafficStatus.Unknown, averageSpeed: null };
  const pGreen = green / validCount;
  const pYellow = yellow / validCount;
  const pRed = red / validCount;
  const score = pGreen * 1 + pYellow * 2 + pRed * 3;
  let status = TrafficStatus.Smooth;
  if (pRed >= 0.2 || score >= 2.2) status = TrafficStatus.Congested;
  else if (pYellow >= 0.3 || score >= 1.35) status = TrafficStatus.Slow;
  return { status, averageSpeed: Math.round(totalSpeed / validCount) };
}

function adjustMinutesForStatus(tunnel: TunnelInfo, status: TrafficStatus, minutes: number | null): number | null {
  if (minutes === null || tunnel.lengthKm == null) return minutes;
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
  detectorSpeeds: Record<string, number> | null,
  irnSpeeds: Record<string, number> | null,
): JourneyReading | null {
  let approachStatus = TrafficStatus.Unknown;
  let approachSpeed: number | null = null;
  const routeLimit = route.speedLimitKmh || tunnel.maxLegalSpeedKmh || 70;
  const approachLimit = route.approachSpeedLimitKmh || routeLimit;
  const floorMinutes =
    tunnel.lengthKm != null && routeLimit != null ? Math.round((tunnel.lengthKm * 1000) / (routeLimit / 3.6) / 60) : 2;

  const debugThresholds =
    tunnel.lengthKm != null
      ? {
          slowMinutes: Math.floor((tunnel.lengthKm * 60) / (routeLimit * 0.4)) + 1,
          congestedMinutes: Math.floor((tunnel.lengthKm * 60) / (routeLimit * 0.15)) + 1,
        }
      : undefined;

  const debugIrnSegments: DebugIrnSegment[] = [];
  if (route.irnSegments && route.irnSegments.length > 0) {
    for (const seg of route.irnSegments) {
      const spd = irnSpeeds && typeof irnSpeeds[seg.id] === "number" ? Math.round(irnSpeeds[seg.id]) : null;
      debugIrnSegments.push({ id: seg.id, name: seg.name, type: seg.type, speedKmh: spd });
    }
  }

  const debugDetectors: DebugDetectorInfo[] = [];
  if (route.detectors && route.detectors.length > 0) {
    for (const d of route.detectors) {
      const det = normalizeDetector(d);
      const spd = detectorSpeeds && typeof detectorSpeeds[det.id] === "number" ? Math.round(detectorSpeeds[det.id]) : null;
      debugDetectors.push({ id: det.id, speedKmh: spd, isApproach: false, mapUrl: det.mapUrl });
    }
  }
  if (route.approachDetectors && route.approachDetectors.length > 0) {
    for (const d of route.approachDetectors) {
      const det = normalizeDetector(d);
      const spd = detectorSpeeds && typeof detectorSpeeds[det.id] === "number" ? Math.round(detectorSpeeds[det.id]) : null;
      debugDetectors.push({ id: det.id, speedKmh: spd, isApproach: true, mapUrl: det.mapUrl });
    }
  }

  if (route.approachDetectors && route.approachDetectors.length > 0 && detectorSpeeds) {
    const result = calculateApproachStatus(route.approachDetectors, detectorSpeeds, approachLimit);
    approachStatus = result.status;
    approachSpeed = result.averageSpeed;
  }

  let inTunnelDetectorStatus = TrafficStatus.Unknown;
  let inTunnelDetectorSpeed: number | null = null;
  let inTunnelDetectorMinutes: number | null = null;
  if (route.detectors && route.detectors.length > 0 && detectorSpeeds && tunnel.lengthKm != null) {
    const speeds = route.detectors
      .map((d) => {
        const id = typeof d === "string" ? d : d.id;
        return detectorSpeeds[id];
      })
      .filter((speed): speed is number => typeof speed === "number" && speed > 0);
    if (speeds.length > 0) {
      const meanSpeed = speeds.reduce((sum, s) => sum + s, 0) / speeds.length;
      const effectiveSpeed = Math.min(meanSpeed, routeLimit);
      inTunnelDetectorMinutes = Math.round((tunnel.lengthKm / effectiveSpeed) * 60);
      inTunnelDetectorSpeed = Math.round(meanSpeed);
      const smoothThreshold = routeLimit * 0.75;
      const slowThreshold = routeLimit * 0.4;
      inTunnelDetectorStatus =
        meanSpeed >= smoothThreshold
          ? TrafficStatus.Smooth
          : meanSpeed >= slowThreshold
            ? TrafficStatus.Slow
            : TrafficStatus.Congested;
    }
  }

  const candidateIndicators: JTIIndicator[] =
    route.indicators && route.indicators.length > 0
      ? route.indicators
      : route.loc && route.dest
        ? [{ loc: route.loc, dest: route.dest, approachMinutes: route.approachMinutes || 0 }]
        : [];

  const debugIndicators: DebugIndicatorInfo[] = [];
  const validItems: { netMinutes: number; status: TrafficStatus }[] = [];

  if (candidateIndicators.length > 0 && journeyReadings) {
    for (const ind of candidateIndicators) {
      const rawReading = journeyReadings[journeyKey(ind.loc, ind.dest)] ?? null;
      if (rawReading && rawReading.minutes !== null && rawReading.minutes > 0) {
        const netMinutes = Math.max(floorMinutes, rawReading.minutes - ind.approachMinutes);
        validItems.push({ netMinutes, status: rawReading.status });
        debugIndicators.push({
          loc: ind.loc,
          dest: ind.dest,
          rawMinutes: rawReading.minutes,
          approachMinutes: ind.approachMinutes,
          netMinutes,
          status: rawReading.status,
          mapUrl: ind.mapUrl,
        });
      } else {
        debugIndicators.push({
          loc: ind.loc,
          dest: ind.dest,
          rawMinutes: rawReading ? rawReading.minutes : null,
          approachMinutes: ind.approachMinutes,
          netMinutes: null,
          status: rawReading ? rawReading.status : TrafficStatus.Unknown,
          mapUrl: ind.mapUrl,
        });
      }
    }
  }

  // 1. Primary: IRN Segments (500m approach + entire tunnel bore)
  const validApproachSpeeds = debugIrnSegments
    .filter((s) => s.type === "approach" && s.speedKmh !== null && s.speedKmh > 0)
    .map((s) => s.speedKmh as number);
  const validBoreSpeeds = debugIrnSegments
    .filter((s) => s.type === "bore" && s.speedKmh !== null && s.speedKmh > 0)
    .map((s) => s.speedKmh as number);

  if (validApproachSpeeds.length > 0 || validBoreSpeeds.length > 0) {
    const apprMean =
      validApproachSpeeds.length > 0
        ? validApproachSpeeds.reduce((a, b) => a + b, 0) / validApproachSpeeds.length
        : null;
    const boreMean =
      validBoreSpeeds.length > 0 ? validBoreSpeeds.reduce((a, b) => a + b, 0) / validBoreSpeeds.length : null;

    const govSpeed =
      apprMean !== null && boreMean !== null ? Math.min(apprMean, boreMean) : (apprMean ?? (boreMean as number));

    const smoothThresh = routeLimit * 0.75;
    const slowThresh = routeLimit * 0.4;
    const status =
      govSpeed >= smoothThresh
        ? TrafficStatus.Smooth
        : govSpeed >= slowThresh
          ? TrafficStatus.Slow
          : TrafficStatus.Congested;

    let minutes = Math.max(floorMinutes, Math.round(((tunnel.lengthKm || 2) / Math.min(govSpeed, routeLimit)) * 60));
    minutes = adjustMinutesForStatus(tunnel, status, minutes) as number;

    return {
      status,
      minutes,
      speedKmh: Math.round(govSpeed),
      speedLimitKmh: routeLimit,
      debugIrnSegments: debugIrnSegments.length > 0 ? debugIrnSegments : undefined,
      debugIndicators: debugIndicators.length > 0 ? debugIndicators : undefined,
      debugDetectors: debugDetectors.length > 0 ? debugDetectors : undefined,
      debugMedianMinutes: minutes,
      debugStatusSource: "irn",
      debugGovSpeedKmh: Math.round(govSpeed),
      debugThresholds,
    };
  }

  // 2. Secondary fallback: Hardware speed detectors
  const hasDetectorSignal =
    inTunnelDetectorStatus !== TrafficStatus.Unknown || approachStatus !== TrafficStatus.Unknown;

  if (hasDetectorSignal) {
    const status = Math.max(inTunnelDetectorStatus, approachStatus) as TrafficStatus;
    const govSpeed = inTunnelDetectorSpeed ?? approachSpeed;
    let minutes: number | null = floorMinutes;
    if (tunnel.lengthKm != null && govSpeed != null && govSpeed > 0) {
      minutes = Math.max(floorMinutes, Math.round((tunnel.lengthKm / Math.min(govSpeed, routeLimit)) * 60));
    }
    minutes = adjustMinutesForStatus(tunnel, status, minutes);
    return {
      status,
      minutes,
      speedKmh: govSpeed != null ? Math.round(govSpeed) : null,
      speedLimitKmh: routeLimit,
      debugIrnSegments: debugIrnSegments.length > 0 ? debugIrnSegments : undefined,
      debugIndicators: debugIndicators.length > 0 ? debugIndicators : undefined,
      debugDetectors: debugDetectors.length > 0 ? debugDetectors : undefined,
      debugMedianMinutes: minutes,
      debugStatusSource: "detector",
      debugGovSpeedKmh: govSpeed != null ? Math.round(govSpeed) : null,
      debugThresholds,
    };
  }

  // 3. Fallback: JTIS journey boards
  if (validItems.length === 0) return null;
  let best = validItems[0];
  for (const item of validItems) if (item.netMinutes < best.netMinutes) best = item;
  const medianMinutes = best.netMinutes;
  const minutesBasedEffectiveStatus = speedCongestionStatus(tunnel, medianMinutes, routeLimit);
  const status = Math.max(best.status, minutesBasedEffectiveStatus) as TrafficStatus;
  const finalMinutes = adjustMinutesForStatus(tunnel, status, medianMinutes);
  let finalSpeedKmh: number | null = null;
  if (finalMinutes != null && finalMinutes > 0 && tunnel.lengthKm != null) {
    finalSpeedKmh = Math.round((tunnel.lengthKm / finalMinutes) * 60);
  }

  return {
    status,
    minutes: finalMinutes,
    speedKmh: finalSpeedKmh,
    speedLimitKmh: routeLimit,
    debugIrnSegments: debugIrnSegments.length > 0 ? debugIrnSegments : undefined,
    debugIndicators: debugIndicators.length > 0 ? debugIndicators : undefined,
    debugDetectors: debugDetectors.length > 0 ? debugDetectors : undefined,
    debugMedianMinutes: medianMinutes,
    debugStatusSource: "journey-fallback",
    debugThresholds,
  };
}

const TRAFFIC_COLORS: Record<TrafficStatus, BadgeColors> = {
  [TrafficStatus.Unknown]: { background: "bg-gray-100 dark:bg-gray-800", text: "text-gray-800 dark:text-gray-200" },
  [TrafficStatus.Smooth]: { background: "bg-green-100 dark:bg-green-900", text: "text-green-800 dark:text-green-200" },
  [TrafficStatus.Slow]: { background: "bg-amber-100 dark:bg-amber-900", text: "text-amber-800 dark:text-amber-200" },
  [TrafficStatus.Congested]: { background: "bg-red-100 dark:bg-red-900", text: "text-red-800 dark:text-red-200" },
  [TrafficStatus.Closed]: { background: "bg-red-100 dark:bg-red-900", text: "text-red-800 dark:text-red-200" },
};

// ─── Toll logic ───────────────────────────────────────────────────────────────

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

// ─── UI components ────────────────────────────────────────────────────────────

function AlertBadge({ background, text, children }: AlertBadgeProps): JSX.Element {
  return (
    <span
      className={`text-[1.45rem] md:text-lg ${background} ${text} px-3 rounded-md font-medium inline-block text-center`}
    >
      {children}
    </span>
  );
}

function TrafficRows({
  tunnelKey,
  journeyReadings,
  detectorSpeeds,
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
    .map((route) => ({ route, reading: readingForRoute(tunnel, route, journeyReadings, detectorSpeeds, irnSpeeds) }))
    .filter((row): row is { route: DirectionRoute; reading: JourneyReading } => row.reading !== null);
  if (rows.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5 py-1">
      {rows.map(({ route, reading }) => {
        const colors = TRAFFIC_COLORS[reading.status];
        return (
          <div key={route.direction} className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
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
                {reading.speedKmh != null && (
                  <AlertBadge background={colors.background} text={colors.text}>
                    {t("traffic.speed", String(reading.speedKmh))}
                  </AlertBadge>
                )}
                {reading.speedLimitKmh != null && (
                  <AlertBadge
                    background="bg-gray-200/80 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                    text="text-gray-700 dark:text-gray-300"
                  >
                    {t("traffic.speedLimit", String(reading.speedLimitKmh))}
                  </AlertBadge>
                )}
              </div>
            </div>
            {((reading.debugIrnSegments && reading.debugIrnSegments.length > 0) ||
              (reading.debugIndicators && reading.debugIndicators.length > 0) ||
              (reading.debugDetectors && reading.debugDetectors.length > 0) ||
              Boolean(reading.debugThresholds) ||
              Boolean(reading.debugStatusSource)) && (
              <div className="text-xs font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/80 px-2.5 py-2 rounded border border-gray-200 dark:border-gray-800 flex flex-col gap-1 leading-relaxed">
                <span className="font-bold text-gray-700 dark:text-gray-300">Debug:</span>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  {reading.debugIrnSegments && reading.debugIrnSegments.length > 0 && (
                    <>
                      <li>
                        <span className="font-semibold text-purple-700 dark:text-purple-300">IRN Approach (500m): </span>
                        {reading.debugIrnSegments.filter((s) => s.type === "approach").length > 0 ? (
                          reading.debugIrnSegments
                            .filter((s) => s.type === "approach")
                            .map((s) => (
                              <span key={s.id} className="inline-flex items-center mr-1.5">
                                [{s.id} ({s.name}): {s.speedKmh != null ? `${s.speedKmh}km/h` : "N/A"}]
                              </span>
                            ))
                        ) : (
                          <span className="text-gray-400">none</span>
                        )}
                      </li>
                      <li>
                        <span className="font-semibold text-purple-700 dark:text-purple-300">IRN Bore: </span>
                        {reading.debugIrnSegments.filter((s) => s.type === "bore").length > 0 ? (
                          reading.debugIrnSegments
                            .filter((s) => s.type === "bore")
                            .map((s) => (
                              <span key={s.id} className="inline-flex items-center mr-1.5">
                                [{s.id} ({s.name}): {s.speedKmh != null ? `${s.speedKmh}km/h` : "N/A"}]
                              </span>
                            ))
                        ) : (
                          <span className="text-gray-400">none</span>
                        )}
                      </li>
                    </>
                  )}
                  {reading.debugIndicators && reading.debugIndicators.length > 0 && (
                    <li>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">JTIS Boards: </span>
                      {reading.debugIndicators.map((dbg) => (
                        <span key={`${dbg.loc}-${dbg.dest}`} className="inline-flex items-center mr-1.5">
                          [
                          {dbg.mapUrl ? (
                            <a
                              href={dbg.mapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 font-semibold underline hover:text-blue-800 dark:hover:text-blue-300"
                              title={`Google Maps route from ${dbg.loc} to tunnel entrance`}
                            >
                              {dbg.loc}
                            </a>
                          ) : (
                            <span className="font-semibold">{dbg.loc}</span>
                          )}
                          : {dbg.rawMinutes != null ? `${dbg.rawMinutes}m` : "N/A"}-{dbg.approachMinutes}m
                          {dbg.netMinutes != null ? `=${dbg.netMinutes}m` : ""}]
                        </span>
                      ))}
                    </li>
                  )}
                  {reading.debugDetectors && reading.debugDetectors.length > 0 && (
                    <li>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Detectors: </span>
                      {reading.debugDetectors.map((det) => (
                        <span key={det.id} className="inline-flex items-center mr-1.5">
                          [{det.isApproach ? "appr:" : ""}
                          {det.mapUrl ? (
                            <a
                              href={det.mapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 font-semibold underline hover:text-blue-800 dark:hover:text-blue-300"
                              title={`Google Maps route from ${det.id} to tunnel entrance`}
                            >
                              {det.id}
                            </a>
                          ) : (
                            <span className="font-semibold">{det.id}</span>
                          )}
                          : {det.speedKmh != null ? `${det.speedKmh}km/h` : "N/A"}]
                        </span>
                      ))}
                    </li>
                  )}
                  {reading.debugThresholds && (
                    <li>
                      <span className="inline-flex items-center gap-1 font-semibold">
                        [<span className="text-amber-600 dark:text-amber-400">Slow: ≥{reading.debugThresholds.slowMinutes}m</span>
                        , <span className="text-red-600 dark:text-red-400">Congested: ≥{reading.debugThresholds.congestedMinutes}m</span>]
                      </span>
                    </li>
                  )}
                  {reading.debugStatusSource && (
                    <li>
                      <span className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
                        {reading.debugStatusSource === "irn"
                          ? `[Status from IRN (500m Approach + Entire Tunnel Bore)${
                              reading.debugGovSpeedKmh != null ? ` @ ${reading.debugGovSpeedKmh}km/h` : ""
                            } → ${reading.debugMedianMinutes}m]`
                          : reading.debugStatusSource === "detector"
                            ? `[Status from portal / in-tunnel detectors${
                                reading.debugGovSpeedKmh != null ? ` @ ${reading.debugGovSpeedKmh}km/h` : ""
                              } → ${reading.debugMedianMinutes}m in/before tunnel]`
                            : `[No IRN/detector coverage → status from fastest journey board, ${reading.debugMedianMinutes}m]`}
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function HKTollCard(props: TollCardProps): JSX.Element {
  const { tunnelKey, priceAlert, tomorrowToll, vehicle, currentDate, isPublicHoliday, isClient } = props;
  const { journeyReadings, detectorSpeeds, irnSpeeds, sortMode, userCoords, t } = props;
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
          detectorSpeeds={detectorSpeeds}
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
        {tomorrowToll && (
          <div className="text-right pt-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t("tomorrow.label")} {tomorrowToll.dayType === "fixed" ? "" : t(tomorrowToll.dayType)}
            </span>
            {tomorrowToll.time && (
              <>
                <br />
                <AlertBadge background="bg-blue-100 dark:bg-blue-900" text="text-blue-800 dark:text-blue-200">
                  {t("tomorrow.from", tomorrowToll.time)}{" "}
                  {tomorrowToll.periodName ? `: ${resolveLocalizedString(tomorrowToll.periodName, t)}: ` : ""}
                  {tomorrowToll.toll}
                </AlertBadge>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main app component ───────────────────────────────────────────────────────

interface HKTunnelsTollsInsiderAppProps {
  t: TranslateFunction;
  lang?: string;
}

function HKTunnelsTollsInsiderApp({ t, lang }: HKTunnelsTollsInsiderAppProps): JSX.Element {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleTypeIdentifier>("privateCar");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isPublicHoliday, setIsPublicHoliday] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [sortMode, setSortMode] = useState<SortMode>(SortMode.Default);
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [journeyReadings, setJourneyReadings] = useState<Record<string, JourneyReading> | null>(null);
  const [detectorSpeeds, setDetectorSpeeds] = useState<Record<string, number> | null>(null);
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
    const load = async () => {
      try {
        const res = await fetch(JOURNEY_TIME_URL);
        if (!res.ok) return;
        const xml = await res.text();
        if (!cancelled) setJourneyReadings(parseJourneyTimes(xml));
      } catch {
        /* keep last reading */
      }
    };
    load();
    const id = setInterval(load, JOURNEY_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(DETECTOR_URL);
        if (!res.ok) return;
        const xml = await res.text();
        if (!cancelled) setDetectorSpeeds(parseDetectorSpeeds(xml));
      } catch {
        /* keep last reading */
      }
    };
    load();
    const id = setInterval(load, DETECTOR_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(IRN_SPEED_URL);
        if (!res.ok) return;
        const xml = await res.text();
        if (!cancelled) setIrnSpeeds(parseIrnSpeeds(xml));
      } catch {
        /* keep last reading */
      }
    };
    load();
    const id = setInterval(load, IRN_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
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
      intervalId = setInterval(() => setCurrentTime(new Date()), 60000);
    }, delay);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
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
    if (!currentTime) return "";
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

  const getTomorrowTollForTunnel = (tunnelKey: HKTunnelIdentifier) => {
    if (!currentTime) return null;
    const vehicle = tollData.vehicleTypes[selectedVehicle];
    const tunnel = tollData.tunnels[tunnelKey];
    if (!vehicle.hasTimeVaryingToll) {
      if (tunnelKey in (vehicle.fixedTolls || {})) {
        const fixed = vehicle.fixedTolls?.[tunnelKey as keyof typeof vehicle.fixedTolls];
        return fixed != null ? { dayType: "fixed", toll: `$${fixed}` } : null;
      }
      return null;
    }
    if (!tunnel || !("timeVaryingTolls" in tunnel)) return null;
    const hkInfo = getHongKongDate(currentTime);
    const tomorrowDate = new Date(hkInfo.date);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowHK = getHongKongDate(tomorrowDate);
    const isTomorrowHoliday = holidays.has(tomorrowHK.dateString);
    const isHolidaySchedule = tomorrowHK.dayOfWeek === 0 || isTomorrowHoliday;
    const timeSlots = isHolidaySchedule
      ? tunnel.timeVaryingTolls.sundays_and_holidays
      : tunnel.timeVaryingTolls.weekdays;
    const firstPeriod = timeSlots.periods[0];
    const toll = firstPeriod.toll;
    let tollDisplay = "";
    if (typeof toll === "object" && "range" in toll) {
      const [min, max] = toll.range;
      tollDisplay =
        "multiplier" in vehicle && vehicle.multiplier
          ? `$${(min * vehicle.multiplier).toFixed(1)} - $${(max * vehicle.multiplier).toFixed(1)}`
          : `$${min} - $${max}`;
    } else if ("multiplier" in vehicle && vehicle.multiplier) {
      tollDisplay = `$${(toll * vehicle.multiplier).toFixed(1)}`;
    } else {
      tollDisplay = `$${toll}`;
    }
    const dayTypeLabelId = isHolidaySchedule ? "tomorrow.sundaysAndHolidays" : "tomorrow.weekdays";
    return {
      dayType: dayTypeLabelId,
      time: firstPeriod.timeRange.split(" - ")[0],
      toll: tollDisplay,
      periodName: firstPeriod.name,
    };
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
      {/* Beta banner */}
      <div className="mx-2 mb-4 p-2 rounded-md border bg-amber-50 dark:bg-amber-950 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-center">
        <span className="font-bold">{t("insiderBanner.tag")}</span>
        {": "}
        {t("insiderBanner.text")}
        <a href={lang === "zh" ? "/zh/hk-tunnels-tolls/" : "/hk-tunnels-tolls/"} className="underline ml-1">
          {t("insiderBanner.officialLink")}
        </a>
      </div>

      {/* Page heading */}
      <h1 className="text-center m-2 md:m-4 text-3xl md:text-4xl font-bold md:p-2">{t("pageHeading")}</h1>

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
                      tomorrowToll={getTomorrowTollForTunnel(key)}
                      vehicle={selectedVehicle}
                      currentDate={currentTime}
                      isPublicHoliday={isPublicHoliday}
                      isClient={isClient}
                      journeyReadings={journeyReadings}
                      detectorSpeeds={detectorSpeeds}
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

      {/* IRN Segment Map */}
      <SegmentMap irnSpeeds={irnSpeeds} t={t} />

      {/* Vehicle Type Selection */}
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

      {/* Last updated */}
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

// ─── Page export ──────────────────────────────────────────────────────────────

export default function Page({ texts, lang, localizedRoutes }: LocaleProps): JSX.Element {
  const t = createTranslateFunction(texts);
  const canonicalUrl =
    lang === "zh" ? "https://jaylydev.github.io/zh/hk-tunnels-tolls/" : "https://jaylydev.github.io/hk-tunnels-tolls/";
  const hreflang = getHreflang(lang, localizedRoutes, true);

  return (
    <>
      <Head>
        <title>{t("insiderPageTitle")}</title>
        <meta name="description" content={t("insiderPageDescription")} />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t("insiderPageTitle")} />
        <meta property="og:description" content={t("insiderPageDescription")} />
        <meta property="og:image" content="https://jaylydev.github.io/hk-tunnels-tolls/icon.png" />
        <meta property="og:locale" content={hreflang} />
        <meta name="apple-mobile-web-app-title" content={t("insiderAppTitle")} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta property="twitter:card" content="summary" />
      </Head>
      <StatsCollection />
      <SiteHeader t={t} icon="/hk-tunnels-tolls/icon.png" lang={lang} localizedRoutes={localizedRoutes} />
      <HeroUIProvider>
        <ThemeProvider>
          <HKTunnelsTollsInsiderApp t={t} lang={lang} />
        </ThemeProvider>
      </HeroUIProvider>
      <SiteFooter t={t} lang={lang} localizedRoutes={localizedRoutes} />
    </>
  );
}
