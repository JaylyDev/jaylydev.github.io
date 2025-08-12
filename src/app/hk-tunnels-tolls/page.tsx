"use client";

import "@/styles/components/card.css";
import { StatsCollection, SiteFooter, SiteHeader } from "@/components/SiteFormat";
import { useState, useEffect, memo, Suspense } from "react";
import { Button, HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { useSearchParams } from "next/navigation";

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
  name: HKTunnelIdentifier;
  code?: string;
  timeVaryingTolls: {
    weekdays: TimeVaryingToll;
    sundays: TimeVaryingToll;
  };
}

interface VehicleType {
  name: VehicleTypeIdentifier;
  hasTimeVaryingToll: boolean;
  fixedToll?: number;
  tai_lam_toll?: number;
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
  notes: string[];
}

type VehicleTypeIdentifier = "privateCar" | "motorcycle" | "taxi" | "commercial";

type HKTunnelIdentifier = "western" | "cross" | "eastern" | "tai_lam";

function isValidVehicle(vehicle: string): vehicle is VehicleTypeIdentifier {
  return ["privateCar", "motorcycle", "taxi", "commercial"].includes(vehicle);
}

function isValidTunnel(tunnel: string): tunnel is HKTunnelIdentifier {
  return ["western", "cross", "eastern", "tai_lam"].includes(tunnel);
}

