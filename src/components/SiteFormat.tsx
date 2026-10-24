import { TranslateFunction, RouteLanguageInfo as LocalizedRouteInfo } from "@/locale/i18n";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { LanguageSelector } from "./LanguageSelector";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SponsorSection, SponsorWidget } from "./SponsorWidgets";

export interface ISubheadingParams {
  id: string;
  title: string;
}

export interface ISiteGlobalParams {
  icon?: string;
  t: TranslateFunction;
  localizedRoutes?: LocalizedRouteInfo[];
  lang?: string;
}

export interface ISiteFooterParams extends ISiteGlobalParams {
  showKofi?: boolean;
}

export interface IStatsCollectionParams {
  disableGoogleAds?: boolean;
  disableAnalytics?: boolean;
}

export function SiteHeader({ icon, t, lang = "en", localizedRoutes }: ISiteGlobalParams) {
  const localePrefix = lang && lang !== "en" ? `/${lang}` : "";

  return (
    <>
      <header className="header">
        <div className="relative flex min-h-15 items-center justify-between py-1.5 px-6 md:hidden">
          <Link rel="apple-touch-icon" href={`${localePrefix}/`}>
            <img src={icon || "/icon.png"} alt={"Jayly Logo"} width={50} height={50}></img>
          </Link>
        </div>
        <div className="hidden md:block py-2 px-6">
          <div className="mt-0 flex items-center justify-between pt-0">
            <div aria-label="Logo" className="block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="ml-4 order-2">
              <Link
                rel="apple-touch-icon"
                href={`${localePrefix}/`}
                className="flex flex-none select-none items-center h-12 w-12"
              >
                <div className="relative m-auto inline-block">
                  <img src={icon || "/icon.png"} alt={"Jayly Logo"} width={150} height={150}></img>
                  <div className="absolute right-0 top-0 -mr-2.5 -mt-1.5"></div>
                </div>
              </Link>
            </div>
            {/* Subheadings */}
            <div className="ml-4 block order-3">
              <Link href={`${localePrefix}/#home`} className="header-subheading">
                {t("header.home")}
              </Link>
              <Link href={`${localePrefix}/#projects`} className="header-subheading">
                {t("header.projects")}
              </Link>
              <Link href={`${localePrefix}/#posts`} className="header-subheading">
                {t("header.posts")}
              </Link>
              <Link href={`${localePrefix}/#about`} className="header-subheading">
                {t("header.about")}
              </Link>
            </div>
          </div>
        </div>
      </header>
      {/* non-sticky elements below */}
      <LanguageSwitcher localizedRoutes={localizedRoutes} currentLocale={lang} />
    </>
  );
}

export function SiteFooter({ t, lang = "en", localizedRoutes, showKofi = true }: ISiteFooterParams) {
  const year = new Date().getFullYear(); // Static at build time
  // Uncomment when privacy policy is localized
  // const localePrefix = locale && locale !== "en" ? `/${locale}` : "";

  return (
    <>
      {showKofi && <SponsorSection t={t} lang={lang} />}
      <footer className="flex flex-row justify-center items-center text-sm text-gray-500 p-4 gap-2">
        <span>{"© JaylyMC " + (year || "2026")}</span>
        <Link href={`/privacy-policy/`}>{t("footer.privacyPolicy")}</Link>
        {localizedRoutes && localizedRoutes.length > 1 && (
          <LanguageSelector localizedRoutes={localizedRoutes} currentLocale={lang} />
        )}
      </footer>
    </>
  );
}

export function StatsCollection({ disableGoogleAds, disableAnalytics }: IStatsCollectionParams) {
  return (
    <>
      {!disableAnalytics && <Script src="/analytics.js" strategy="afterInteractive" />}
      {!disableGoogleAds && (
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2533146760921020"
          crossOrigin="anonymous"
        ></Script>
      )}
    </>
  );
}

export function Subheading({ id, title }: ISubheadingParams) {
  return (
    <div className="flex min-h-fit flex-col items-center leading-none p-5" id={id}>
      <Link href={"#" + id}>
        <h3 className="bg-red-500 inline-block px-6 py-4 text-6xl shadow-xl relative z-10 font-bold text-black dark:text-white">
          {title}
        </h3>
      </Link>
    </div>
  );
}
