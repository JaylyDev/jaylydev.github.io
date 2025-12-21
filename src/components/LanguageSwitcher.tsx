import { useEffect, useState } from "react";
import languages from "../locale/languages.json";
import { RouteLanguageInfo, STORAGE_KEY, SUPPORTED_LOCALES } from "../locale/i18n";
import { useRouter } from "next/router";

export interface LanguageSwitcherProps {
  currentLocale: string;
  localizedRoutes?: RouteLanguageInfo[];
}

function getBannerMessage(preferredLanguage: string, section: string): string | undefined {
  const key = `i18n.${section}.${preferredLanguage}`;
  return languages.texts[key as keyof typeof languages.texts];
}

/**
 * Detect the locale from browser preferences
 */
export function detectBrowserLanguage(): string {
  if (typeof window === "undefined") {
    return "en";
  }

  // Get browser languages (ordered by preference)
  const browserLanguages = navigator.languages || [navigator.language];
  const mappings = languages.mappings as Record<string, string>;

  for (const browserLang of browserLanguages) {
    const normalized = browserLang.toLowerCase().replace(/_/g, "-");

    if (mappings[normalized]) {
      return mappings[normalized];
    }

    const baseLang = normalized.split("-")[0];
    if (mappings[baseLang]) {
      return mappings[baseLang];
    }
  }

  return "en";
}

export function getLocaleFromPath(path: string): string {
  for (const locale of SUPPORTED_LOCALES) {
    if (path === `/${locale}` || path.startsWith(`/${locale}/`)) {
      return locale;
    }
  }
  return "en";
}

export function useLanguageSync(): void {
  // Detects browser language on first visit if no stored preference
  useEffect(() => {
    const storedLanguage = localStorage.getItem(STORAGE_KEY);

    if (!storedLanguage || !Object.keys(languages.language_names).includes(storedLanguage)) {
      // First visit: detect browser language and store it
      const detectedLanguage = detectBrowserLanguage();
      console.log(`Detected browser language: ${detectedLanguage}`);
      localStorage.setItem(STORAGE_KEY, detectedLanguage);
    }
  }, []);
}

/**
 * Add disclaimer banner for language switching
 * Should be used on pages that have multiple language versions available
 * @param localizedRoutes - List of available language routes for current page
 * @param currentLocale - Current page locale
 */
export function LanguageSwitcher({ currentLocale, localizedRoutes }: LanguageSwitcherProps): JSX.Element | null {
  const [message, setMessage] = useState<string | undefined>();
  const [switchButtonText, setSwitchButtonText] = useState<string | undefined>();
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [targetPath, setTargetPath] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Only proceed if we have available languages
    if (!localizedRoutes || localizedRoutes.length <= 1) {
      return;
    }

    const storedLanguage = localStorage.getItem(STORAGE_KEY);

    // If no stored preference, detect and store
    if (!storedLanguage || !Object.keys(languages.language_names).includes(storedLanguage)) {
      const detectedLanguage = detectBrowserLanguage();
      localStorage.setItem(STORAGE_KEY, detectedLanguage);
    }

    const preferredLanguage = storedLanguage || detectBrowserLanguage();

    // Only redirect if preferred language is different from current locale / available for this page
    if (preferredLanguage !== currentLocale) {
      const targetRoute = localizedRoutes.find((route) => route.lang === preferredLanguage);

      if (targetRoute && currentLocale !== preferredLanguage) {
        const msg = getBannerMessage(preferredLanguage, "notice");
        const btnText = getBannerMessage(preferredLanguage, "switchButton");
        setMessage(msg);
        setSwitchButtonText(btnText);
        setTargetPath(targetRoute.path);
        setShowBanner(!!msg && !!btnText);
      }
    }
  }, [localizedRoutes, currentLocale]);

  return showBanner ? (
    <div className="language-notice flex items-center justify-between gap-2 px-6 py-2 md:px-12">
      <p>{message}</p>
      <div className="grid grid-flow-col">
        <button className="switch-button bg-white min-w-16" onClick={() => router.push(targetPath)}>
          {switchButtonText}
        </button>
        <button
          onClick={() => {
            setShowBanner(false);
            localStorage.setItem(STORAGE_KEY, currentLocale);
          }}
        >
          &#10005;
        </button>
      </div>
    </div>
  ) : null;
}

/**
 * Hook to get the current language preference
 * Returns the stored language, detected language, or default
 */
export function useLanguagePreference(): string {
  if (typeof window === "undefined") {
    return "en";
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_LOCALES.includes(stored)) {
    return stored;
  }

  return detectBrowserLanguage();
}
