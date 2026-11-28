import Head from "next/head";
import Link from "next/link";
import React, { JSX, useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Button, ButtonGroup, HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { StatsCollection, SiteFooter, SiteHeader } from "@/components/SiteFormat";
import { InArticleAdUnit } from "@/components/AdUnit";
import { createTranslateFunction, getHreflang, LocaleProps, TranslateFunction } from "@/locale/i18n";
import registryInfo from "./data/registry.json";
import tollData from "./data/tolls.json";
import {
  AlertBadge,
  FaqSection,
  FixedTunnelsTable,
  FreeTunnelsTable,
  HreflangLinks,
  NextTollCountdown,
  TRAFFIC_COLORS,
  TRAFFIC_LABEL_IDS,
  TunnelTable,
  VehicleSelector,
} from "./components";
import {
  buildPublicHolidaySet,
  Coordinates,
  getCurrentTollForTunnel,
  getHongKongDate,
  getNextTollChange,
  getTunnelInfo,
  isCkbFullOpen,
  isValidTunnel,
  isValidVehicle,
  JourneyReading,
  nearestEntranceIndex,
  nearestEntranceKm,
  NextTollChangeInfo,
  readingForRoute,
  resolveLocalizedString,
  SortMode,
  TrafficStatus,
  useHongKongClock,
  useLiveTrafficData,
} from "./tollUtils";
import {
  getHubPagePath,
  getTunnelPagePath,
  GITHUB_REPO_URL,
  HKTunnelIdentifier,
  HUB_FAQ_ITEMS,
  getOgImageUrl,
  SITE_URL,
  TUNNEL_SLUG_BY_REGISTRY_KEY,
  VehicleTypeIdentifier,
} from "./tunnelData";

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

const COORDS_STORAGE_KEY = "hk-tunnel-coords";

function readStoredCoords(): Coordinates | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(COORDS_STORAGE_KEY);
  if (!raw) return null;
  const parsed = JSON.parse(raw) as Partial<Coordinates>;
  if (typeof parsed.lat === "number" && typeof parsed.lng === "number") {
    return { lat: parsed.lat, lng: parsed.lng };
  }
  return null;
}

function storeCoords(coords: Coordinates): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(COORDS_STORAGE_KEY, JSON.stringify(coords));
  }
}

interface TrafficRowsProps {
  tunnelKey: HKTunnelIdentifier;
  journeyReadings: Record<string, JourneyReading> | null;
  irnSpeeds: Record<string, number> | null;
  currentDate: Date | null;
  sortMode: SortMode;
  userCoords: Coordinates | null;
  t: TranslateFunction;
}

const TrafficRows = React.memo(function TrafficRows({
  tunnelKey,
  journeyReadings,
  irnSpeeds,
  currentDate,
  sortMode,
  userCoords,
  t,
}: TrafficRowsProps): JSX.Element | null {
  const tunnel = getTunnelInfo(tunnelKey);
  const routes = tunnel.journeyRoutes;

  // Hook must run unconditionally (before any early return) to keep hook order stable.
  const activeRoutes = useMemo(() => {
    if (!routes) return [];
    if (sortMode === SortMode.Nearest && userCoords) {
      const nearIndex = nearestEntranceIndex(tunnel.entrances, userCoords);
      const towards = routes.filter((route) => route.fromEntrance === nearIndex);
      if (towards.length > 0) return towards;
    }
    return routes;
  }, [sortMode, userCoords, routes, tunnel.entrances]);

  if (activeRoutes.length === 0) return null;

  const rows = activeRoutes.map((route) => ({
    route,
    reading: readingForRoute(tunnel, route, journeyReadings, irnSpeeds, currentDate),
  }));

  return (
    <div className="flex flex-col gap-1.5 py-1">
      {rows.map(({ route, reading }) => {
        const status = reading ? reading.status : TrafficStatus.Unknown;
        const colors = TRAFFIC_COLORS[status];
        const pulse = reading ? "" : "animate-pulse";
        const statusLabel = reading ? t(TRAFFIC_LABEL_IDS[status]) : "-";
        const minutesLabel = reading && reading.minutes !== null ? String(reading.minutes) : "--";
        return (
          <div key={route.direction} className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xl md:text-base text-gray-600 dark:text-gray-300">
              {t(`direction.${route.direction}`)}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <AlertBadge background={colors.background} text={colors.text} className={pulse}>
                {statusLabel}
              </AlertBadge>
              <AlertBadge background={colors.background} text={colors.text} className={pulse}>
                {t("traffic.minutes", minutesLabel)}
              </AlertBadge>
            </div>
          </div>
        );
      })}
    </div>
  );
});

