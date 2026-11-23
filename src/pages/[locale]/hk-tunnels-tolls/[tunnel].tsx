import { GetStaticPaths, GetStaticProps } from "next";
import * as fs from "fs/promises";
import * as path from "path";
import { getStaticLocaleProps, SUPPORTED_LOCALES } from "@/locale/i18n";
import TunnelDetailScreen, { TunnelDetailScreenProps } from "@/screens/hk-tunnels-tolls/tunnel-detail";
import { getTunnelPagePath, TUNNEL_DETAIL_BY_SLUG, TUNNEL_DETAILS } from "@/screens/hk-tunnels-tolls/tunnelData";

export default function Page(props: TunnelDetailScreenProps) {
  return <TunnelDetailScreen {...props} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = SUPPORTED_LOCALES.flatMap((locale) =>
    TUNNEL_DETAILS.map((tunnel) => ({
      params: { locale, tunnel: tunnel.slug },
    })),
  );

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<TunnelDetailScreenProps> = async ({ params }) => {
  const locale = typeof params?.locale === "string" ? params.locale : "";
  const tunnelSlug = typeof params?.tunnel === "string" ? params.tunnel : "";

  if (!SUPPORTED_LOCALES.includes(locale) || !TUNNEL_DETAIL_BY_SLUG[tunnelSlug]) {
    return { notFound: true };
  }

  const currentPath = locale === "en" ? `/en/hk-tunnels-tolls/${tunnelSlug}/` : getTunnelPagePath(tunnelSlug, locale);
  const localeProps = await getStaticLocaleProps(locale, "hkTunnelsTolls", fs, path, currentPath);

  if (locale === "zh") {
    localeProps.hreflang = "zh-HK";
  }

  localeProps.localizedRoutes = [
    { lang: "zh", hreflang: "zh-HK", path: getTunnelPagePath(tunnelSlug, "zh") },
    { lang: "en", path: getTunnelPagePath(tunnelSlug, "en") },
  ];

  return {
    props: {
      ...localeProps,
      tunnelSlug,
    },
  };
};
