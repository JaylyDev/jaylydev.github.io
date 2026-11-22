import { GetStaticPaths, GetStaticProps } from "next";
import * as fs from "fs/promises";
import * as path from "path";
import { getStaticLocaleProps } from "@/locale/i18n";
import TunnelDetailScreen, { TunnelDetailScreenProps } from "@/screens/hk-tunnels-tolls/tunnel-detail";
import { getTunnelPagePath, TUNNEL_DETAIL_BY_SLUG, TUNNEL_DETAILS } from "@/screens/hk-tunnels-tolls/tunnelData";

export default function Page(props: TunnelDetailScreenProps) {
  return <TunnelDetailScreen {...props} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = TUNNEL_DETAILS.map((tunnel) => ({
    params: { tunnel: tunnel.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<TunnelDetailScreenProps> = async ({ params }) => {
  const tunnelSlug = typeof params?.tunnel === "string" ? params.tunnel : "";
  if (!TUNNEL_DETAIL_BY_SLUG[tunnelSlug]) {
    return { notFound: true };
  }

  const currentPath = getTunnelPagePath(tunnelSlug, "en");
  const localeProps = await getStaticLocaleProps("en", "hkTunnelsTolls", fs, path, currentPath);
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