interface TollCardProps {
  tunnelKey: HKTunnelIdentifier;
  vehicle: VehicleTypeIdentifier;
  nextChange: NextTollChangeInfo | null;
  currentDate: Date | null;
  isPublicHoliday: boolean;
  isClient: boolean;
  journeyReadings: Record<string, JourneyReading> | null;
  irnSpeeds: Record<string, number> | null;
  sortMode: SortMode;
  userCoords: Coordinates | null;
  lang: string;
  t: TranslateFunction;
}

const HKTollCard = React.memo(function HKTollCard(props: TollCardProps): JSX.Element {
  const { tunnelKey, nextChange, vehicle, currentDate, isPublicHoliday, isClient } = props;
  const { journeyReadings, irnSpeeds, sortMode, userCoords, lang, t } = props;
  const tollResult = getCurrentTollForTunnel(vehicle, tunnelKey, currentDate, isPublicHoliday, isClient, t);
  const tunnel = getTunnelInfo(tunnelKey);
  const slug = TUNNEL_SLUG_BY_REGISTRY_KEY[tunnelKey];
  const detailPath = getTunnelPagePath(slug, lang);

  return (
    <div className="flex gap-3 border-b border-black/20 dark:border-white/20 pb-2 last:border-b-0">
      <span
        className="w-1.5 self-stretch rounded-full shrink-0"
        style={{ backgroundColor: tunnel.color }}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <div className="flex flex-row justify-between items-start gap-2">
          <div className="text-left min-w-0">
            <Link
              href={detailPath}
              className="block text-2xl sm:text-3xl md:text-2xl font-medium text-inherit hover:text-blue-600 dark:hover:text-blue-400"
            >
              {resolveLocalizedString(tunnel.name, t)}
            </Link>
            <Link href={detailPath} className="text-sm text-blue-600 dark:text-blue-400">
              {lang === "zh" ? "路況及收費表 →" : "Details & CCTV →"}
            </Link>
          </div>
          <p className="text-right text-5xl py-1 md:py-2 font-bold text-green-600 dark:text-green-400 shrink-0">
            {tollResult.message}
          </p>
        </div>
        <TrafficRows
          tunnelKey={tunnelKey}
          journeyReadings={journeyReadings}
          irnSpeeds={irnSpeeds}
          currentDate={currentDate}
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
        {tunnelKey === "central_kowloon_bypass" && !isCkbFullOpen(currentDate) && (
          <div className="text-right py-1">
            <AlertBadge background="bg-amber-100 dark:bg-amber-900" text="text-amber-800 dark:text-amber-200">
              {t("ckbTollStartNotice")}
            </AlertBadge>
          </div>
        )}
        {nextChange && (
          <div className="text-right pt-0.5">
            <NextTollCountdown nextChange={nextChange} lang={lang} />
          </div>
        )}
      </div>
    </div>
  );
});

interface HKTunnelsTollsAboutProps {
  aboutHtml: string;
}

const HKTunnelsTollsAbout = React.memo(function HKTunnelsTollsAbout({
  aboutHtml,
}: HKTunnelsTollsAboutProps): JSX.Element {
  return (
    <div
      className="markdown-body hk-below-fold-section"
      dangerouslySetInnerHTML={{ __html: aboutHtml }}
    />
  );
});

interface IosHomeScreenGuideProps {
  iosGuideHtml: string;
}

