import { useEffect, useState } from "react";
import { TranslateFunction } from "@/locale/i18n";
import publicHolidayData from "./data/public_holidays.json";
import registryInfo from "./data/registry.json";
import tollData from "./data/tolls.json";
import { ExtraDirectionRoute, HKTunnelIdentifier, VehicleTypeIdentifier } from "./tunnelData";

export type LocalizedString = string | LocalizedStringRef;

export interface LocalizedStringRef {
  id: string;
}

export interface JTIIndicator {
  loc: string;
  dest: string;
  approachMinutes: number;
  mapUrl?: string;
}

export interface IrnSegment {
  id: string;
  name: string;
  type: "approach" | "bore";
  effectiveFrom?: string;
}

export interface DirectionRoute {
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

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface TunnelInfo {
  name: LocalizedString;
  category: string;
  color: string;
  trafficSource: string;
  lengthKm: number;
  maxLegalSpeedKmh?: number;
  entrances: Coordinates[];
  journeyRoutes: DirectionRoute[];
}

export enum SortMode {
  Default,
  Nearest,
}

export enum TrafficStatus {
  Unknown,
  Smooth,
  Slow,
  Congested,
  Closed,
}

export enum TollChangeDirection {
  Increase,
  Decrease,
}

export interface JourneyReading {
  status: TrafficStatus;
  minutes: number | null;
  speedLimitKmh?: number | null;
}

export interface NumberRange {
  range: number[];
}

export interface TollPeriod {
  type: string;
  name: LocalizedString;
  timeRange: string;
  toll: number | NumberRange;
}

export interface VehicleType {
  hasTimeVaryingToll: boolean;
  fixedTolls?: Record<HKTunnelIdentifier, number | undefined>;
  multiplier?: number;
  description?: LocalizedString;
}

export interface CurrentTollResult {
  message: string;
  isTransitionTime?: true;
}

export interface NextTollChangeInfo {
  minutesUntil: number;
  targetTime: string;
  nextTollDisplay: string;
  direction: TollChangeDirection;
}

export interface HongKongDateInfo {
  date: Date;
  dateString: string;
  timeString: string;
  dayOfWeek: number;
}

export interface ScheduleContext {
  isHolidaySchedule: boolean;
  currentTimeStr: string;
}

export interface LiveTrafficData {
  journeyReadings: Record<string, JourneyReading> | null;
  irnSpeeds: Record<string, number> | null;
}

interface CandidateItem {
  netMinutes: number;
  status: TrafficStatus;
}

const JOURNEY_TIME_URL = "https://resource.data.one.gov.hk/td/jss/Journeytimev2.xml";
const IRN_SPEED_URL = "https://resource.data.one.gov.hk/td/traffic-detectors/irnAvgSpeed-all.xml";
const REFRESH_MS = 120000;
// Central Kowloon Bypass full commissioning and HK$8 toll start at 2026-12-06 07:00 HKT.
export const CKB_FULL_OPEN_MS = Date.parse("2026-12-06T07:00:00+08:00");
export const CKB_BANNER_END_MS = CKB_FULL_OPEN_MS + 7 * 24 * 60 * 60 * 1000;

export function isCkbFullOpen(currentTime: Date | null): boolean {
  return currentTime !== null && currentTime.getTime() >= CKB_FULL_OPEN_MS;
}

export function getTunnelInfo(key: HKTunnelIdentifier): TunnelInfo {
  return registryInfo.tunnels[key] as TunnelInfo;
}

export function isValidVehicle(v: string): v is VehicleTypeIdentifier {
  return Object.keys(registryInfo.vehicleTypes).includes(v);
}

export function isValidTunnel(t: string): t is HKTunnelIdentifier {
  return Object.keys(registryInfo.tunnels).includes(t);
}

export function resolveLocalizedString(value: LocalizedString, t: TranslateFunction): string {
  if (typeof value === "string") return value;
  return t(value.id);
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function minutesToTimeString(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const mins = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function isTimeInRange(time: string, start: string, end: string): boolean {
  const timeMinutes = timeToMinutes(time);
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  if (startMinutes <= endMinutes) {
    return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
  }
  return timeMinutes >= startMinutes || timeMinutes <= endMinutes;
}

export function getHongKongDate(utcDate: Date): HongKongDateInfo {
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
  const parts: Record<string, string> = {};
  for (const part of fmt.formatToParts(utcDate)) {
    parts[part.type] = part.value;
  }
  const hkDate = new Date(`${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`);
  return {
    date: hkDate,
    dateString: `${parts.year}${parts.month}${parts.day}`,
    timeString: `${parts.hour}:${parts.minute}`,
    dayOfWeek: hkDate.getDay(),
  };
}

export function buildPublicHolidaySet(): Set<string> {
  const set = new Set<string>();
  const events = publicHolidayData.vcalendar?.[0]?.vevent;
  if (events) {
    for (const event of events) {
      const dateStr = event.dtstart[0];
      if (typeof dateStr === "string") set.add(dateStr);
    }
  }
  return set;
}

export function getScheduleContext(currentTime: Date, isPublicHoliday: boolean): ScheduleContext {
  const hkInfo = getHongKongDate(currentTime);
  return { isHolidaySchedule: hkInfo.dayOfWeek === 0 || isPublicHoliday, currentTimeStr: hkInfo.timeString };
}

function formatScaledDollar(baseAmount: number, multiplier: number | undefined): string {
  if (multiplier !== undefined) {
    const val = Math.round(baseAmount * multiplier * 10) / 10;
    return Number.isInteger(val) ? `$${val}` : `$${val.toFixed(1)}`;
  }
  return `$${baseAmount}`;
}

function evaluatePeriodTollAtMinute(period: TollPeriod, minuteOfDay: number): number {
  if (typeof period.toll === "number") return period.toll;
  const [startTime] = period.timeRange.split(" - ");
  const [min, max] = period.toll.range;
  const stepCount = Math.max(0, Math.trunc((minuteOfDay - timeToMinutes(startTime)) / 2));
  const raw = min > max ? min - stepCount * 2 : min + stepCount * 2;
  return min > max ? Math.max(max, raw) : Math.min(max, raw);
}

export function getCurrentTollForTunnel(
  selectedVehicle: VehicleTypeIdentifier,
  tunnelKey: HKTunnelIdentifier,
  currentTime: Date | null,
  isPublicHoliday: boolean,
  isClient: boolean,
  t: TranslateFunction,
): CurrentTollResult {
  const vehicle = tollData.vehicleTypes[selectedVehicle];
  const tunnel = tollData.tunnels[tunnelKey];
  if (tunnelKey === "central_kowloon_bypass" && !isCkbFullOpen(currentTime)) {
    return { message: "$0" };
  }
  if (vehicle.fixedTolls && tunnelKey in vehicle.fixedTolls) {
    return { message: `$${vehicle.fixedTolls[tunnelKey as keyof typeof vehicle.fixedTolls]}` };
  }
  if (!tunnel || !("timeVaryingTolls" in tunnel)) return { message: t("unableToCalculate") };
  if (!currentTime || !isClient) {
    const numericTolls = tunnel.timeVaryingTolls.weekdays.periods
      .map((p) => p.toll)
      .filter((val): val is number => typeof val === "number");
    const minToll = Math.min(...numericTolls);
    const maxToll = Math.max(...numericTolls);
    const mult = "multiplier" in vehicle ? vehicle.multiplier : undefined;
    const minVal = formatScaledDollar(minToll, mult);
    const maxVal = formatScaledDollar(maxToll, mult);
    return { message: minVal === maxVal ? minVal : `${minVal} - ${maxVal}` };
  }
  const { isHolidaySchedule, currentTimeStr } = getScheduleContext(currentTime, isPublicHoliday);
  const timeSlots = isHolidaySchedule ? tunnel.timeVaryingTolls.sundays_and_holidays : tunnel.timeVaryingTolls.weekdays;
  const mult = "multiplier" in vehicle ? vehicle.multiplier : undefined;
  for (const period of timeSlots.periods) {
    const [startTime, endTime] = period.timeRange.split(" - ");
    if (isTimeInRange(currentTimeStr, startTime, endTime)) {
      if (typeof period.toll === "object" && "range" in period.toll) {
        const currentToll = evaluatePeriodTollAtMinute(period, timeToMinutes(currentTimeStr));
        return { message: formatScaledDollar(currentToll, mult), isTransitionTime: true };
      }
      return { message: formatScaledDollar(period.toll, mult) };
    }
  }
  return { message: t("unableToCalculate") };
}

/**
 * Computes the next toll rate change (exact minutes until next step or next period) for a time-varying tunnel.
 */
export function getNextTollChange(
  selectedVehicle: VehicleTypeIdentifier,
  tunnelKey: HKTunnelIdentifier,
  currentTime: Date | null,
  isPublicHoliday: boolean,
  holidays?: Set<string>,
): NextTollChangeInfo | null {
  if (!currentTime) return null;
  const vehicle = tollData.vehicleTypes[selectedVehicle];
  const tunnel = tollData.tunnels[tunnelKey];
  if (!vehicle.hasTimeVaryingToll || !tunnel || !("timeVaryingTolls" in tunnel)) return null;

  const { isHolidaySchedule, currentTimeStr } = getScheduleContext(currentTime, isPublicHoliday);
  const todayPeriods = isHolidaySchedule
    ? tunnel.timeVaryingTolls.sundays_and_holidays.periods
    : tunnel.timeVaryingTolls.weekdays.periods;

  const nowMinutes = timeToMinutes(currentTimeStr);
  const mult = "multiplier" in vehicle ? vehicle.multiplier : undefined;

  let currentIdx = -1;
  for (let i = 0; i < todayPeriods.length; i++) {
    const [startTime, endTime] = todayPeriods[i].timeRange.split(" - ");
    if (isTimeInRange(currentTimeStr, startTime, endTime)) {
      currentIdx = i;
      break;
    }
  }
  if (currentIdx === -1) return null;

  const currentPeriod = todayPeriods[currentIdx];
  const currentBaseToll = evaluatePeriodTollAtMinute(currentPeriod, nowMinutes);

  // During a transition period, find the next 2-minute step or the end of transition.
  if (typeof currentPeriod.toll === "object" && "range" in currentPeriod.toll) {
    const [startTime, endTime] = currentPeriod.timeRange.split(" - ");
    const startMin = timeToMinutes(startTime);
    const endMin = timeToMinutes(endTime);
    const elapsed = Math.max(0, nowMinutes - startMin);
    const nextStepMin = startMin + (Math.floor(elapsed / 2) + 1) * 2;
    if (nextStepMin <= endMin) {
      const nextBaseToll = evaluatePeriodTollAtMinute(currentPeriod, nextStepMin);
      if (nextBaseToll !== currentBaseToll) {
        return {
          minutesUntil: nextStepMin - nowMinutes,
          targetTime: minutesToTimeString(nextStepMin),
          nextTollDisplay: formatScaledDollar(nextBaseToll, mult),
          direction: nextBaseToll > currentBaseToll ? TollChangeDirection.Increase : TollChangeDirection.Decrease,
        };
      }
    }
  }

  // Search remaining periods today for the next period with a different starting toll.
  for (let i = currentIdx + 1; i < todayPeriods.length; i++) {
    const p = todayPeriods[i];
    const [startTime] = p.timeRange.split(" - ");
    const startMin = timeToMinutes(startTime);
    const pStartToll = typeof p.toll === "number" ? p.toll : p.toll.range[0];
    if (pStartToll !== currentBaseToll) {
      return {
        minutesUntil: startMin - nowMinutes,
        targetTime: startTime,
        nextTollDisplay: formatScaledDollar(pStartToll, mult),
        direction: pStartToll > currentBaseToll ? TollChangeDirection.Increase : TollChangeDirection.Decrease,
      };
    }
  }

  // Wrap into tomorrow's schedule.
  const tomorrowUtc = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);
  const tomorrowHk = getHongKongDate(tomorrowUtc);
  const isTomorrowHoliday = tomorrowHk.dayOfWeek === 0 || (holidays ? holidays.has(tomorrowHk.dateString) : false);
  const tomorrowPeriods = isTomorrowHoliday
    ? tunnel.timeVaryingTolls.sundays_and_holidays.periods
    : tunnel.timeVaryingTolls.weekdays.periods;

  for (const p of tomorrowPeriods) {
    const [startTime] = p.timeRange.split(" - ");
    const startMin = timeToMinutes(startTime);
    const pStartToll = typeof p.toll === "number" ? p.toll : p.toll.range[0];
    if (pStartToll !== currentBaseToll) {
      const minutesUntil = 1440 - nowMinutes + startMin;
      return {
        minutesUntil,
        targetTime: startTime,
        nextTollDisplay: formatScaledDollar(pStartToll, mult),
        direction: pStartToll > currentBaseToll ? TollChangeDirection.Increase : TollChangeDirection.Decrease,
      };
    }
  }

  return null;
}

export function haversineKm(a: Coordinates, b: Coordinates): number {
  const toRad = (deg: number): number => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function nearestEntranceKm(entrances: Coordinates[], coords: Coordinates): number {
  return Math.min(...entrances.map((e) => haversineKm(coords, e)));
}

export function nearestEntranceIndex(entrances: Coordinates[], coords: Coordinates): number {
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

export function journeyKey(loc: string, dest: string): string {
  return `${loc}|${dest}`;
}

export function parseJourneyTimes(xml: string): Record<string, JourneyReading> {
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

export function parseIrnSpeeds(xml: string): Record<string, number> {
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

function speedCongestionStatus(lengthKm: number, minutes: number, speedLimitKmh: number): TrafficStatus {
  if (!(minutes > 0)) return TrafficStatus.Unknown;
  const effectiveLimit = speedLimitKmh || 70;
  const avgSpeedKmh = (lengthKm / (minutes * 60)) * 3600;
  if (avgSpeedKmh < effectiveLimit * 0.15) return TrafficStatus.Congested;
  if (avgSpeedKmh < effectiveLimit * 0.4) return TrafficStatus.Slow;
  return TrafficStatus.Unknown;
}

function adjustMinutesForStatus(lengthKm: number, limit: number, status: TrafficStatus, minutes: number | null): number | null {
  if (minutes === null) return minutes;
  if (status === TrafficStatus.Slow) {
    return Math.max(minutes, Math.round((lengthKm / (limit * 0.5)) * 60));
  }
  if (status === TrafficStatus.Congested) {
    return Math.max(minutes, Math.round((lengthKm / Math.max(15, limit * 0.2)) * 60));
  }
  return minutes;
}

export function readingForRoute(
  tunnel: TunnelInfo,
  route: DirectionRoute,
  journeyReadings: Record<string, JourneyReading> | null,
  irnSpeeds: Record<string, number> | null,
  currentTime: Date | null = null,
): JourneyReading | null {
  const routeLimit = route.speedLimitKmh || tunnel.maxLegalSpeedKmh || 70;
  const floorMinutes = Math.round((tunnel.lengthKm * 1000) / (routeLimit / 3.6) / 60);

  const candidateIndicators: JTIIndicator[] =
    route.indicators && route.indicators.length > 0
      ? route.indicators
      : route.loc && route.dest
        ? [{ loc: route.loc, dest: route.dest, approachMinutes: route.approachMinutes || 0 }]
        : [];

  const validItems: CandidateItem[] = [];
  if (candidateIndicators.length > 0 && journeyReadings) {
    for (const ind of candidateIndicators) {
      const rawReading = journeyReadings[journeyKey(ind.loc, ind.dest)] ?? null;
      if (rawReading && rawReading.minutes !== null && rawReading.minutes > 0) {
        const netMinutes = Math.max(floorMinutes, rawReading.minutes - ind.approachMinutes);
        validItems.push({ netMinutes, status: rawReading.status });
      }
    }
  }

  if (validItems.length > 0) {
    let best = validItems[0];
    for (const item of validItems) {
      if (item.netMinutes < best.netMinutes) best = item;
    }
    const medianMinutes = best.netMinutes;
    const minutesBasedEffectiveStatus = speedCongestionStatus(tunnel.lengthKm, medianMinutes, routeLimit);
    const status: TrafficStatus =
      best.status >= minutesBasedEffectiveStatus ? best.status : minutesBasedEffectiveStatus;
    const finalMinutes = adjustMinutesForStatus(tunnel.lengthKm, tunnel.maxLegalSpeedKmh || 70, status, medianMinutes);

    return {
      status,
      minutes: finalMinutes,
      speedLimitKmh: routeLimit,
    };
  }

  const boreIds = (route.irnSegments ?? [])
    .filter((seg) => {
      if (seg.type !== "bore") return false;
      if (!seg.effectiveFrom) return true;
      return currentTime !== null && currentTime.getTime() >= Date.parse(seg.effectiveFrom);
    })
    .map((seg) => seg.id);
  return readingFromIrnSpeeds(tunnel.lengthKm, routeLimit, floorMinutes, boreIds, irnSpeeds);
}

/**
 * Builds a reading from the average speed-map speed of the given in-tunnel segments.
 * @param lengthKm Tunnel length in km
 * @param routeLimit Speed limit in km/h
 * @param floorMinutes Free-flow traversal time, the lowest minutes shown
 * @param segmentIds IRN segment ids inside the tunnel
 * @param irnSpeeds Live speeds by segment id
 * @returns The reading, or null when no segment has a valid speed
 */
function readingFromIrnSpeeds(
  lengthKm: number,
  routeLimit: number,
  floorMinutes: number,
  segmentIds: string[],
  irnSpeeds: Record<string, number> | null,
): JourneyReading | null {
  if (!irnSpeeds) return null;
  const speeds = segmentIds.map((id) => irnSpeeds[id]).filter((spd) => typeof spd === "number" && spd > 0);
  if (speeds.length === 0) return null;

  const govSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
  const status =
    govSpeed >= routeLimit * 0.75
      ? TrafficStatus.Smooth
      : govSpeed >= routeLimit * 0.4
        ? TrafficStatus.Slow
        : TrafficStatus.Congested;
  const minutes = Math.max(floorMinutes, Math.round((lengthKm / Math.min(govSpeed, routeLimit)) * 60));

  return {
    status,
    minutes,
    speedLimitKmh: routeLimit,
  };
}

export function readingForExtraRoute(
  lengthKm: number,
  route: ExtraDirectionRoute,
  journeyReadings: Record<string, JourneyReading> | null,
  irnSpeeds: Record<string, number> | null,
): JourneyReading | null {
  const floorMinutes = Math.max(1, Math.round((lengthKm * 1000) / (route.speedLimitKmh / 3.6) / 60));
  const validItems: CandidateItem[] = [];
  for (const ind of journeyReadings ? route.indicators : []) {
    const raw = journeyReadings?.[journeyKey(ind.loc, ind.dest)];
    if (raw && raw.minutes !== null && raw.minutes > 0) {
      validItems.push({ netMinutes: Math.max(floorMinutes, raw.minutes - ind.approachMinutes), status: raw.status });
    }
  }
  // Journey-time boards first; directions without boards fall back to the speed map
  if (validItems.length === 0) {
    return readingFromIrnSpeeds(lengthKm, route.speedLimitKmh, floorMinutes, route.irnSegmentIds ?? [], irnSpeeds);
  }
  let best = validItems[0];
  for (const item of validItems) {
    if (item.netMinutes < best.netMinutes) best = item;
  }
  const minutes = adjustMinutesForStatus(lengthKm, route.speedLimitKmh, best.status, best.netMinutes);
  return { status: best.status, minutes, speedLimitKmh: route.speedLimitKmh };
}

export function useLiveTrafficData(): LiveTrafficData {
  const [journeyReadings, setJourneyReadings] = useState<Record<string, JourneyReading> | null>(null);
  const [irnSpeeds, setIrnSpeeds] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadJourneyTimes = () => {
      fetch(JOURNEY_TIME_URL)
        .then((res) => (res.ok ? res.text() : null))
        .then((xml) => {
          if (!cancelled && xml) setJourneyReadings(parseJourneyTimes(xml));
        })
        .catch(() => undefined);
    };
    loadJourneyTimes();
    const intervalId = setInterval(loadJourneyTimes, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadIrnSpeeds = () => {
      fetch(IRN_SPEED_URL)
        .then((res) => (res.ok ? res.text() : null))
        .then((xml) => {
          if (!cancelled && xml) setIrnSpeeds(parseIrnSpeeds(xml));
        })
        .catch(() => undefined);
    };
    loadIrnSpeeds();
    const intervalId = setInterval(loadIrnSpeeds, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  return { journeyReadings, irnSpeeds };
}

export function useHongKongClock(): Date | null {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const now = new Date();
    const delay = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
    const timeoutId = setTimeout(() => {
      setCurrentTime(new Date());
      intervalId = setInterval(() => {
        setCurrentTime(new Date());
      }, 60000);
    }, delay);
    return () => {
      clearTimeout(timeoutId);
      if (intervalId !== undefined) clearInterval(intervalId);
    };
  }, []);

  return currentTime;
}
