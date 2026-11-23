import React, { JSX, ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { TranslateFunction } from "@/locale/i18n";
import registryInfo from "./data/registry.json";
import tollData from "./data/tolls.json";
import {
  FREE_GOVERNMENT_TUNNELS,
  getTunnelPagePath,
  HKTunnelIdentifier,
  HUB_FAQ_ITEMS,
  SITE_URL,
  TUNNEL_SLUG_BY_REGISTRY_KEY,
  TunnelCamera,
  VehicleTypeIdentifier,
} from "./tunnelData";
import {
  isValidTunnel,
  isValidVehicle,
  NextTollChangeInfo,
  resolveLocalizedString,
  TollChangeDirection,
  TollPeriod,
  TrafficStatus,
  VehicleType,
} from "./tollUtils";

export interface BadgeColors {
  background: string;
  text: string;
}

export const TRAFFIC_COLORS: Record<TrafficStatus, BadgeColors> = {
  [TrafficStatus.Unknown]: { background: "bg-gray-100 dark:bg-gray-800", text: "text-gray-800 dark:text-gray-200" },
  [TrafficStatus.Smooth]: { background: "bg-green-100 dark:bg-green-900", text: "text-green-800 dark:text-green-200" },
  [TrafficStatus.Slow]: { background: "bg-amber-100 dark:bg-amber-900", text: "text-amber-800 dark:text-amber-200" },
  [TrafficStatus.Congested]: { background: "bg-red-100 dark:bg-red-900", text: "text-red-800 dark:text-red-200" },
  [TrafficStatus.Closed]: { background: "bg-red-100 dark:bg-red-900", text: "text-red-800 dark:text-red-200" },
};

export const TRAFFIC_LABEL_IDS: Record<TrafficStatus, string> = {
  [TrafficStatus.Unknown]: "traffic.unavailable",
  [TrafficStatus.Smooth]: "traffic.smooth",
  [TrafficStatus.Slow]: "traffic.slow",
  [TrafficStatus.Congested]: "traffic.congested",
  [TrafficStatus.Closed]: "traffic.closed",
};

export interface AlertBadgeProps {
  background: string;
  text: string;
  className?: string;
  children: ReactNode;
}

export function AlertBadge({ background, text, className = "", children }: AlertBadgeProps): JSX.Element {
  return (
    <span
      className={`text-[1.45rem] md:text-lg ${background} ${text} px-3 rounded-md font-medium inline-block text-center ${className}`}
    >
      {children}
    </span>
  );
}

export interface HreflangLinksProps {
  enPath: string;
  zhPath: string;
}

export function HreflangLinks({ enPath, zhPath }: HreflangLinksProps): JSX.Element {
  const enHref = `${SITE_URL}${enPath}`;
  const zhHref = `${SITE_URL}${zhPath}`;
  return (
    <>
      <link rel="alternate" hrefLang="zh-HK" href={zhHref} />
      <link rel="alternate" hrefLang="zh-Hant" href={zhHref} />
      <link rel="alternate" hrefLang="en" href={enHref} />
      <link rel="alternate" hrefLang="x-default" href={zhHref} />
    </>
  );
}

export interface VehicleSelectorProps {
  t: TranslateFunction;
  selectedVehicle: VehicleTypeIdentifier;
  onSelectVehicle: (vehicle: VehicleTypeIdentifier) => void;
}

export const VehicleSelector = React.memo(function VehicleSelector({
  t,
  selectedVehicle,
  onSelectVehicle,
}: VehicleSelectorProps): JSX.Element {
  return (
    <div className="card-base-min mb-4">
      <h2 className="text-lg md:text-base font-semibold mb-2">{t("vehicleTypeSelection")}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {Object.entries(tollData.vehicleTypes).map(([key], index, array) => {
          if (!isValidVehicle(key)) return null;
          const vehicle = resolveLocalizedString(registryInfo.vehicleTypes[key].name, t);
          return (
            <Button
              key={key}
              color={selectedVehicle === key ? "primary" : "default"}
              size="md"
              className={`text-base sm:text-lg md:text-base ${
                array.length % 2 === 1 && index === array.length - 1 ? "col-span-2 sm:col-span-1" : ""
              }`}
              onPress={() => onSelectVehicle(key)}
            >
              {vehicle}
            </Button>
          );
        })}
      </div>
    </div>
  );
});

export interface NextTollCountdownProps {
  nextChange: NextTollChangeInfo | null;
  lang: string;
}

export function NextTollCountdown({ nextChange, lang }: NextTollCountdownProps): JSX.Element | null {
  if (!nextChange) return null;
  const isZh = lang === "zh";
  const isIncrease = nextChange.direction === TollChangeDirection.Increase;
  const arrow = isIncrease ? "↑" : "↓";
  const colorClasses = isIncrease
    ? "bg-amber-100 dark:bg-amber-900/70 text-amber-900 dark:text-amber-100"
    : "bg-emerald-100 dark:bg-emerald-900/70 text-emerald-900 dark:text-emerald-100";

  const hours = Math.floor(nextChange.minutesUntil / 60);
  const mins = nextChange.minutesUntil % 60;
  const durationLabel = isZh
    ? hours > 0
      ? mins > 0
        ? `${hours}小時${mins}分`
        : `${hours}小時`
      : `${mins}分`
    : hours > 0
      ? mins > 0
        ? `${hours}h ${mins}m`
        : `${hours}h`
      : `${mins} min`;

  const text = isZh
    ? `${nextChange.targetTime} (${durationLabel}後) ${arrow} ${nextChange.nextTollDisplay}`
    : `${nextChange.targetTime} (in ${durationLabel}) ${arrow} ${nextChange.nextTollDisplay}`;

  return (
    <span className={`inline-block rounded-md px-3 text-xl md:text-lg font-medium ${colorClasses}`}>
      {text}
    </span>
  );
}

export interface TunnelTableProps {
  tunnelKey: HKTunnelIdentifier;
  selectedVehicle: VehicleTypeIdentifier;
  lang: string;
  t: TranslateFunction;
  showDetailLink?: boolean;
}

export const TunnelTable = React.memo(function TunnelTable({
  tunnelKey,
  selectedVehicle,
  lang,
  t,
  showDetailLink = true,
}: TunnelTableProps): JSX.Element {
  const tunnel = tollData.tunnels[tunnelKey];
  const vehicle = tollData.vehicleTypes[selectedVehicle];
  const tunnelName = resolveLocalizedString(registryInfo.tunnels[tunnelKey].name, t);
  const slug = TUNNEL_SLUG_BY_REGISTRY_KEY[tunnelKey];

  if (!tunnel || !("timeVaryingTolls" in tunnel)) {
    return <></>;
  }

  const formatToll = (period: TollPeriod, multiplier?: number): string => {
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

  const getFixedToll = (v: VehicleType): string => {
    if (v.fixedTolls && v.fixedTolls[tunnelKey] !== undefined) {
      return `$${v.fixedTolls[tunnelKey]}`;
    }
    return "$0";
  };

  const renderSchedule = (labelId: string, colorClass: string, periods: TollPeriod[]) => (
    <div>
      <h3 className={`text-lg md:text-base font-medium mb-2 ${colorClass}`}>{t(labelId)}</h3>
      <div className="hk-table-scroll">
        <table className="w-full min-w-[320px] text-sm sm:text-base">
          <thead>
            <tr>
              <th className="px-3 sm:px-6 py-2.5 text-left text-xs font-medium uppercase tracking-wider">
                {t("tableHeaderPeriod")}
              </th>
              <th className="px-3 sm:px-6 py-2.5 text-left text-xs font-medium uppercase tracking-wider">
                {t("tableHeaderTime")}
              </th>
              <th className="px-3 sm:px-6 py-2.5 text-left text-xs font-medium uppercase tracking-wider">
                {t("tableHeaderToll")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
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
                <td className="px-3 sm:px-6 py-3 whitespace-nowrap font-medium">
                  {resolveLocalizedString(period.name, t)}
                </td>
                <td className="px-3 sm:px-6 py-3 whitespace-nowrap">{period.timeRange}</td>
                <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
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
    <section className="card-base-min mb-4 hk-below-fold-section">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-1 mb-4">
        <h2 className="text-xl md:text-lg font-semibold">{t("tollRates", tunnelName)}</h2>
        {showDetailLink && (
          <Link href={getTunnelPagePath(slug, lang)} className="text-sm font-medium">
            {lang === "zh" ? `${tunnelName}詳情及鏡頭 →` : `${tunnelName} Details & CCTV →`}
          </Link>
        )}
      </div>
      <div className="mb-6">
        {renderSchedule("weekdaySchedule", "text-blue-600 dark:text-blue-400", tunnel.timeVaryingTolls.weekdays.periods)}
      </div>
      {renderSchedule(
        "weekendSchedule",
        "text-green-600 dark:text-green-400",
        tunnel.timeVaryingTolls.sundays_and_holidays.periods,
      )}
    </section>
  );
});

export interface SingleTunnelVehicleTableProps {
  tunnelKey: HKTunnelIdentifier | null;
  isFree: boolean;
  lang: string;
  t: TranslateFunction;
}

export const SingleTunnelVehicleTable = React.memo(function SingleTunnelVehicleTable({
  tunnelKey,
  isFree,
  lang,
  t,
}: SingleTunnelVehicleTableProps): JSX.Element {
  const isZh = lang === "zh";
  const vehicleKeys = Object.keys(tollData.vehicleTypes).filter(isValidVehicle);
  const tunnel = tunnelKey ? tollData.tunnels[tunnelKey] : null;
  const isTimeVarying = Boolean(tunnel && "timeVaryingTolls" in tunnel);

  const getRateSummary = (vKey: VehicleTypeIdentifier): string => {
    if (isFree || !tunnelKey) return isZh ? "$0（免費）" : "$0 (Free)";
    const vData = tollData.vehicleTypes[vKey];
    if (vData.fixedTolls && tunnelKey in vData.fixedTolls) {
      const amount = vData.fixedTolls[tunnelKey as keyof typeof vData.fixedTolls];
      return isZh ? `$${amount}（全日劃一）` : `$${amount} (All day flat)`;
    }
    if (tunnelKey) {
      const entry = tollData.tunnels[tunnelKey];
      if ("timeVaryingTolls" in entry) {
        const nums = entry.timeVaryingTolls.weekdays.periods
          .map((p) => p.toll)
          .filter((val): val is number => typeof val === "number");
        const mult = "multiplier" in vData ? vData.multiplier : 1;
        const min = Math.round(Math.min(...nums) * mult * 10) / 10;
        const max = Math.round(Math.max(...nums) * mult * 10) / 10;
        return isZh ? `$${min} - $${max}（按時段變動）` : `$${min} - $${max} (Time-varying)`;
      }
    }
    return "-";
  };

  return (
    <section className="card-base-min mb-4 hk-below-fold-section">
      <h2 className="text-xl md:text-lg font-semibold border-b pb-1 mb-3">
        {isZh
          ? isTimeVarying
            ? "各車輛類型收費總覽"
            : "各車輛類型全日收費表"
          : isTimeVarying
            ? "Toll Summary by Vehicle Class"
            : "All-Day Toll Schedule by Vehicle Class"}
      </h2>
      <div className="hk-table-scroll">
        <table className="w-full min-w-[300px] text-sm sm:text-base">
          <thead>
            <tr>
              <th className="px-3 sm:px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider">
                {isZh ? "車輛類型" : "Vehicle Class"}
              </th>
              <th className="px-3 sm:px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider">
                {t("tableHeaderToll")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {vehicleKeys.map((vKey) => {
              const vName = resolveLocalizedString(registryInfo.vehicleTypes[vKey].name, t);
              const vDesc = registryInfo.vehicleTypes[vKey].description;
              return (
                <tr key={vKey}>
                  <td className="px-3 sm:px-4 py-3 font-medium">
                    {vName}
                    {vDesc ? (
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        ({resolveLocalizedString(vDesc, t)})
                      </span>
                    ) : null}
                  </td>
                  <td className="px-3 sm:px-4 py-3 whitespace-nowrap font-semibold text-green-700 dark:text-green-400">
                    {getRateSummary(vKey)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
});

export interface FixedTunnelsTableProps {
  t: TranslateFunction;
  lang: string;
}

export const FixedTunnelsTable = React.memo(function FixedTunnelsTable({
  t,
  lang,
}: FixedTunnelsTableProps): JSX.Element {
  const fixedTunnelKeys = Object.keys(tollData.tunnels).filter(
    (key): key is HKTunnelIdentifier => isValidTunnel(key) && !("timeVaryingTolls" in tollData.tunnels[key]),
  );
  const vehicleKeys = Object.keys(tollData.vehicleTypes).filter(isValidVehicle);

  return (
    <section className="card-base-min mb-4 hk-below-fold-section">
      <h2 className="text-xl md:text-lg font-semibold border-b pb-1 mb-4">{t("fixedTollRatesTitle")}</h2>
      <div className="hk-table-scroll">
        <table className="w-full min-w-[420px] text-sm sm:text-base">
          <thead>
            <tr>
              <th className="px-3 sm:px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider">
                {t("tableHeaderTunnel")}
              </th>
              {vehicleKeys.map((vKey) => (
                <th key={vKey} className="px-3 sm:px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider">
                  {resolveLocalizedString(registryInfo.vehicleTypes[vKey].name, t)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {fixedTunnelKeys.map((tKey) => {
              const tName = resolveLocalizedString(registryInfo.tunnels[tKey].name, t);
              const slug = TUNNEL_SLUG_BY_REGISTRY_KEY[tKey];
              return (
                <tr key={tKey}>
                  <td className="px-3 sm:px-4 py-3 whitespace-nowrap font-medium">
                    <Link href={getTunnelPagePath(slug, lang)}>{tName}</Link>
                  </td>
                  {vehicleKeys.map((vKey) => {
                    const vData = tollData.vehicleTypes[vKey];
                    const amount =
                      vData.fixedTolls && tKey in vData.fixedTolls
                        ? vData.fixedTolls[tKey as keyof typeof vData.fixedTolls]
                        : 0;
                    return (
                      <td key={vKey} className="px-3 sm:px-4 py-3 whitespace-nowrap">
                        {`$${amount}`}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
});

export interface FreeTunnelsTableProps {
  lang: string;
}

export const FreeTunnelsTable = React.memo(function FreeTunnelsTable({ lang }: FreeTunnelsTableProps): JSX.Element {
  const isZh = lang === "zh";

  return (
    <section className="card-base-min mb-4 hk-below-fold-section" id="free-government-tunnels">
      <h2 className="text-xl md:text-lg font-semibold border-b pb-1 mb-3">
        {isZh ? "香港免費政府隧道一覽（$0）" : "Free Government Tunnels in Hong Kong ($0)"}
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        {isZh
          ? "以下 8 條香港政府行車隧道全日免費通行（所有車輛類型 $0），無須繳付隧道費："
          : "The following 8 Hong Kong government road tunnels are completely toll-free ($0) all day for every vehicle class:"}
      </p>
      <div className="hk-table-scroll">
        <table className="w-full min-w-[440px] text-sm sm:text-base">
          <thead>
            <tr>
              <th className="px-3 sm:px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider">
                {isZh ? "隧道名稱" : "Tunnel"}
              </th>
              <th className="px-3 sm:px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider">
                {isZh ? "收費" : "Toll"}
              </th>
              <th className="px-3 sm:px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider">
                {isZh ? "連接地區／備註" : "Connections & Notes"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {FREE_GOVERNMENT_TUNNELS.map((entry) => (
              <tr key={entry.name.en}>
                <td className="px-3 sm:px-4 py-3 whitespace-nowrap font-medium">
                  {entry.slug ? (
                    <Link href={getTunnelPagePath(entry.slug, lang)}>{isZh ? entry.name.zh : entry.name.en}</Link>
                  ) : isZh ? (
                    entry.name.zh
                  ) : (
                    entry.name.en
                  )}
                </td>
                <td className="px-3 sm:px-4 py-3 whitespace-nowrap font-semibold text-green-700 dark:text-green-400">
                  {isZh ? "$0 免費" : "$0 Free"}
                </td>
                <td className="px-3 sm:px-4 py-3">
                  <div>{isZh ? entry.connectingRoads.zh : entry.connectingRoads.en}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {isZh ? entry.note.zh : entry.note.en}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
});

export interface FaqSectionProps {
  lang: string;
}

export const FaqSection = React.memo(function FaqSection({ lang }: FaqSectionProps): JSX.Element {
  const isZh = lang === "zh";
  return (
    <section className="card-base-min mb-4 hk-below-fold-section" id="faq">
      <h2 className="text-xl md:text-lg font-semibold border-b pb-1 mb-3">
        {isZh ? "常見問題 (FAQ)" : "Frequently Asked Questions (FAQ)"}
      </h2>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {HUB_FAQ_ITEMS.map((item, idx) => (
          <div key={idx} className="py-3 first:pt-1 last:pb-1">
            <h3 className="text-base font-semibold mb-1">{isZh ? item.question.zh : item.question.en}</h3>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              {isZh ? item.answer.zh : item.answer.en}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
});

export interface TunnelCctvGridProps {
  cameras: TunnelCamera[];
  lang: string;
}

export const TunnelCctvGrid = React.memo(function TunnelCctvGrid({
  cameras,
  lang,
}: TunnelCctvGridProps): JSX.Element | null {
  const isZh = lang === "zh";
  const [refreshTick, setRefreshTick] = useState<number>(0);
  const [failedIds, setFailedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setRefreshTick(Math.floor(Date.now() / 120000));
    const id = setInterval(() => {
      setRefreshTick(Math.floor(Date.now() / 120000));
    }, 120000);
    return () => clearInterval(id);
  }, []);

  if (cameras.length === 0) return null;

  return (
    <section className="card-base-min mb-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-1 mb-3">
        <h2 className="text-xl md:text-lg font-semibold">
          {isZh ? "運輸署即時交通快拍 (CCTV)" : "Transport Department Live Traffic Snapshots (CCTV)"}
        </h2>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {isZh ? "每 2 分鐘自動更新" : "Auto-refreshes every 2 min"}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cameras.map((cam) => {
          const label = isZh ? cam.label.zh : cam.label.en;
          const imgSrc =
            refreshTick > 0
              ? `https://tdcctv.data.one.gov.hk/${cam.id}.JPG?t=${refreshTick}`
              : `https://tdcctv.data.one.gov.hk/${cam.id}.JPG`;
          const hasFailed = failedIds[cam.id] === true;
          return (
            <figure
              key={cam.id}
              className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-900"
            >
              <div className="aspect-[4/3] w-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                {hasFailed ? (
                  <span className="text-xs text-gray-500 dark:text-gray-400 px-3 text-center">
                    {isZh ? "暫時無法載入交通快拍" : "Traffic snapshot temporarily unavailable"}
                  </span>
                ) : (
                  <img
                    src={imgSrc}
                    alt={`${label} (${cam.id})`}
                    loading="lazy"
                    width={320}
                    height={240}
                    className="w-full h-full object-cover"
                    onError={() => setFailedIds((prev) => ({ ...prev, [cam.id]: true }))}
                  />
                )}
              </div>
              <figcaption className="px-3 py-1.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 flex items-center justify-between gap-2">
                <span>{label}</span>
                <span className="text-xs text-gray-400 shrink-0">{cam.id}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
});
