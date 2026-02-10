import Head from "next/head";
import { StatsCollection, SiteFooter, SiteHeader } from "@/components/SiteFormat";
import { useState, useEffect, JSX } from "react";
import { Button, HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import registryInfo from "./data/registry.json";
import tollData from "./data/tolls.json";
import publicHolidayData from "./data/public_holidays.json";
import { InArticleAdUnit } from "@/components/AdUnit";
import { createTranslateFunction, getHreflang, ScreenLocaleProps, TranslateFunction } from "@/locale/i18n";

// Type for localized strings that can be either a plain string or a translation reference
type LocalizedString = string | { id: string };

type VehicleTypeIdentifier = keyof typeof registryInfo.vehicleTypes;

type HKTunnelIdentifier = keyof typeof registryInfo.tunnels;

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

// Helper function to resolve LocalizedString to actual text
function resolveLocalizedString(value: LocalizedString, t: TranslateFunction): string {
  if (typeof value === "string") {
    return value;
  }
  return t(value.id);
}

// Utility functions for Hong Kong timezone handling
function getHongKongDate(utcDate: Date): { date: Date; dateString: string; timeString: string; dayOfWeek: number } {
  // Use Intl.DateTimeFormat to get proper Hong Kong time components
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
  const hkPartsObj = hkParts.reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {} as Record<string, string>);

  // Create a date object representing HK time
  const hkDate = new Date(
    `${hkPartsObj.year}-${hkPartsObj.month}-${hkPartsObj.day}T${hkPartsObj.hour}:${hkPartsObj.minute}:${hkPartsObj.second}`
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
    // Overnight range
    return timeMinutes >= startMinutes || timeMinutes <= endMinutes;
  }
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// Function to get current toll for a specific tunnel
function getCurrentTollForTunnel(
  selectedVehicle: VehicleTypeIdentifier,
  tunnelKey: HKTunnelIdentifier,
  currentTime: Date | null,
  isPublicHoliday: boolean,
  isClient: boolean,
  t: TranslateFunction
): CurrentTollResult {
  // Show loading until everything is properly loaded
  if (!currentTime || !isClient) return { message: t("loading") };

  const vehicle = tollData.vehicleTypes[selectedVehicle];
  const tunnel = tollData.tunnels[tunnelKey];

  // Fixed toll vehicles
  if (vehicle.fixedTolls && tunnelKey in vehicle.fixedTolls) {
    return { message: `$${vehicle.fixedTolls[tunnelKey as keyof typeof vehicle.fixedTolls]}` };
  }

  // Time-varying toll vehicles
  const hkInfo = getHongKongDate(currentTime);
  const isWeekend = hkInfo.dayOfWeek === 0; // Sunday
  const isHolidaySchedule = isWeekend || isPublicHoliday; // Use Sunday schedule for public holidays

  if (!tunnel || !("timeVaryingTolls" in tunnel)) {
    return { message: t("unableToCalculate") };
  }

  const timeSlots = isHolidaySchedule ? tunnel.timeVaryingTolls.sundays_and_holidays : tunnel.timeVaryingTolls.weekdays;
  const currentTimeStr = hkInfo.timeString;

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
  const { tunnelKey, priceAlert, vehicle, currentDate, isPublicHoliday, isClient, t } = props;
  const tollResult = getCurrentTollForTunnel(vehicle, tunnelKey, currentDate, isPublicHoliday, isClient, t);

  return (
    <div key={tunnelKey} className="border-b border-black dark:border-white pb-1 last:border-b-0">
      <div className="flex flex-row justify-between items-start gap-2">
        <span className="text-3xl md:text-2xl font-medium text-left">
          {resolveLocalizedString(registryInfo.tunnels[tunnelKey].name, t)}
        </span>
        <p className="text-right text-5xl py-1 md:py-2 font-bold text-green-600">{tollResult.message}</p>
      </div>
      {tollResult.isTransitionTime && (
        <div className="text-right py-1">
          <span className="text-[1.45rem] md:text-lg bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-3 rounded-md font-medium inline-block text-center">
            {t("transitionPeriod")}
          </span>
        </div>
      )}
      {priceAlert && (
        <div className="text-right">
          <span className="text-[1.45rem] md:text-lg bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-3 rounded-md font-medium inline-block text-center">
            {priceAlert}
          </span>
        </div>
      )}
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

  return (
    <div className="card-base-min mb-4">
      <h3 className="text-2xl md:text-lg font-semibold border-b mb-4">{t("tollRates", tunnelName)}</h3>

      {/* Weekdays Table */}
      <div className="mb-6">
        <h4 className="text-xl md:text-base font-medium mb-2 text-blue-600">{t("weekdaySchedule")}</h4>
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
              {tunnel.timeVaryingTolls.weekdays.periods.map((period: TollPeriod, index: number) => (
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

      {/* Weekends and Holidays Table */}
      <div>
        <h4 className="text-xl md:text-base font-medium mb-2 text-green-600">{t("weekendSchedule")}</h4>
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
              {tunnel.timeVaryingTolls.sundays_and_holidays.periods.map((period: TollPeriod, index: number) => (
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
    </div>
  );
}

function HKTunnelsTollsApp({ t }: { t: TranslateFunction }): JSX.Element {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleTypeIdentifier>("privateCar");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isPublicHoliday, setIsPublicHoliday] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());
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

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const selectedVehicle = searchParams.get("vehicle") ?? localStorage.getItem("hk-tunnel-vehicle");
    if (selectedVehicle && isValidVehicle(selectedVehicle)) {
      setSelectedVehicle(selectedVehicle);
    }
  }, [setSelectedVehicle]);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem("hk-tunnel-vehicle", selectedVehicle);
  }, [selectedVehicle]);

  // Function to get price change alert for a specific tunnel
  const getPriceChangeAlertForTunnel = (tunnelKey: HKTunnelIdentifier): string => {
    if (!tollData || !currentTime) return "";

    const vehicle = tollData.vehicleTypes[selectedVehicle];
    const tunnel = tollData.tunnels[tunnelKey];

    // Fixed toll vehicles don't have price changes
    if (!vehicle.hasTimeVaryingToll) {
      return "";
    }

    // Time-varying toll vehicles
    const hkInfo = getHongKongDate(currentTime);
    const isWeekend = hkInfo.dayOfWeek === 0; // Sunday
    const isHolidaySchedule = isWeekend || isPublicHoliday; // Use Sunday schedule for public holidays

    if (!tunnel || !("timeVaryingTolls" in tunnel)) {
      return "";
    }

    const timeSlots = isHolidaySchedule
      ? tunnel.timeVaryingTolls.sundays_and_holidays
      : tunnel.timeVaryingTolls.weekdays;
    const currentTimeStr = hkInfo.timeString;

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

    // Display announcement if toll changes later
    const nextPeriodIndex = (currentPeriodIndex + 1) % timeSlots.periods.length;
    const nextPeriod = timeSlots.periods[nextPeriodIndex];

    if (nextPeriod && nextPeriod.toll !== currentPeriod.toll) {
      const nextToll = nextPeriod.toll;
      let nextTollDisplay = "";

      if (typeof nextToll === "object" && "range" in nextToll) {
        const [min, max] = nextToll.range;
        if ("multiplier" in vehicle && vehicle.multiplier) {
          const minMoto = Math.round(min * vehicle.multiplier * 10) / 10;
          const maxMoto = Math.round(max * vehicle.multiplier * 10) / 10;
          nextTollDisplay = `$${minMoto} - $${maxMoto}`;
        } else {
          nextTollDisplay = `$${min} - $${max}`;
        }
      } else {
        if ("multiplier" in vehicle && vehicle.multiplier) {
          const motorcycleToll = Math.round(nextToll * vehicle.multiplier * 10) / 10;
          nextTollDisplay = `$${motorcycleToll}`;
        } else {
          nextTollDisplay = `$${nextToll}`;
        }
      }

      return t("priceChangeAlert", nextPeriod.timeRange.split(" - ")[0], nextTollDisplay);
    }

    return "";
  };

  const hkTime = currentTime;
  const vehicleName = resolveLocalizedString(registryInfo.vehicleTypes[selectedVehicle].name, t);
  const vehicleDescription = registryInfo.vehicleTypes[selectedVehicle].description;

  return (
    <div className="max-w-4xl mx-auto px-2">
      {/* Header */}
      <h1 className="text-center m-2 md:m-4 text-3xl md:text-4xl font-bold md:p-2">{t("pageHeading")}</h1>
      {/* Current Toll Display */}
      <div className="card-base-min mb-4">
        <h3 className="text-xl md:text-lg font-semibold">
          {t("currentToll")} - {vehicleName}{" "}
          {vehicleDescription ? `(${resolveLocalizedString(vehicleDescription, t)})` : ""}
        </h3>
        <div>
          <div className="space-y-2">
            {Object.keys(tollData.tunnels).map((key) => {
              if (!isValidTunnel(key)) {
                // console.error(`Invalid tunnel identifier: ${key}`);
                return null;
              }

              const priceAlert = getPriceChangeAlertForTunnel(key);

              return (
                <HKTollCard
                  key={key}
                  tunnelKey={key}
                  priceAlert={priceAlert}
                  vehicle={selectedVehicle}
                  currentDate={hkTime}
                  isPublicHoliday={isPublicHoliday}
                  isClient={isClient}
                  t={t}
                />
              );
            })}
          </div>
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
          // console.error(`Invalid tunnel identifier: ${key}`);
          return null;
        }
        return <TunnelTable key={key} tunnelKey={key} selectedVehicle={selectedVehicle} t={t} />;
      })}
      {/* Notes */}
      <h3 className="text-2xl font-bold py-2">{t("aboutHeading")}</h3>
      <p className="py-2">{t("aboutDescription")}</p>
      <div className="bg-blue-100 dark:bg-blue-900 border border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-200 p-3 rounded">
        <h3 className="font-bold">{t("notesHeading")}</h3>
        <ul>
          {registryInfo.notes.map((note, index) => (
            <li key={index} className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              {resolveLocalizedString(note, t)}
            </li>
          ))}
        </ul>
      </div>
      {/* Footer */}
      <div className="text-center text-sm text-gray-500 p-4">
        <p>
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
        <p>
          {t("references")}
          <a href={t("references.url")} target="_blank" rel="noopener noreferrer">
            {t("references.url").replace(/^https?:\/\//, "")}
          </a>
        </p>
      </div>
    </div>
  );
}