const IosHomeScreenGuide = React.memo(function IosHomeScreenGuide({
  iosGuideHtml,
}: IosHomeScreenGuideProps): JSX.Element {
  return (
    <div
      className="markdown-body hk-below-fold-section"
      dangerouslySetInnerHTML={{ __html: iosGuideHtml }}
    />
  );
});

interface IosShareButtonProps {
  t: TranslateFunction;
}

function IosShareButton({ t }: IosShareButtonProps): JSX.Element {
  return (
    <a href="#ios-app-guide">
      <div className="mx-1 mb-4 p-2 rounded-md border bg-blue-50 border-blue-100 text-blue-800 font-bold text-lg text-center">
        <img
          src="/hk-tunnels-tolls/assets/ios-share-button.png"
          alt="iOS Share Button"
          width={24}
          height={24}
          className="h-6 inline-block mr-2"
        />
        <span>{t("iosAppGuide.title")}</span>
      </div>
    </a>
  );
}

interface HKTunnelsTollsAppProps {
  t: TranslateFunction;
  lang: string;
  isAppleDevice?: boolean;
  isPWA?: boolean;
  aboutHtml: string;
  iosGuideHtml: string;
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
  const [tableVehicle, setTableVehicle] = useState<VehicleTypeIdentifier>("privateCar");
  const [sortMode, setSortMode] = useState<SortMode>(SortMode.Default);
  const [activeSortButton, setActiveSortButton] = useState<SortMode>(SortMode.Default);
  const [, startTransition] = useTransition();

