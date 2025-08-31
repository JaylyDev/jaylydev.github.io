"use client";

import "@/styles/components/card.css";
import { StatsCollection, SiteFooter, SiteHeader } from "@/components/SiteFormat";
import { useState, useEffect, Suspense } from "react";
import { Button, HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { useSearchParams } from "next/navigation";
import registryInfo from "./data/registry.json";
import tollData from "./data/tolls.json";

interface NumberRange {
  range: number[];
}

interface TollPeriod {
  type: string;
  name: string;
  timeRange: string;
  toll: number | NumberRange;
}

interface TimeVaryingToll {
  name: string;
  periods: TollPeriod[];
}

interface HKTunnel {
  timeVaryingTolls: {
    weekdays: TimeVaryingToll;
    sundays_and_holidays: TimeVaryingToll;
  } | null;
}

interface VehicleType {
  hasTimeVaryingToll: boolean;
  fixedTolls?: Record<HKTunnelIdentifier, number | undefined>;
  multiplier?: number;
  description?: string;
}

interface PublicHoliday {
  dtstart: [string, { value: string }];
  dtend: [string, { value: string }];
  summary: string;
  uid: string;
}

interface PublicHolidayData {
  vcalendar: [
    {
      vevent: PublicHoliday[];
    }
  ];
}

interface TollData {
  tunnels: Record<HKTunnelIdentifier, HKTunnel>;
  vehicleTypes: Record<VehicleTypeIdentifier, VehicleType>;
}

interface TollCardProps {
  tunnelKey: HKTunnelIdentifier;
  tunnel: HKTunnel;
  vehicle: VehicleTypeIdentifier;
  priceAlert?: string;
  tollData: TollData | null;
  currentDate: Date;
  isPublicHoliday: boolean;
}

type VehicleTypeIdentifier = "privateCar" | "motorcycle" | "taxi" | "commercial";

type HKTunnelIdentifier = "western" | "cross_eastern" | "tai_lam";

function isValidVehicle(vehicle: string): vehicle is VehicleTypeIdentifier {
  return ["privateCar", "motorcycle", "taxi", "commercial"].includes(vehicle);
}

function isValidTunnel(tunnel: string): tunnel is HKTunnelIdentifier {
  return ["western", "cross_eastern", "tai_lam"].includes(tunnel);
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
  tollData: TollData | null,
  selectedVehicle: VehicleTypeIdentifier,
  tunnelKey: HKTunnelIdentifier,
  currentTime: Date,
  isPublicHoliday: boolean
): string {
  if (!tollData) return "載入中...";

  const vehicle = tollData.vehicleTypes[selectedVehicle];
  const tunnel = tollData.tunnels[tunnelKey];

  // Fixed toll vehicles
  if (vehicle.fixedTolls && tunnelKey in vehicle.fixedTolls) {
    return `$${vehicle.fixedTolls[tunnelKey]}`;
  }

  // Time-varying toll vehicles
  const hkTime = new Date(currentTime.toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" }));
  const isWeekend = hkTime.getDay() === 0; // Sunday
  const isHolidaySchedule = isWeekend || isPublicHoliday; // Use Sunday schedule for public holidays

  if (!tunnel || !tunnel.timeVaryingTolls) {
    return "無法計算";
  }

  const timeSlots = isHolidaySchedule ? tunnel.timeVaryingTolls.sundays_and_holidays : tunnel.timeVaryingTolls.weekdays;

  const currentTimeStr = hkTime.toTimeString().slice(0, 5); // HH:MM format

  // Find current period
  for (const period of timeSlots.periods) {
    const [startTime, endTime] = period.timeRange.split(" - ");
    if (isTimeInRange(currentTimeStr, startTime, endTime)) {
      const tollForTunnel = period.toll;

      if (typeof tollForTunnel === "object" && "range" in tollForTunnel) {
        // Transition period - show range
        const [min, max] = tollForTunnel.range;
        if (vehicle.multiplier) {
          const minMoto = Math.round(min * vehicle.multiplier * 10) / 10;
          const maxMoto = Math.round(max * vehicle.multiplier * 10) / 10;
          return `$${minMoto} - $${maxMoto}`;
        }
        return `$${min} - $${max}`;
      } else {
        // Apply multiplier for motorcycles
        if (vehicle.multiplier) {
          const motorcycleToll = Math.round(tollForTunnel * vehicle.multiplier * 10) / 10;
          return `$${motorcycleToll}`;
        }
        return `$${tollForTunnel}`;
      }
    }
  }

  return "無法計算";
}

function HKTollCard(props: TollCardProps): JSX.Element {
  const { tunnelKey, tunnel, priceAlert, vehicle, tollData, currentDate, isPublicHoliday } = props;

  return (
    <div key={tunnelKey} className="border-b border-black dark:border-white pb-1 last:border-b-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start sm:gap-2">
        <span className="text-3xl md:text-2xl font-medium text-center sm:text-left">
          {registryInfo.tunnels[tunnelKey].name}
        </span>
        <div className="text-center sm:text-right">
          <p className="text-5xl py-1 md:py-2 font-bold text-green-600">
            {getCurrentTollForTunnel(tollData, vehicle, tunnelKey, currentDate, isPublicHoliday)}
          </p>
          {priceAlert && (
            <span className="text-[1.45rem] md:text-lg bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-3 rounded-md font-medium inline-block text-center">
              {priceAlert}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function HKTunnelsTollsApp(): JSX.Element {
  const searchParams = useSearchParams();
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleTypeIdentifier>("privateCar");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [publicHolidays, setPublicHolidays] = useState<Set<string>>(new Set());
  const [isPublicHoliday, setIsPublicHoliday] = useState<boolean>(false);

  // Handle search params and localStorage loading on client side
  useEffect(() => {
    const vehicleParam = searchParams?.get("vehicle") ?? localStorage.getItem("hk-tunnel-vehicle");
    if (vehicleParam && isValidVehicle(vehicleParam)) {
      setSelectedVehicle(vehicleParam);
    }
  }, [searchParams]);

  // Load public holidays data
  useEffect(() => {
    fetch("/api/hk-tunnels-tolls/public_holidays.json")
      .then((response) => response.json())
      .then((data: PublicHolidayData) => {
        const holidays = new Set<string>();
        if (data.vcalendar && data.vcalendar[0] && data.vcalendar[0].vevent) {
          data.vcalendar[0].vevent.forEach((event) => {
            // Extract date from dtstart format "20240101"
            const dateStr = event.dtstart[0];
            holidays.add(dateStr);
          });
        }
        setPublicHolidays(holidays);
      })
      .catch((error) => console.error("載入公眾假期資料失敗:", error));
  }, []);

  // Check if current date is a public holiday
  useEffect(() => {
    const hkTime = new Date(currentTime.toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" }));
    const dateStr = hkTime.toISOString().slice(0, 10).replace(/-/g, ""); // Format: YYYYMMDD
    setIsPublicHoliday(publicHolidays.has(dateStr));
  }, [currentTime, publicHolidays]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem("hk-tunnel-vehicle", selectedVehicle);
  }, [selectedVehicle]);

  // Function to get price change alert for a specific tunnel
  const getPriceChangeAlertForTunnel = (tunnelKey: HKTunnelIdentifier): string => {
    if (!tollData) return "";

    const vehicle = tollData.vehicleTypes[selectedVehicle];
    const tunnel = tollData.tunnels[tunnelKey];

    // Fixed toll vehicles don't have price changes
    if (!vehicle.hasTimeVaryingToll) {
      return "";
    }

    // Time-varying toll vehicles
    const hkTime = new Date(currentTime.toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" }));
    const isWeekend = hkTime.getDay() === 0; // Sunday
    const isHolidaySchedule = isWeekend || isPublicHoliday; // Use Sunday schedule for public holidays

    if (!tunnel || !tunnel.timeVaryingTolls) {
      return "";
    }

    const timeSlots = isHolidaySchedule
      ? tunnel.timeVaryingTolls.sundays_and_holidays
      : tunnel.timeVaryingTolls.weekdays;
    const currentTimeStr = hkTime.toTimeString().slice(0, 5); // HH:MM format

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

      return `${nextPeriod.timeRange.split(" - ")[0]} 變為 ${nextTollDisplay}`;
    }

    return "";
  };

  const hkTime = new Date(currentTime.toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" }));

  const vehicleType = tollData?.vehicleTypes[selectedVehicle] || registryInfo.vehicleTypes[selectedVehicle];
  const vehicleName = registryInfo.vehicleTypes[selectedVehicle].name;

  return (
    <div className="max-w-4xl mx-auto px-2">
      {/* Header */}
      <h1 className="text-center m-2 md:m-4 text-3xl md:text-4xl font-bold md:p-2">香港實時隧道收費</h1>
      {/* Current Toll Display */}
      <div className="card-base-min mb-4">
        <h3 className="text-xl md:text-lg font-semibold">
          目前收費 - {vehicleName}{" "}
          {tollData && "description" in vehicleType && vehicleType.description ? `(${vehicleType.description})` : ""}
        </h3>
        <div>
          <div className="space-y-2">
            {tollData
              ? Object.entries(tollData.tunnels).map(([key, tunnel]) => {
                  if (!isValidTunnel(key)) {
                    console.error(`Invalid tunnel identifier: ${key}`);
                    return null;
                  }

                  const priceAlert = getPriceChangeAlertForTunnel(key);
                  // const priceAlert = `20:00 變為 $12.8 - $15.2`;

                  return (
                    <HKTollCard
                      key={key}
                      tunnelKey={key}
                      tunnel={tunnel}
                      priceAlert={priceAlert}
                      vehicle={selectedVehicle}
                      tollData={tollData as unknown as TollData}
                      currentDate={hkTime}
                      isPublicHoliday={isPublicHoliday}
                    />
                  );
                })
              : // Static loading cards for SEO
                Object.entries(registryInfo.tunnels).map(([key, tunnel]) => (
                  <div key={key} className="border-b border-black dark:border-white pb-1 last:border-b-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start sm:gap-2">
                      <span className="text-3xl md:text-2xl font-medium text-center sm:text-left">{tunnel.name}</span>
                      <div className="text-center sm:text-right">
                        <p className="text-5xl py-1 md:py-2 font-bold text-green-600">載入中...</p>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
      {/* Selection Controls */}
      <div className="card-base-min mb-8">
        {/* Vehicle Type Selection */}
        <h3 className="text-xl md:text-lg font-semibold mb-2">選擇車輛類型</h3>
        <div className="grid grid-cols-2 gap-4">
          {tollData
            ? Object.entries(tollData.vehicleTypes).map(([key], index, array) => {
                if (!isValidVehicle(key)) return null;
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
                    {registryInfo.vehicleTypes[key].name}
                  </Button>
                );
              })
            : // Static buttons for SEO
              Object.entries(registryInfo.vehicleTypes).map(([key, vehicle], index, array) => (
                <Button
                  key={key}
                  color={selectedVehicle === key ? "primary" : "default"}
                  size="lg"
                  className={`text-xl md:text-lg ${
                    array.length % 2 === 1 && index === array.length - 1 ? "col-span-2" : ""
                  }`}
                  onPress={() => setSelectedVehicle(key as VehicleTypeIdentifier)}
                >
                  {vehicle.name}
                </Button>
              ))}
        </div>
      </div>
      {/* Cross-Harbour Tunnels Time Periods Tables */}
      <div className="card-base-min mb-4">
        <h3 className="text-2xl md:text-lg font-semibold border-b mb-4">過海隧道收費時段表</h3>

        {/* Weekdays Table */}
        <div className="mb-6">
          <h4 className="text-xl md:text-base font-medium mb-2 text-blue-600">平日收費時段</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">時段</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">時間</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">西隧</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">紅隧 / 東隧</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tollData ? (
                  (() => {
                    // Get periods from the cross harbour tunnels (they should all have the same structure)
                    const referenceTunnel = tollData.tunnels["cross_eastern"];
                    if (!referenceTunnel || !referenceTunnel.timeVaryingTolls) return [];

                    const timeSlots = referenceTunnel.timeVaryingTolls.weekdays;

                    const formatToll = (tunnelKey: HKTunnelIdentifier, period: TollPeriod, multiplier?: number) => {
                      const tunnelData = tollData.tunnels[tunnelKey];
                      if (!tunnelData || !tunnelData.timeVaryingTolls) return "N/A";

                      const tunnelTimeSlots = tunnelData.timeVaryingTolls.weekdays;

                      // Find matching period by time range
                      const matchingPeriod = tunnelTimeSlots.periods.find((p) => p.timeRange === period.timeRange);
                      if (!matchingPeriod) return "N/A";

                      const toll = matchingPeriod.toll;

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

                    const getFixedToll = (tunnelKey: HKTunnelIdentifier, vehicle: VehicleType) => {
                      return `$${vehicle.fixedTolls?.[tunnelKey] || 0}`;
                    };

                    const vehicle = tollData.vehicleTypes[selectedVehicle];

                    return timeSlots.periods.map((period: TollPeriod, index: number) => (
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
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{period.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{period.timeRange}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {vehicle.hasTimeVaryingToll
                            ? formatToll("western", period, "multiplier" in vehicle ? vehicle.multiplier : undefined)
                            : getFixedToll("western", vehicle as VehicleType)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {vehicle.hasTimeVaryingToll
                            ? formatToll(
                                "cross_eastern",
                                period,
                                "multiplier" in vehicle ? vehicle.multiplier : undefined
                              )
                            : getFixedToll("cross_eastern", vehicle as VehicleType)}
                        </td>
                      </tr>
                    ));
                  })()
                ) : (
                  // Loading state for table
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      載入中...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Weekends and Holidays Table */}
        <div>
          <h4 className="text-xl md:text-base font-medium mb-2 text-green-600">星期日及公眾假期收費時段</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">時段</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">時間</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">西隧</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">紅隧 / 東隧</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tollData ? (
                  (() => {
                    // Get periods from the cross harbour tunnels (they should all have the same structure)
                    const referenceTunnel = tollData.tunnels["cross_eastern"];
                    if (!referenceTunnel || !referenceTunnel.timeVaryingTolls) return [];

                    const timeSlots = referenceTunnel.timeVaryingTolls.sundays_and_holidays;

                    const formatToll = (tunnelKey: HKTunnelIdentifier, period: TollPeriod, multiplier?: number) => {
                      const tunnelData = tollData.tunnels[tunnelKey];
                      if (!tunnelData || !tunnelData.timeVaryingTolls) return "N/A";

                      const tunnelTimeSlots = tunnelData.timeVaryingTolls.sundays_and_holidays;

                      // Find matching period by time range
                      const matchingPeriod = tunnelTimeSlots.periods.find((p) => p.timeRange === period.timeRange);
                      if (!matchingPeriod) return "N/A";

                      const toll = matchingPeriod.toll;

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

                    const getFixedToll = (tunnelKey: HKTunnelIdentifier, vehicle: VehicleType) => {
                      return `$${vehicle.fixedTolls?.[tunnelKey] || 0}`;
                    };

                    const vehicle = tollData.vehicleTypes[selectedVehicle];

                    return timeSlots.periods.map((period: TollPeriod, index: number) => (
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
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{period.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{period.timeRange}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {vehicle.hasTimeVaryingToll
                            ? formatToll("western", period, "multiplier" in vehicle ? vehicle.multiplier : undefined)
                            : getFixedToll("western", vehicle as VehicleType)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {vehicle.hasTimeVaryingToll
                            ? formatToll(
                                "cross_eastern",
                                period,
                                "multiplier" in vehicle ? vehicle.multiplier : undefined
                              )
                            : getFixedToll("cross_eastern", vehicle as VehicleType)}
                        </td>
                      </tr>
                    ));
                  })()
                ) : (
                  // Loading state for table
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      載入中...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Tai Lam Tunnel Time Periods Tables */}
      <div className="card-base-min mb-8">
        <h3 className="text-2xl md:text-lg font-semibold border-b mb-4">大欖隧道收費時段表</h3>

        {/* Weekdays Table */}
        <div className="mb-6">
          <h4 className="text-xl md:text-base font-medium mb-2 text-blue-600">平日收費時段</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">時段</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">時間</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">大欖隧道</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tollData ? (
                  (() => {
                    // Get periods from Tai Lam tunnel
                    const taiLamTunnel = tollData.tunnels["tai_lam"];
                    if (!taiLamTunnel || !taiLamTunnel.timeVaryingTolls) return [];

                    const timeSlots = taiLamTunnel.timeVaryingTolls.weekdays;

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
                      if (vehicle.fixedTolls?.tai_lam) {
                        return `$${vehicle.fixedTolls.tai_lam}`;
                      }
                      return `$${vehicle.fixedTolls || 0}`;
                    };

                    const vehicle = tollData.vehicleTypes[selectedVehicle];

                    return timeSlots.periods.map((period: TollPeriod, index: number) => (
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
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{period.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{period.timeRange}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {vehicle.hasTimeVaryingToll
                            ? formatToll(period, "multiplier" in vehicle ? vehicle.multiplier : undefined)
                            : getFixedToll(vehicle as VehicleType)}
                        </td>
                      </tr>
                    ));
                  })()
                ) : (
                  // Loading state for table
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      載入中...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Weekends and Holidays Table */}
        <div>
          <h4 className="text-xl md:text-base font-medium mb-2 text-green-600">星期日及公眾假期收費時段</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">時段</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">時間</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">大欖隧道</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tollData ? (
                  (() => {
                    // Get periods from Tai Lam tunnel
                    const taiLamTunnel = tollData.tunnels["tai_lam"];
                    if (!taiLamTunnel || !taiLamTunnel.timeVaryingTolls) return [];

                    const timeSlots = taiLamTunnel.timeVaryingTolls.sundays_and_holidays;

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
                      if (vehicle.fixedTolls?.tai_lam) {
                        return `$${vehicle.fixedTolls.tai_lam}`;
                      }
                      return `$${vehicle.fixedTolls || 0}`;
                    };

                    const vehicle = tollData.vehicleTypes[selectedVehicle];

                    return timeSlots.periods.map((period: TollPeriod, index: number) => (
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
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{period.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{period.timeRange}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {vehicle.hasTimeVaryingToll
                            ? formatToll(period, "multiplier" in vehicle ? vehicle.multiplier : undefined)
                            : getFixedToll(vehicle as VehicleType)}
                        </td>
                      </tr>
                    ));
                  })()
                ) : (
                  // Loading state for table
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      載入中...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Notes */}
      <h3 className="text-2xl font-bold py-2">關於這個網站</h3>
      <p className="py-2">
        「香港實時隧道收費」— 香港駕駛人士的好幫手！透過本網站，即可查詢「隧道收費」。
        我們即時提供香港實時三條過海隧道（西隧、紅隧、東隧）、大欖隧道及大老山隧道的收費資訊。
        操作簡單、資訊清晰，幫你輕鬆規劃出行時間，避免不必要的費用支出。
      </p>
      <div className="bg-blue-100 dark:bg-blue-900 border border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-200 p-3 rounded">
        <h3 className="font-bold">重要說明</h3>
        <ul>
          {registryInfo.notes.map((note, index) => (
            <li key={index} className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              {note}
            </li>
          ))}
        </ul>
      </div>
      {/* Footer */}
      <div className="text-center text-sm text-gray-500 p-4">
        <p>
          資料來源：
          <a href="https://jaylydev.github.io/posts/real-time-hong-kong-toll-rates/#%E8%B3%87%E6%96%99%E4%BE%86%E6%BA%90">
            香港特別行政區運輸署
          </a>
        </p>
        <p>
          最後更新：
          <span suppressHydrationWarning>
            {hkTime
              ? hkTime.toLocaleString("zh-HK", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })
              : "載入中..."}
          </span>
        </p>
      </div>
    </div>
  );
}

const AdUnit: React.FC = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error(e);
    }
  }, []);
  return (
    <ins
      className="adsbygoogle"
      data-ad-layout="in-article"
      data-ad-format="fluid"
      data-ad-client="ca-pub-2533146760921020"
      data-ad-slot="9602449199"
    ></ins>
  );
};

export default function Page(): JSX.Element {
  return (
    <html lang="zh-HK" suppressHydrationWarning>
      <body>
        <StatsCollection />
        <SiteHeader />
        <AdUnit />
        <HeroUIProvider>
          <ThemeProvider>
            <Suspense>
              <HKTunnelsTollsApp />;
            </Suspense>
          </ThemeProvider>
        </HeroUIProvider>
        <SiteFooter />
      </body>
    </html>
  );
}
