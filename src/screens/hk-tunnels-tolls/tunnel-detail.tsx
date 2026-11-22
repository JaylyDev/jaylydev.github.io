import React, { JSX, useCallback, useEffect, useMemo, useState, useTransition } from "react";
import Head from "next/head";
import Link from "next/link";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { SiteFooter, SiteHeader, StatsCollection } from "@/components/SiteFormat";
import { createTranslateFunction, getHreflang, LocaleProps, TranslateFunction } from "@/locale/i18n";
import tollData from "./data/tolls.json";
import {
  AlertBadge,
  CompanionAppCard,
  HreflangLinks,
  NextTollCountdown,
  SingleTunnelVehicleTable,
  TRAFFIC_COLORS,
  TRAFFIC_LABEL_IDS,
  TunnelCctvGrid,
  TunnelTable,
  VehicleSelector,
} from "./components";
import {
  buildPublicHolidaySet,
  getCurrentTollForTunnel,
  getHongKongDate,
  getNextTollChange,
  getTunnelInfo,
  isValidVehicle,
  JourneyReading,
  readingForExtraRoute,
  readingForRoute,
  TrafficStatus,
  useHongKongClock,
  useLiveTrafficData,
} from "./tollUtils";
import {
  getHubPagePath,
  getTunnelPagePath,
  OG_IMAGE_URL,
  SITE_URL,
  TUNNEL_DETAIL_BY_SLUG,
  TunnelDetailConfig,
  VehicleTypeIdentifier,
} from "./tunnelData";

export interface TunnelDetailScreenProps extends LocaleProps {
  tunnelSlug: string;
}

interface TrafficDirectionItem {
  direction: string;
  reading: JourneyReading | null;
}

interface TunnelDetailBodyProps {
  config: TunnelDetailConfig;
  lang: string;
  t: TranslateFunction;
}