export default function Page({ texts, lang, localizedRoutes }: ScreenLocaleProps): JSX.Element {
  const t = createTranslateFunction(texts);
  const hreflang = getHreflang(lang, localizedRoutes, true);
  return (
    <>
      <Head>
        <title>{t("pageTitle")}</title>
        <meta name="description" content={t("pageDescription")} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://jaylydev.github.io/hk-tunnels-tolls/icon.png" />
        <meta property="og:locale" content={hreflang} />
        <meta name="apple-mobile-web-app-title" content={t("appTitle")} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/hk-tunnels-tolls/apple-touch-icon.png" />
        <link rel="alternate" hrefLang="en" href="https://jaylydev.github.io/hk-tunnels-tolls/" />
        <link rel="alternate" hrefLang="zh" href="https://jaylydev.github.io/zh/hk-tunnels-tolls/" />
        <meta property="twitter:card" content="summary" />
      </Head>
      <StatsCollection />
      <SiteHeader t={t} icon="/hk-tunnels-tolls/icon.png" lang={lang} localizedRoutes={localizedRoutes} />
      <HeroUIProvider>
        <ThemeProvider>
          <HKTunnelsTollsApp t={t} />
        </ThemeProvider>
      </HeroUIProvider>
      <SiteFooter t={t} lang={lang} localizedRoutes={localizedRoutes} />
    </>
  );
}
