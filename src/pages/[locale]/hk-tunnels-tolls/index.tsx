import { GetStaticPaths, GetStaticProps } from "next";
import HKTunnelsTolls from "@/screens/hk-tunnels-tolls";
import { getStaticLocaleProps, LocaleProps, SUPPORTED_LOCALES } from "@/locale/i18n";

export default function Page({ texts, lang, localizedRoutes }: LocaleProps) {
  return <HKTunnelsTolls texts={texts} lang={lang} localizedRoutes={localizedRoutes} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = SUPPORTED_LOCALES.map((locale) => ({
    params: { locale },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<LocaleProps> = async ({ params }) => {
  const locale = params?.locale as string;
  const fs = await import("fs/promises");
  const path = await import("path");

  if (!SUPPORTED_LOCALES.includes(locale)) {
    return {
      notFound: true,
    };
  }

  const currentPath = locale === "en" ? "/en/hk-tunnels-tolls/" : `/${locale}/hk-tunnels-tolls/`;
  const props = await getStaticLocaleProps(locale, "hkTunnelsTolls", fs, path, currentPath);

  // set hreflang to be more region specific.
  if (locale === "zh") {
    props.hreflang = "zh-HK";
  }

  return {
    props,
  };
};