  const [isClient, setIsClient] = useState<boolean>(false);
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);

  const currentTime = useHongKongClock();
  const { journeyReadings, irnSpeeds } = useLiveTrafficData();
  const holidays = useMemo(() => buildPublicHolidaySet(), []);

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
          setActiveSortButton(SortMode.Nearest);
          startTransition(() => setSortMode(SortMode.Nearest));
          setIsLoadingLocation(false);
        }
      },
      () => {
        if (awaitingFirstFixRef.current) {
          awaitingFirstFixRef.current = false;
          setActiveSortButton(SortMode.Default);
          startTransition(() => setSortMode(SortMode.Default));
          setIsLoadingLocation(false);
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 30000 },
    );
  }, [stopLocationWatch]);

  useEffect(() => {
    setIsClient(true);
    const searchParams = new URLSearchParams(window.location.search);
    const v = searchParams.get("vehicle") ?? window.localStorage.getItem("hk-tunnel-vehicle");
    if (v && isValidVehicle(v)) {
      setSelectedVehicle(v);
      setTableVehicle(v);
    }
  }, []);

  useEffect(() => {
    if (window.localStorage.getItem("hk-tunnel-sort") !== "nearest") return;
    const cached = readStoredCoords();
    if (!cached) return;
    setUserCoords(cached);
    setActiveSortButton(SortMode.Nearest);
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

  const handleSelectVehicle = useCallback((vehicle: VehicleTypeIdentifier) => {
    setSelectedVehicle(vehicle);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("hk-tunnel-vehicle", vehicle);
    }
    startTransition(() => {
      setTableVehicle(vehicle);
    });
  }, []);

  const handleDefaultSort = useCallback(() => {
    setActiveSortButton(SortMode.Default);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("hk-tunnel-sort", "default");
    }
    startTransition(() => {
      setSortMode(SortMode.Default);
    });
  }, []);

  const requestNearestSort = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("hk-tunnel-sort", "nearest");
    }
    if (userCoords) {
      setActiveSortButton(SortMode.Nearest);
      startTransition(() => {
        setSortMode(SortMode.Nearest);
      });
      startLocationWatch();
      return;
    }
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    setIsLoadingLocation(true);
    awaitingFirstFixRef.current = true;
    startLocationWatch();
  }, [userCoords, startLocationWatch]);

  const isPublicHoliday = useMemo(() => {
    if (!currentTime) return false;
    return holidays.has(getHongKongDate(currentTime).dateString);
  }, [currentTime, holidays]);

  const groupedTunnels = useMemo(() => {
    const sortByDistance = sortMode === SortMode.Nearest && userCoords !== null;
    return TUNNEL_GROUPS.map((group) => {
      const tunnels: GroupedTunnel[] = Object.keys(registryInfo.tunnels)
        .filter((key): key is HKTunnelIdentifier => isValidTunnel(key) && registryInfo.tunnels[key].category === group.category)
        .map((key) => ({
          key,
          distanceKm: sortByDistance && userCoords ? nearestEntranceKm(registryInfo.tunnels[key].entrances, userCoords) : null,
        }));
      if (sortByDistance) {
        tunnels.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
      }
      return { ...group, tunnels };
    });
  }, [sortMode, userCoords]);

  const timeVaryingTunnelKeys = useMemo(
    () =>
      Object.keys(tollData.tunnels).filter(
        (key): key is HKTunnelIdentifier => isValidTunnel(key) && "timeVaryingTolls" in tollData.tunnels[key],
      ),
    [],
  );

  const vehicleName = resolveLocalizedString(registryInfo.vehicleTypes[selectedVehicle].name, t);
  const vehicleDescription = registryInfo.vehicleTypes[selectedVehicle].description;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4">
      {/* Header */}
      <h1 className="text-center my-3 md:m-4 text-3xl md:text-4xl font-bold md:p-2">{t("pageHeading")}</h1>
      {isAppleDevice && !isPWA && <IosShareButton t={t} />}

      {/* Selection Controls */}
      <VehicleSelector t={t} selectedVehicle={selectedVehicle} onSelectVehicle={handleSelectVehicle} />

      {/* Current Toll Display (Harbour Tunnels -> In-Article Ad -> Other Tunnels) */}
      {groupedTunnels.map((group, groupIndex) => {
        const tunnels = group.tunnels;
        if (tunnels.length === 0) return null;
        return (
          <div key={group.category}>
            {/* Stable id so the card can be listed as an Auto ads "excluded area" in AdSense */}
            <div className="card-base-min mb-4" id={`tunnels-${group.category}`}>
              {groupIndex === 0 && (
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h2 className="text-lg md:text-lg font-semibold">
                    {t("currentToll")} - {vehicleName}{" "}
                    {vehicleDescription ? `(${resolveLocalizedString(vehicleDescription, t)})` : ""}
                  </h2>
                  <ButtonGroup>
                    <Button
                      color={activeSortButton === SortMode.Default ? "primary" : "default"}
                      onPress={handleDefaultSort}
                      className="text-base md:text-base"
                    >
                      {t("sortDefault")}
                    </Button>
                    <Button
                      color={activeSortButton === SortMode.Nearest || isLoadingLocation ? "primary" : "default"}
                      className={`text-base md:text-base ${userCoords || isLoadingLocation ? "" : "hk-tunnel-glow"}`}
                      onPress={requestNearestSort}
                      isLoading={isLoadingLocation}
                    >
                      {t("sortNearest")}
                    </Button>
                  </ButtonGroup>
                </div>
              )}
              <div className="border-b border-black/20 dark:border-white/20 pb-1 mb-2">
                <span className="text-xl md:text-lg font-bold">{t(group.labelId)}</span>
              </div>
              <div className="space-y-2">
                {tunnels.map(({ key }) => (
                  <HKTollCard
                    key={key}
                    tunnelKey={key}
                    nextChange={
                      isClient ? getNextTollChange(selectedVehicle, key, currentTime, isPublicHoliday, holidays) : null
                    }
                    vehicle={selectedVehicle}
                    currentDate={currentTime}
                    isPublicHoliday={isPublicHoliday}
                    isClient={isClient}
                    journeyReadings={journeyReadings}
                    irnSpeeds={irnSpeeds}
                    sortMode={sortMode}
                    userCoords={userCoords}
                    lang={lang}
                    t={t}
                  />
                ))}
              </div>
            </div>
            {groupIndex === 0 && <InArticleAdUnit />}
          </div>
        );
      })}

      {/* Individual Tunnel Tables */}
      {timeVaryingTunnelKeys.map((key) => (
        <TunnelTable key={key} tunnelKey={key} selectedVehicle={tableVehicle} lang={lang} t={t} />
      ))}
      <FixedTunnelsTable t={t} lang={lang} currentTime={currentTime} />
      <FreeTunnelsTable lang={lang} />
      <FaqSection lang={lang} />

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

