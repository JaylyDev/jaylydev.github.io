import { useState } from "react";
import { TranslateFunction, RouteLanguageInfo as LocalizedRouteInfo } from "@/locale/i18n";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { LanguageSelector } from "./LanguageSelector";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SponsorSection } from "./SponsorWidgets";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const localePrefix = lang && lang !== "en" ? `/${lang}` : "";

  return (
    <>
      <header className="header">
        <div className="flex items-center justify-between py-2 px-4 md:py-3 md:px-8">
          <Link href={`${localePrefix}/`} className="flex flex-none select-none items-center h-12 w-12">
            <Image src={icon || "/icon.png"} alt="Jayly Logo" width={48} height={48} priority />
          </Link>

          {/* Subheadings */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center">
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
          </nav>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="md:hidden inline-flex items-center justify-center rounded-md border border-gray-300 px-2.5 py-1.5 text-sm font-medium text-gray-700"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav
            aria-label="Mobile navigation"
            className="md:hidden border-t border-gray-200 px-4 py-2 flex flex-wrap gap-x-4 gap-y-2 bg-white"
          >
            <Link
              href={`${localePrefix}/#home`}
              className="text-base text-gray-700 py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("header.home")}
            </Link>
            <Link
              href={`${localePrefix}/#projects`}
              className="text-base text-gray-700 py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("header.projects")}
            </Link>
            <Link
              href={`${localePrefix}/#posts`}
              className="text-base text-gray-700 py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("header.posts")}
            </Link>
            <Link
              href={`${localePrefix}/#about`}
              className="text-base text-gray-700 py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("header.about")}
            </Link>
          </nav>
        )}
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
      <footer className="flex flex-wrap flex-row justify-center items-center text-sm text-gray-500 p-4 gap-3">
        <span>{"© JaylyMC " + (year || "2026")}</span>
        <Link href="/privacy-policy/">{t("footer.privacyPolicy")}</Link>
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
          strategy="lazyOnload"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2533146760921020"
          crossOrigin="anonymous"
        />
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
