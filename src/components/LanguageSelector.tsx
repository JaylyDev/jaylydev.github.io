import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { RouteLanguageInfo, STORAGE_KEY } from "@/locale/i18n";
import languages from "@/locale/languages.json";

interface LanguageSelectorProps {
  localizedRoutes: RouteLanguageInfo[];
  currentLocale: string;
}

export function LanguageSelector({ localizedRoutes, currentLocale }: LanguageSelectorProps) {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState(currentLocale);

  // Update state when current locale changes
  useEffect(() => {
    setSelectedLang(currentLocale);
  }, [currentLocale]);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = event.target.value;

    // Update localStorage
    localStorage.setItem(STORAGE_KEY, newLang);
    setSelectedLang(newLang);

    // Find the path for the selected language
    const targetRoute = localizedRoutes.find((route) => route.lang === newLang);

    if (targetRoute) {
      router.push(targetRoute.path);
    }
  };

  // Only show selector if there are multiple languages available
  if (localizedRoutes.length <= 1) {
    return null;
  }

  return (
    <div className="language-selector flex items-center gap-2">
      <nav aria-label="Language alternates" className="flex items-center gap-2">
        {localizedRoutes.map((langInfo) => {
          const label =
            languages.language_names[langInfo.lang as keyof typeof languages.language_names] ||
            langInfo.lang.toUpperCase();
          if (langInfo.lang === currentLocale) {
            return (
              <span key={langInfo.lang} className="font-semibold text-gray-700 dark:text-gray-200">
                {label}
              </span>
            );
          }
          return (
            <Link
              key={langInfo.lang}
              href={langInfo.path}
              hrefLang={langInfo.hreflang || langInfo.lang}
              onClick={() => localStorage.setItem(STORAGE_KEY, langInfo.lang)}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <select
        value={selectedLang}
        onChange={handleLanguageChange}
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
        aria-label="Select language"
      >
        {localizedRoutes.map((langInfo) => (
          <option key={langInfo.lang} value={langInfo.lang}>
            {languages.language_names[langInfo.lang as keyof typeof languages.language_names] ||
              langInfo.lang.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
