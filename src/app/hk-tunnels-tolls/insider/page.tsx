"use client";

import "@/styles/components/card.css";
import { StatsCollection, SiteFooter, SiteHeader } from "@/components/SiteFormat";
import { useEffect, useState } from "react";
import { HeroUIProvider, Button } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { InArticleAdUnit } from "@/components/AdUnit";

interface TollData {
  tunnels: Record<string, any>;
  vehicleTypes: Record<string, any>;
}

type Screen = "main" | "vehicle" | "result";

function HKTunnelsTollsApp(): JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<Screen>("main");
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [selectedTunnel, setSelectedTunnel] = useState<string>("");
  const [tollData, setTollData] = useState<TollData | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Load toll data
  useEffect(() => {
    fetch("/api/hk-tunnels-tolls/tolls_insider.json")
      .then((response) => response.json())
      .then((data) => setTollData(data))
      .catch((error) => console.error("載入收費資料失敗:", error));
  }, []);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getHKTime = () => {
    return new Date(currentTime.toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" }));
  };

  const getCurrentToll = (tunnelKey: string, vehicleType: string) => {
    if (!tollData) return 0;

    const vehicle = tollData.vehicleTypes[vehicleType];
    if (!vehicle) return 0;

    // Handle fixed toll vehicles
    if (!vehicle.hasTimeVaryingToll) {
      if (tunnelKey === "tai_lam" && vehicle.tai_lam_toll) {
        return vehicle.tai_lam_toll;
      }
      return vehicle.fixedToll || 0;
    }

    const hkTime = getHKTime();
    const isWeekend = hkTime.getDay() === 0;
    const currentTimeStr = hkTime.toTimeString().slice(0, 5);

    const tunnel = tollData.tunnels[tunnelKey];
    if (!tunnel) return 0;

    const timeSlots = isWeekend ? tunnel.timeVaryingTolls.sundays : tunnel.timeVaryingTolls.weekdays;

    for (const period of timeSlots.periods) {
      const [startTime, endTime] = period.timeRange.split(" - ");
      if (isTimeInRange(currentTimeStr, startTime, endTime)) {
        if (typeof period.toll === "object" && period.toll.range) {
          return period.toll.range[1]; // Use higher value in range
        }
        return period.toll;
      }
    }
    return 0;
  };

  const getNextPeriodToll = (tunnelKey: string, vehicleType: string) => {
    if (!tollData) return null;

    const vehicle = tollData.vehicleTypes[vehicleType];
    if (!vehicle || !vehicle.hasTimeVaryingToll) return null;

    const hkTime = getHKTime();
    const isWeekend = hkTime.getDay() === 0;
    const currentTimeStr = hkTime.toTimeString().slice(0, 5);

    const tunnel = tollData.tunnels[tunnelKey];
    if (!tunnel) return null;

    const timeSlots = isWeekend ? tunnel.timeVaryingTolls.sundays : tunnel.timeVaryingTolls.weekdays;

    // Find current period index
    let currentPeriodIndex = -1;
    for (let i = 0; i < timeSlots.periods.length; i++) {
      const period = timeSlots.periods[i];
      const [startTime, endTime] = period.timeRange.split(" - ");
      if (isTimeInRange(currentTimeStr, startTime, endTime)) {
        currentPeriodIndex = i;
        break;
      }
    }

    // Get next period
    const nextPeriodIndex = (currentPeriodIndex + 1) % timeSlots.periods.length;
    const nextPeriod = timeSlots.periods[nextPeriodIndex];

    if (nextPeriod) {
      const nextTime = nextPeriod.timeRange.split(" - ")[0];
      const nextToll =
        typeof nextPeriod.toll === "object" && nextPeriod.toll.range ? nextPeriod.toll.range[1] : nextPeriod.toll;

      return { time: nextTime, toll: nextToll };
    }

    return null;
  };

  const isTimeInRange = (currentTime: string, startTime: string, endTime: string): boolean => {
    const current = timeToMinutes(currentTime);
    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);

    if (start <= end) {
      return current >= start && current <= end;
    } else {
      return current >= start || current <= end;
    }
  };

  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const getTunnelDisplayName = (tunnelKey: string): string => {
    const names: Record<string, string> = {
      cross: "紅隧",
      eastern: "東隧",
      western: "西隧",
      tai_lam: "大欖隧道",
    };
    return names[tunnelKey] || tunnelKey;
  };

  const getVehicleDisplayName = (vehicleKey: string): string => {
    const names: Record<string, string> = {
      privateCar: "私家車",
      motorcycle: "電單車",
      taxi: "的士",
      commercial: "商用車輛",
    };
    return names[vehicleKey] || vehicleKey;
  };

  if (currentScreen === "main") {
    return (
      <div
        style={{
          height: "100vh",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            height: "100%",
            justifyContent: "space-evenly",
          }}
        >
          <Button
            style={{
              backgroundColor: "#ff0000",
              color: "white",
              padding: "60px 40px",
              fontSize: "48px",
              fontWeight: "bold",
              borderRadius: "15px",
              minHeight: "120px",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              setSelectedTunnel("cross");
              setCurrentScreen("vehicle");
            }}
          >
            紅隧
          </Button>
          <Button
            style={{
              backgroundColor: "#ffff00",
              color: "black",
              padding: "60px 40px",
              fontSize: "48px",
              fontWeight: "bold",
              borderRadius: "15px",
              minHeight: "120px",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              setSelectedTunnel("eastern");
              setCurrentScreen("vehicle");
            }}
          >
            東隧
          </Button>
          <Button
            style={{
              backgroundColor: "#00ffff",
              color: "blue",
              padding: "60px 40px",
              fontSize: "48px",
              fontWeight: "bold",
              borderRadius: "15px",
              minHeight: "120px",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              setSelectedTunnel("western");
              setCurrentScreen("vehicle");
            }}
          >
            西隧
          </Button>
          <Button
            style={{
              backgroundColor: "#00aa00",
              color: "white",
              padding: "60px 40px",
              fontSize: "48px",
              fontWeight: "bold",
              borderRadius: "15px",
              minHeight: "120px",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              setSelectedTunnel("tai_lam");
              setCurrentScreen("vehicle");
            }}
          >
            大欖隧道
          </Button>
        </div>
      </div>
    );
  }

  if (currentScreen === "vehicle") {
    return (
      <div
        style={{
          height: "100vh",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          maxWidth: "100%",
        }}
      >
        <Button
          style={{
            backgroundColor: "#ff8c00",
            color: "white",
            padding: "15px 30px",
            fontSize: "24px",
            borderRadius: "10px",
            marginBottom: "30px",
          }}
          onClick={() => setCurrentScreen("main")}
        >
          返回
        </Button>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            flex: 1,
            justifyContent: "space-evenly",
          }}
        >
          <Button
            style={{
              backgroundColor: "#888888",
              color: "white",
              padding: "50px 40px",
              fontSize: "36px",
              fontWeight: "bold",
              borderRadius: "15px",
              minHeight: "100px",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              setSelectedVehicle("privateCar");
              setCurrentScreen("result");
            }}
          >
            私家車
          </Button>
          <Button
            style={{
              backgroundColor: "#888888",
              color: "white",
              padding: "50px 40px",
              fontSize: "36px",
              fontWeight: "bold",
              borderRadius: "15px",
              minHeight: "100px",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              setSelectedVehicle("motorcycle");
              setCurrentScreen("result");
            }}
          >
            電單車
          </Button>
          <Button
            style={{
              backgroundColor: "#888888",
              color: "white",
              padding: "50px 40px",
              fontSize: "36px",
              fontWeight: "bold",
              borderRadius: "15px",
              minHeight: "100px",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              setSelectedVehicle("taxi");
              setCurrentScreen("result");
            }}
          >
            的士
          </Button>
          <Button
            style={{
              backgroundColor: "#888888",
              color: "white",
              padding: "50px 40px",
              fontSize: "36px",
              fontWeight: "bold",
              borderRadius: "15px",
              minHeight: "100px",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              setSelectedVehicle("commercial");
              setCurrentScreen("result");
            }}
          >
            其他交通工具
          </Button>
        </div>
      </div>
    );
  }

  if (currentScreen === "result") {
    const hkTime = getHKTime();
    const currentToll = getCurrentToll(selectedTunnel, selectedVehicle);
    const nextPeriod = getNextPeriodToll(selectedTunnel, selectedVehicle);
    const tunnelName = getTunnelDisplayName(selectedTunnel);
    const vehicleName = getVehicleDisplayName(selectedVehicle);

    return (
      <div
        style={{
          height: "100vh",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          maxWidth: "100%",
        }}
      >
        <Button
          style={{
            backgroundColor: "#ff8c00",
            color: "white",
            padding: "15px 30px",
            fontSize: "24px",
            borderRadius: "10px",
            marginBottom: "30px",
          }}
          onClick={() => setCurrentScreen("vehicle")}
        >
          返回
        </Button>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#e6e6fa",
              padding: "40px",
              borderRadius: "15px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                margin: "0",
                fontSize: "32px",
                color: "#333",
                fontWeight: "bold",
              }}
            >
              {vehicleName}現在收費:${currentToll}
            </h2>
          </div>

          {nextPeriod && (
            <div
              style={{
                backgroundColor: "#4a4a8a",
                color: "white",
                padding: "40px",
                borderRadius: "15px",
                textAlign: "center",
              }}
            >
              <h2 style={{ margin: "0", fontSize: "28px", fontWeight: "bold" }}>
                {vehicleName}下時段 ({nextPeriod.time}) 收費：${nextPeriod.toll}
              </h2>
            </div>
          )}

          <div
            style={{
              textAlign: "center",
              fontSize: "32px",
              fontWeight: "bold",
              color: "#333",
              padding: "20px",
            }}
          >
            <div style={{ marginBottom: "10px" }}>{tunnelName}</div>
            <div style={{ marginBottom: "5px" }}>{hkTime.toTimeString().slice(0, 5)}</div>
            <div style={{ fontSize: "24px", color: "#666" }}>(now)</div>
          </div>
        </div>
      </div>
    );
  }

  return <div></div>;
}

export default function Page(): JSX.Element {
  return (
    <html lang="zh-HK" suppressHydrationWarning>
      <body>
        <StatsCollection />
        <SiteHeader />
        <InArticleAdUnit />
        <HeroUIProvider>
          <ThemeProvider>
            <HKTunnelsTollsApp />
          </ThemeProvider>
        </HeroUIProvider>
        <SiteFooter />
      </body>
    </html>
  );
}