function TunnelDetailBody({ config, lang, t }: TunnelDetailBodyProps): JSX.Element {
  const isZh = lang === "zh";
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleTypeIdentifier>("privateCar");
  const [tableVehicle, setTableVehicle] = useState<VehicleTypeIdentifier>("privateCar");
  const [, startTransition] = useTransition();
  const [isClient, setIsClient] = useState<boolean>(false);

  const currentTime = useHongKongClock();
  const { journeyReadings, irnSpeeds } = useLiveTrafficData();
  const holidays = useMemo(() => buildPublicHolidaySet(), []);

  useEffect(() => {
    setIsClient(true);
    const searchParams = new URLSearchParams(window.location.search);
    const v = searchParams.get("vehicle") ?? window.localStorage.getItem("hk-tunnel-vehicle");
    if (v && isValidVehicle(v)) {
      setSelectedVehicle(v);
      setTableVehicle(v);
    }
  }, []);

  const handleSelectVehicle = useCallback((vehicle: VehicleTypeIdentifier) => {
    setSelectedVehicle(vehicle);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("hk-tunnel-vehicle", vehicle);
    }
    startTransition(() => {
      setTableVehicle(vehicle);
    });
  }, []);

  const isPublicHoliday = useMemo(() => {
    if (!currentTime) return false;
    return holidays.has(getHongKongDate(currentTime).dateString);
  }, [currentTime, holidays]);

  const tollResult = useMemo(() => {
    if (config.isFree || !config.registryKey) {
      return { message: isZh ? "HK$0（免費）" : "HK$0 (Free)" };
    }
    return getCurrentTollForTunnel(selectedVehicle, config.registryKey, currentTime, isPublicHoliday, isClient, t);
  }, [config.isFree, config.registryKey, selectedVehicle, currentTime, isPublicHoliday, isClient, isZh, t]);

  const nextChange = useMemo(() => {
    if (config.isFree || !config.registryKey || !isClient) return null;
    return getNextTollChange(selectedVehicle, config.registryKey, currentTime, isPublicHoliday, holidays);
  }, [config.isFree, config.registryKey, selectedVehicle, currentTime, isPublicHoliday, holidays, isClient]);

  const hasTimeVarying = Boolean(
    config.registryKey && "timeVaryingTolls" in tollData.tunnels[config.registryKey],
  );

  const directionItems: TrafficDirectionItem[] = useMemo(() => {
    if (config.registryKey) {
      const info = getTunnelInfo(config.registryKey);
      return info.journeyRoutes.map((route) => ({
        direction: route.direction,
        reading: readingForRoute(info, route, journeyReadings, irnSpeeds),
      }));
    }
    if (config.extraRoutes) {
      return config.extraRoutes.map((route) => ({
        direction: route.direction,
        reading: readingForExtraRoute(config.lengthKm, route, journeyReadings),
      }));
    }
    return [];
  }, [config.registryKey, config.extraRoutes, config.lengthKm, journeyReadings, irnSpeeds]);

  const hubPath = getHubPagePath(lang);
  const homePath = isZh ? "/zh/" : "/";
  const shortName = isZh ? config.shortName.zh : config.shortName.en;
  const officialName = isZh ? config.officialName.zh : config.officialName.en;
  const siblingTunnels = config.siblingSlugs
    .map((slug) => TUNNEL_DETAIL_BY_SLUG[slug])
    .filter((item): item is TunnelDetailConfig => Boolean(item));

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-600 dark:text-gray-300 mt-3 mb-2 flex flex-wrap gap-1.5">
        <Link href={homePath}>{t("header.home")}</Link>
        <span aria-hidden="true">/</span>
        <Link href={hubPath}>{t("pageHeading")}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="font-medium text-gray-900 dark:text-white">
          {shortName}
        </span>
      </nav>

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold my-3 text-center">
        {isZh ? config.h1.zh : config.h1.en}
      </h1>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-4">
        {isZh
          ? `最新收費標準（已更新三隧分流及大欖隧道分時段收費時間表）：${officialName}`
          : `Latest official schedule (updated for Hong Kong time-varying tunnel tolls): ${officialName}`}
      </p>

      {!config.isFree && (
        <VehicleSelector t={t} selectedVehicle={selectedVehicle} onSelectVehicle={handleSelectVehicle} />
      )}

      {/* Above-the-fold live toll & traffic card with fixed min-height to prevent CLS */}
      <section className="card-base-min mb-4 min-h-[210px]">
        <div className="flex gap-3">
          <span
            className="w-2 self-stretch rounded-full shrink-0"
            style={{ backgroundColor: config.color }}
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-black/15 dark:border-white/15 pb-2 mb-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">{officialName}</h2>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  {isZh
                    ? `全長 ${config.lengthKm} 公里 | 限速 ${config.speedLimitKmh} km/h`
                    : `Length ${config.lengthKm} km | Speed limit ${config.speedLimitKmh} km/h`}
                </span>
              </div>
              <div className="text-right">
                <p className="text-3xl sm:text-5xl font-bold text-green-600 dark:text-green-400">{tollResult.message}</p>
                {tollResult.isTransitionTime && (
                  <div className="mt-1">
                    <AlertBadge background="bg-amber-100 dark:bg-amber-900" text="text-amber-800 dark:text-amber-200">
                      {t("transitionPeriod")}
                    </AlertBadge>
                  </div>
                )}
              </div>
            </div>

            {hasTimeVarying && (
              <div className="min-h-[32px] mb-3 flex items-center justify-end">
                {isClient ? (
                  <NextTollCountdown nextChange={nextChange} lang={lang} />
                ) : (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {isZh ? "載入即時轉價倒數..." : "Loading next toll change countdown..."}
                  </span>
                )}
              </div>
            )}

            {/* Bidirectional live traffic status, journey time, and average speed */}
            <div className="space-y-2">
              <h3 className="text-base font-semibold">{t("traffic.heading")}</h3>
              {directionItems.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {directionItems.map(({ direction, reading }) => {
                    const status = reading ? reading.status : TrafficStatus.Unknown;
                    const colors = TRAFFIC_COLORS[status];
                    const pulse = reading ? "" : "animate-pulse";
                    const statusLabel = reading ? t(TRAFFIC_LABEL_IDS[status]) : "-";
                    const minutesLabel = reading && reading.minutes !== null ? String(reading.minutes) : "--";
                    const speedLabel =
                      reading && reading.speedKmh !== null && reading.speedKmh !== undefined
                        ? t("traffic.speed", String(reading.speedKmh))
                        : null;
                    return (
                      <div
                        key={direction}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-gray-50 dark:bg-gray-900/60 px-3 py-2"
                      >
                        <span className="text-base sm:text-lg font-medium">{t(`direction.${direction}`)}</span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <AlertBadge background={colors.background} text={colors.text} className={pulse}>
                            {statusLabel}
                          </AlertBadge>
                          <AlertBadge background={colors.background} text={colors.text} className={pulse}>
                            {t("traffic.minutes", minutesLabel)}
                          </AlertBadge>
                          {speedLabel && (
                            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800">
                              {speedLabel}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {isZh
                    ? "請參考下方運輸署即時交通快拍鏡頭查看出入口車龍情況。"
                    : "Check the live Transport Department CCTV snapshots below for portal queues."}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Live Transport Department CCTV traffic snapshots */}
      <TunnelCctvGrid cameras={config.cameras} lang={lang} />

      {/* Below-the-fold static toll schedule HTML tables */}
      {config.isFree ? (
        <section className="card-base-min mb-4 hk-below-fold-section">
          <h2 className="text-xl md:text-lg font-semibold border-b pb-1 mb-2">
            {isZh ? "收費詳情：HK$0 免費通行" : "Toll Details: HK$0 Free"}
          </h2>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
            {isZh ? config.hkeTollNote.zh : config.hkeTollNote.en}
          </p>
        </section>
      ) : null}

      {config.registryKey && hasTimeVarying && (
        <TunnelTable
          tunnelKey={config.registryKey}
          selectedVehicle={tableVehicle}
          lang={lang}
          t={t}
          showDetailLink={false}
        />
      )}

      <SingleTunnelVehicleTable
        tunnelKey={config.registryKey}
        isFree={config.isFree}
        lang={lang}
        t={t}
      />

      {/* Static tunnel facts */}
      <section className="card-base-min mb-4 hk-below-fold-section">
        <h2 className="text-xl md:text-lg font-semibold border-b pb-1 mb-3">
          {isZh ? `${shortName}基本資料與行車貼士` : `${shortName} Facts & Driving Tips`}
        </h2>
        <dl className="space-y-2.5 text-sm sm:text-base">
          <div>
            <dt className="font-semibold">{isZh ? "官方名稱" : "Official Name"}</dt>
            <dd className="text-gray-700 dark:text-gray-300">{officialName}</dd>
          </div>
          <div>
            <dt className="font-semibold">{isZh ? "連接道路及方向" : "Connecting Roads & Directions"}</dt>
            <dd className="text-gray-700 dark:text-gray-300">
              {isZh ? config.connectingRoads.zh : config.connectingRoads.en}
            </dd>
          </div>
          <div>
            <dt className="font-semibold">{isZh ? "隧道長度及限速" : "Length & Speed Limit"}</dt>
            <dd className="text-gray-700 dark:text-gray-300">
              {isZh
                ? `約 ${config.lengthKm} 公里，法定車速限制 ${config.speedLimitKmh} km/h`
                : `Approx. ${config.lengthKm} km, legal speed limit ${config.speedLimitKmh} km/h`}
            </dd>
          </div>
          <div>
            <dt className="font-semibold">{isZh ? "易通行 (HKeToll) 及收費備註" : "HKeToll & Payment Note"}</dt>
            <dd className="text-gray-700 dark:text-gray-300">
              {isZh ? config.hkeTollNote.zh : config.hkeTollNote.en}
            </dd>
          </div>
          <div>
            <dt className="font-semibold">{isZh ? "擠塞時替代路線建議" : "Alternative Routes When Congested"}</dt>
            <dd className="text-gray-700 dark:text-gray-300">
              {isZh ? config.alternativeRoutes.zh : config.alternativeRoutes.en}
            </dd>
          </div>
        </dl>
      </section>

      {/* Internal links back to Hub and sibling tunnels */}
      <section className="card-base-min mb-4 hk-below-fold-section">
        <h2 className="text-xl md:text-lg font-semibold border-b pb-1 mb-3">
          {isZh ? "其他香港隧道即時收費及路況" : "Other Hong Kong Tunnels"}
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href={hubPath}
            className="inline-block rounded-md border border-blue-500 px-3 py-1.5 text-sm font-semibold no-underline hover:bg-blue-50 dark:hover:bg-blue-950"
          >
            {isZh ? "← 返回全港隧道即時收費總覽" : "← All Hong Kong Tunnel Tolls"}
          </Link>
          {siblingTunnels.map((sibling) => (
            <Link
              key={sibling.slug}
              href={getTunnelPagePath(sibling.slug, lang)}
              className="inline-block rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm font-medium no-underline hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isZh ? sibling.shortName.zh : sibling.shortName.en}
            </Link>
          ))}
        </div>
      </section>

      <CompanionAppCard lang={lang} />

      <p className="text-center text-sm text-gray-500 p-4">
        {t("lastUpdated")}
        <span suppressHydrationWarning>
          {currentTime
            ? currentTime.toLocaleString("zh-HK", {
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

export default function TunnelDetailScreen({
  texts,
  lang,
  localizedRoutes,
  tunnelSlug,
}: TunnelDetailScreenProps): JSX.Element {
  const t = createTranslateFunction(texts);
  const config = TUNNEL_DETAIL_BY_SLUG[tunnelSlug];
  const isZh = lang === "zh";
  const hreflang = getHreflang(lang, localizedRoutes, true);
  const enPath = getTunnelPagePath(tunnelSlug, "en");
  const zhPath = getTunnelPagePath(tunnelSlug, "zh");
  const canonicalUrl = `${SITE_URL}${isZh ? zhPath : enPath}`;

  const pageTitle = isZh ? config.seoTitle.zh : config.seoTitle.en;
  const pageDescription = isZh ? config.seoDescription.zh : config.seoDescription.en;
  const shortName = isZh ? config.shortName.zh : config.shortName.en;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("header.home"),
        item: `${SITE_URL}${isZh ? "/zh/" : "/"}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("pageHeading"),
        item: `${SITE_URL}${getHubPagePath(lang)}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: shortName,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <HreflangLinks enPath={enPath} zhPath={zhPath} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="JaylyMC" />
        <meta property="og:image" content={OG_IMAGE_URL} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={hreflang} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={OG_IMAGE_URL} />
        <link rel="manifest" href={t("pwa.url")} crossOrigin="use-credentials" />
        <meta name="apple-mobile-web-app-title" content={t("appTitle")} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/hk-tunnels-tolls/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }}
        />
      </Head>
      <StatsCollection />
      <SiteHeader t={t} icon="/hk-tunnels-tolls/icon.png" lang={lang} localizedRoutes={localizedRoutes} />
      <HeroUIProvider>
        <ThemeProvider>
          <TunnelDetailBody config={config} lang={lang} t={t} />
        </ThemeProvider>
      </HeroUIProvider>
      <SiteFooter t={t} lang={lang} localizedRoutes={localizedRoutes} />
    </>
  );
}