function HKTunnelsTollsApp(): JSX.Element {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleTypeIdentifier>("privateCar");
  const [selectedTunnel, setSelectedTunnel] = useState<HKTunnelIdentifier>("cross");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [tollData, setTollData] = useState<TollData | null>(null);
  const [currentToll, setCurrentToll] = useState<number | string>("");
  const [publicHolidays, setPublicHolidays] = useState<Set<string>>(new Set());
  const [isPublicHoliday, setIsPublicHoliday] = useState<boolean>(false);
  const [priceChangeAlert, setPriceChangeAlert] = useState<string>("");
  const searchParams = useSearchParams();

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

  // Load toll data
  useEffect(() => {
    fetch("/api/hk-tunnels-tolls/tolls.json")
      .then((response) => response.json())
      .then((data) => setTollData(data))
      .catch((error) => console.error("載入收費資料失敗:", error));
  }, []);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Load preferences from localStorage
  useEffect(() => {
    const savedVehicle = searchParams.get("vehicle") ?? localStorage.getItem("hk-tunnel-vehicle");
    const savedTunnel = searchParams.get("tunnel") ?? localStorage.getItem("hk-tunnel-tunnel");

    if (savedVehicle && isValidVehicle(savedVehicle)) setSelectedVehicle(savedVehicle);
    if (savedTunnel && isValidTunnel(savedTunnel)) setSelectedTunnel(savedTunnel);
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem("hk-tunnel-vehicle", selectedVehicle);
    localStorage.setItem("hk-tunnel-tunnel", selectedTunnel);
  }, [selectedVehicle, selectedTunnel]);

  // Calculate current toll and check for upcoming price changes
  useEffect(() => {
    if (!tollData) return;

    const vehicle = tollData.vehicleTypes[selectedVehicle];

    // Fixed toll vehicles
    if (!vehicle.hasTimeVaryingToll && vehicle.fixedToll) {
      // Handle special case for tai_lam tunnel with different fixed toll
      if (selectedTunnel === "tai_lam" && vehicle.tai_lam_toll) {
        setCurrentToll(`$${vehicle.tai_lam_toll}`);
      } else {
        setCurrentToll(`$${vehicle.fixedToll}`);
      }
      setPriceChangeAlert(""); // No price changes for fixed toll vehicles
      return;
    }

    // Time-varying toll vehicles
    const hkTime = new Date(currentTime.toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" }));
    const isWeekend = hkTime.getDay() === 0; // Sunday
    const isHolidaySchedule = isWeekend || isPublicHoliday; // Use Sunday schedule for public holidays

    const selectedTunnelData = tollData.tunnels[selectedTunnel];
    if (!selectedTunnelData || !selectedTunnelData.timeVaryingTolls) {
      setCurrentToll("無法計算");
      setPriceChangeAlert("");
      return;
    }

    const timeSlots = isHolidaySchedule
      ? selectedTunnelData.timeVaryingTolls.sundays
      : selectedTunnelData.timeVaryingTolls.weekdays;

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

    if (currentPeriod) {
      const tollForTunnel = currentPeriod.toll;
      let baseToll: number;

      if (typeof tollForTunnel === "object" && "range" in tollForTunnel) {
        // Transition period - show range
        const [min, max] = tollForTunnel.range;
        baseToll = min; // Use minimum for calculation
        setCurrentToll(`$${min} - $${max}`);
      } else {
        baseToll = tollForTunnel;
        setCurrentToll(`$${baseToll}`);
      }

      // Apply multiplier for motorcycles
      if (vehicle.multiplier && typeof tollForTunnel === "number") {
        const motorcycleToll = Math.round(baseToll * vehicle.multiplier * 10) / 10;
        setCurrentToll(`$${motorcycleToll}`);
      } else if (vehicle.multiplier && typeof tollForTunnel === "object") {
        const [min, max] = tollForTunnel.range;
        const minMoto = Math.round(min * vehicle.multiplier * 10) / 10;
        const maxMoto = Math.round(max * vehicle.multiplier * 10) / 10;
        setCurrentToll(`$${minMoto} - $${maxMoto}`);
      }

      const checkPriceChange = () => {
        if (!currentPeriod) return;

        const currentEnd = currentPeriod.timeRange.split(" - ")[1];
        const currentEndMinutes = timeToMinutes(currentEnd);
        const currentTimeMinutes = timeToMinutes(currentTimeStr);

        // Calculate time difference (handle overnight periods)
        let timeDiff;
        if (currentEndMinutes >= currentTimeMinutes) {
          timeDiff = currentEndMinutes - currentTimeMinutes;
        } else {
          // Overnight period (e.g., 23:00 - 06:00)
          timeDiff = 24 * 60 - currentTimeMinutes + currentEndMinutes;
        }

        // Display announcement if current period ends within 30 minutes and toll changes
        if (timeDiff <= 30) {
          const nextPeriodIndex = (currentPeriodIndex + 1) % timeSlots.periods.length;
          const nextPeriod = timeSlots.periods[nextPeriodIndex];

          if (nextPeriod && nextPeriod.toll !== currentPeriod.toll) {
            const nextToll = nextPeriod.toll;
            let nextTollDisplay = "";

            if (typeof nextToll === "object" && "range" in nextToll) {
              const [min, max] = nextToll.range;
              if (vehicle.multiplier) {
                const minMoto = Math.round(min * vehicle.multiplier * 10) / 10;
                const maxMoto = Math.round(max * vehicle.multiplier * 10) / 10;
                nextTollDisplay = `$${minMoto} - $${maxMoto}`;
              } else {
                nextTollDisplay = `$${min} - $${max}`;
              }
            } else {
              if (vehicle.multiplier) {
                const motorcycleToll = Math.round(nextToll * vehicle.multiplier * 10) / 10;
                nextTollDisplay = `$${motorcycleToll}`;
              } else {
                nextTollDisplay = `$${nextToll}`;
              }
            }

            setPriceChangeAlert(`📢收費將在 ${nextPeriod.timeRange.split(" - ")[0]} 變為 ${nextTollDisplay}`);
          }
        } else {
          setPriceChangeAlert("");
        }
      };

      checkPriceChange();
    } else {
      setCurrentToll("無法計算");
      setPriceChangeAlert("");
    }
  }, [tollData, selectedVehicle, selectedTunnel, currentTime, isPublicHoliday]);

  const isTimeInRange = (time: string, start: string, end: string): boolean => {
    const timeMinutes = timeToMinutes(time);
    const startMinutes = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);

    if (startMinutes <= endMinutes) {
      return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
    } else {
      // Overnight range
      return timeMinutes >= startMinutes || timeMinutes <= endMinutes;
    }
  };

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Return early if no data - let Suspense handle loading
  if (!tollData) {
    return <LoadingFallback />;
  }

  const hkTime = new Date(currentTime.toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" }));

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="text-center m-2 md:m-4">
        <h1 className="text-3xl md:text-4xl font-bold md:p-2">香港實時隧道收費</h1>
        <p>提供三條過海隧道和大欖隧道的實時收費資訊</p>
      </div>

      {/* Current Toll Display */}
      <div className="card-base p-8 mb-4">
        <div className="text-center">
          <h3 className="text-2xl md:text-xl font-semibold mb-2">目前收費</h3>
          <p className="text-6xl md:text-5xl font-bold text-green-600 mb-2">{currentToll}</p>
          <p className="text-lg md:text-base">
            {tollData.tunnels[selectedTunnel].name} &#x2022; {tollData.vehicleTypes[selectedVehicle].name}
          </p>
        </div>

        {/* Price Change Alert */}
        {priceChangeAlert && (
          <div className="mt-2 p-1 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
            <span className="text-lg md:text-sm text-yellow-800 font-medium">{priceChangeAlert}</span>
          </div>
        )}
      </div>

      {/* Selection Controls */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Tunnel Selection */}
        <div className="card-base">
          <h3 className="text-2xl md:text-lg font-semibold mb-2">選擇隧道</h3>
          <div className="grid grid-flow-col grid-rows-2 gap-4">
            {Object.entries(tollData.tunnels).map(([key, tunnel]) => (
              <Button
                key={key}
                color={selectedTunnel === key ? "primary" : "default"}
                size="lg"
                className="text-xl md:text-lg"
                onPress={() => setSelectedTunnel(key as HKTunnelIdentifier)}
              >
                {tunnel.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Vehicle Type Selection */}
        <div className="card-base">
          <h3 className="text-2xl md:text-lg font-semibold mb-2">選擇車輛類型</h3>
          <div className="grid grid-flow-col grid-rows-2 gap-4">
            {Object.entries(tollData.vehicleTypes).map(([key, vehicle]) => (
              <Button
                key={key}
                color={selectedVehicle === key ? "primary" : "default"}
                size="lg"
                className="text-xl md:text-lg"
                onPress={() => setSelectedVehicle(key as VehicleTypeIdentifier)}
              >
                {vehicle.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Time Periods Table */}
      <div className="card-base overflow-hidden mb-4">
        <h3 className="text-2xl md:text-lg font-semibold border-b">
          收費時段表 ({hkTime.getDay() === 0 || isPublicHoliday ? "星期日及公眾假期" : "平日"})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">時段</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">時間</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">西隧</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">紅隧</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">東隧</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">大欖隧道</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(() => {
                const hkTime = new Date(currentTime.toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" }));
                const isHolidaySchedule = hkTime.getDay() === 0 || isPublicHoliday;

                // Get periods from the selected tunnel (they should all have the same structure)
                const referenceTunnel = tollData.tunnels[selectedTunnel];
                if (!referenceTunnel || !referenceTunnel.timeVaryingTolls) return [];

                const timeSlots = isHolidaySchedule
                  ? referenceTunnel.timeVaryingTolls.sundays
                  : referenceTunnel.timeVaryingTolls.weekdays;

                const formatToll = (tunnelKey: HKTunnelIdentifier, period: TollPeriod, multiplier?: number) => {
                  const tunnelData = tollData.tunnels[tunnelKey];
                  if (!tunnelData || !tunnelData.timeVaryingTolls) return "N/A";

                  const tunnelTimeSlots = isHolidaySchedule
                    ? tunnelData.timeVaryingTolls.sundays
                    : tunnelData.timeVaryingTolls.weekdays;

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

                const getFixedToll = (tunnelKey: string, vehicle: VehicleType) => {
                  if (tunnelKey === "tai_lam" && vehicle.tai_lam_toll) {
                    return `$${vehicle.tai_lam_toll}`;
                  }
                  return `$${vehicle.fixedToll || 0}`;
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
                        ? formatToll("western", period, vehicle.multiplier)
                        : getFixedToll("western", vehicle)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {vehicle.hasTimeVaryingToll
                        ? formatToll("cross", period, vehicle.multiplier)
                        : getFixedToll("cross", vehicle)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {vehicle.hasTimeVaryingToll
                        ? formatToll("eastern", period, vehicle.multiplier)
                        : getFixedToll("eastern", vehicle)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {vehicle.hasTimeVaryingToll
                        ? formatToll("tai_lam", period, vehicle.multiplier)
                        : getFixedToll("tai_lam", vehicle)}
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-blue-100 dark:bg-blue-900 border border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-200 p-3 rounded">
        <h3>重要說明</h3>
        <ul>
          {tollData.notes.map((note, index) => (
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
          {hkTime.toLocaleString("zh-HK", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })}
        </p>
      </div>
    </div>
  );
}

const LoadingFallback: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-xl md:text-base">載入中...</p>
      </div>
    </div>
  );
};

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

const Page: React.FC = () => {
  return (
    <main>
      <StatsCollection />
      <SiteHeader />
      <AdUnit />
      <HeroUIProvider>
        <ThemeProvider>
          <Suspense fallback={<LoadingFallback />}>
            <HKTunnelsTollsApp />
          </Suspense>
        </ThemeProvider>
      </HeroUIProvider>
      <SiteFooter />
    </main>
  );
};

export default memo(Page);
