import locales from "./languages.json";
import routesConfig from "./routes.json";

/**
 * Usage:
 * `t("key", "arg1", "arg2", ...)`
 * Replaces $1, $2, ... in the translation string with arg1, arg2, ...
 */
export type TranslateFunction = (key: string, ...args: string[]) => string;

export interface TranslateProps {
  t: TranslateFunction;
}

export interface Translations {
  [screenId: string]: Record<string, string>;
}

export interface LocaleLabels {
  [key: string]: string;
}

export interface LocaleTexts {
  screen: Record<string, string>;
  global: Record<string, string>;
  enScreen: Record<string, string>;
  enGlobal: Record<string, string>;
}

// Props passed to screens
export interface ScreenLocaleProps {
  texts: LocaleTexts;
  lang?: string;
  localizedRoutes?: RouteLanguageInfo[];
}

// Route information for available languages
export interface RouteLanguageInfo {
  lang: string;
  path: string;
  hreflang?: string;
}

// Props passed to pages for getStaticProps
export interface LocaleProps extends ScreenLocaleProps {
  lang: string;
  hreflang?: string;
  localizedRoutes?: RouteLanguageInfo[];
}

export const SUPPORTED_LOCALES = Object.keys(
  locales.language_names
) as string[];

/**
 * Get href lang value from routes.json for a page
 * for setting hreflang.
 */
export function getHreflang(
  lang: string | undefined,
  localizedRoutes?: RouteLanguageInfo[],
  useOpenGraph = false
): string {
  if (!localizedRoutes || !lang) return lang ?? "en";

  const targetRoute = localizedRoutes.find((route) => route.lang === lang);
  const hreflang = targetRoute?.hreflang ?? lang;
  if (useOpenGraph) return hreflang.replace("-", "_");
  else return hreflang;
}

/**
 * Get available languages for a given route path
 * Matches the path against routes in routes.json
 */
export const getlocalizedRoutesForPath = (
  currentPath: string
): RouteLanguageInfo[] | null => {
  for (const route of routesConfig.routes) {
    for (const pathInfo of route.paths) {
      if (pathInfo.path === currentPath) {
        return route.paths;
      }
    }
  }

  return null;
};

// Translate function with fallback logic and placeholder replacement
export const translate = (
  texts: LocaleTexts,
  key: string,
  ...args: string[]
): string => {
  let result: string;

  // Get translation
  if (texts.screen[key] !== undefined) {
    result = texts.screen[key];
  } else if (texts.global[key] !== undefined) {
    result = texts.global[key];
  } else if (texts.enScreen[key] !== undefined) {
    result = texts.enScreen[key];
  } else if (texts.enGlobal[key] !== undefined) {
    result = texts.enGlobal[key];
  } else {
    result = key;
  }

  // Replace $1, $2, $3, etc. with the provided arguments
  args.forEach((arg, index) => {
    result = result.replace(new RegExp(`\\$${index + 1}`, "g"), arg);
  });

  return result;
};

// Create a bound translate function for a specific texts object
export const createTranslateFunction = (
  texts: LocaleTexts
): TranslateFunction => {
  return (key: string, ...args: string[]) => translate(texts, key, ...args);
};

// Only use in getStaticProps functions
export const getStaticLocaleProps = async (
  lang: string,
  screenId: string,
  fs: typeof import("fs/promises"),
  path: typeof import("path"),
  currentPath?: string
): Promise<LocaleProps> => {
  // Load locale translations
  const translationsPath = path.join(
    process.cwd(),
    "src/locale/locales",
    `${lang}.json`
  );
  const translationsContent = await fs.readFile(translationsPath, "utf-8");
  const translations: Translations = JSON.parse(translationsContent);

  // Load English translations for fallback
  const enTranslationsPath = path.join(
    process.cwd(),
    "src/locale/locales",
    `en.json`
  );
  const enTranslationsContent = await fs.readFile(enTranslationsPath, "utf-8");
  const enTranslations: Translations = JSON.parse(enTranslationsContent);
  const props: LocaleProps = {
    lang,
    texts: {
      screen: translations[screenId] || {},
      global: translations["global"] || {},
      enScreen: enTranslations[screenId] || {},
      enGlobal: enTranslations["global"] || {},
    },
  };

  if (currentPath) {
    const localizedRoutes = getlocalizedRoutesForPath(currentPath);
    if (localizedRoutes) {
      props.localizedRoutes = localizedRoutes;
    }
  }

  return props;
};

export const STORAGE_KEY = "appLanguage";