export interface HKTunnelsTollsScreenProps extends LocaleProps {
  aboutHtml: string;
  iosGuideHtml: string;
}

interface LegacyNavigator extends Navigator {
  standalone?: boolean;
}

interface LegacyWindow extends Window {
  opera?: string;
}

export default function Page({
  texts,
  lang,
  localizedRoutes,
  aboutHtml,
  iosGuideHtml,
}: HKTunnelsTollsScreenProps): JSX.Element {
  const t = createTranslateFunction(texts);
  const isZh = lang === "zh";
  const hreflang = getHreflang(lang, localizedRoutes, true);
  const enPath = getHubPagePath("en");
  const zhPath = getHubPagePath("zh");
  const canonicalUrl = `${SITE_URL}${isZh ? zhPath : enPath}`;

  const sameAsLinks = [GITHUB_REPO_URL];

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("pageHeading"),
    description: t("pageDescription"),
    url: canonicalUrl,
    inLanguage: isZh ? "zh-HK" : "en",
    image: getOgImageUrl(lang),
    isAccessibleForFree: true,
    applicationCategory: "TravelApplication",
    operatingSystem: "All",
    author: {
      "@type": "Person",
      name: "Jayly",
      url: SITE_URL,
    },
    featureList: isZh
      ? [
          "三隧分流（西區海底隧道、紅磡海底隧道、東區海底隧道）不同時段不同收費即時計算",
          "大欖隧道分時段收費及下次轉價倒數提示",
          "運輸署實時過海行車時間及車龍狀態",
          "全港 10 條收費隧道及 8 條免費政府隧道完整收費時間表",
        ]
      : [
          "Live time-varying toll calculator for WHC, CHT, EHC, and Tai Lam Tunnel",
          "Next toll rate change countdown indicator",
          "Real-time Transport Department XML journey times and traffic status",
          "Complete schedules for all 10 tolled tunnels and 8 free government tunnels",
        ],
    sameAs: sameAsLinks,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "HKD",
    },
  };

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
        item: canonicalUrl,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HUB_FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: isZh ? item.question.zh : item.question.en,
      acceptedAnswer: {
        "@type": "Answer",
        text: isZh ? item.answer.zh : item.answer.en,
      },
    })),
  };

  const [isAppleDevice, setIsAppleDevice] = useState<boolean>(false);
  const [isPWA, setIsPWA] = useState<boolean>(false);

  useEffect(() => {
    const win = window as LegacyWindow;
    const nav = navigator as LegacyNavigator;
    const userAgent = nav.userAgent || nav.vendor || win.opera || "";
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !("MSStream" in window);
    const isMac = /Mac/.test(userAgent);
    setIsAppleDevice(isIOS || isMac);
    setIsPWA(Boolean(nav.standalone));
  }, []);

  return (
    <>
      <Head>
        <title>{t("pageTitle")}</title>
        <meta name="description" content={t("pageDescription")} />
        <link rel="canonical" href={canonicalUrl} />
        <HreflangLinks enPath={enPath} zhPath={zhPath} />
        <meta property="og:title" content={t("pageTitle")} />
        <meta property="og:description" content={t("pageDescription")} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="JaylyMC" />
        <meta property="og:image" content={getOgImageUrl(lang)} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={hreflang} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("pageTitle")} />
        <meta name="twitter:description" content={t("pageDescription")} />
        <meta name="twitter:image" content={getOgImageUrl(lang)} />
        <link rel="manifest" href={t("pwa.url")} crossOrigin="use-credentials" />
        <meta name="apple-mobile-web-app-title" content={t("appTitle")} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/hk-tunnels-tolls/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema).replace(/</g, "\\u003c") }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }}
        />
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
