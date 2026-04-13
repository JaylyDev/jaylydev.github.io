import { TranslateFunction, RouteLanguageInfo as LocalizedRouteInfo } from "@/locale/i18n";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { LanguageSelector } from "./LanguageSelector";
import { LanguageSwitcher } from "./LanguageSwitcher";

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

export function SiteHeader({ icon, t, lang = "en", localizedRoutes }: ISiteGlobalParams) {
  const localePrefix = lang && lang !== "en" ? `/${lang}` : "";

  return (
    <>
      <header className="header">
        <div className="relative flex min-h-15 items-center justify-between py-1.5 px-6 md:hidden">
          <Link rel="apple-touch-icon" href={`${localePrefix}/`}>
            <Image src={icon || "/icon.png"} alt={"Jayly Logo"} width={50} height={25}></Image>
          </Link>
        </div>
        <div className="border-t md:border-0 hidden md:block py-5 px-6 md:py-3 md:px-8">
          <div className="md:mt-0 md:flex md:items-center md:justify-between md:pt-0">
            <div
              aria-label="Logo"
              className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            ></div>
            <div className="hidden md:ml-4 md:block order-2">
              <Link
                rel="apple-touch-icon"
                href={`${localePrefix}/`}
                className="flex flex-none select-none items-center h-12 w-12"
              >
                <div className="relative m-auto inline-block">
                  <Image src={icon || "/icon.png"} alt={"Jayly Logo"} width={150} height={50}></Image>
                  <div className="absolute right-0 top-0 -mr-2.5 -mt-1.5"></div>
                </div>
              </Link>
            </div>
            {/* Subheadings */}
            <div className="md:ml-4 md:block order-3">
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

export function SiteFooter({ t, lang = "en", localizedRoutes }: ISiteGlobalParams) {
  const year = new Date().getFullYear(); // Static at build time
  // Uncomment when privacy policy is localized
  // const localePrefix = locale && locale !== "en" ? `/${locale}` : "";

  return (
    <footer className="flex flex-row justify-center items-center text-sm text-gray-500 p-4 gap-2">
      <span>{"© JaylyMC " + (year || "2025") /* Default fallback (e.g., 2025) for server-rendered HTML */}</span>
      <Link href={`/privacy-policy/`}>{t("footer.privacyPolicy")}</Link>
      {localizedRoutes && localizedRoutes.length > 1 && (
        <LanguageSelector localizedRoutes={localizedRoutes} currentLocale={lang} />
      )}
    </footer>
  );
}

export function StatsCollection() {
  return (
    <>
      <Script src="/analytics.js" strategy="afterInteractive" />
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2533146760921020"
        crossOrigin="anonymous"
      ></Script>
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
