import { getStaticLocaleProps, LocaleProps } from "@/locale/i18n";
import HKTunnelsTolls from "@/screens/hk-tunnels-tolls";
import { GetStaticProps } from "next";

export default function Page({ texts, lang, localizedRoutes }: LocaleProps) {
  return <HKTunnelsTolls texts={texts} lang={lang} localizedRoutes={localizedRoutes} />;
}

export const getStaticProps: GetStaticProps<LocaleProps> = async () => {
  const fs = await import("fs/promises");
  const path = await import("path");
  const props = await getStaticLocaleProps("en", "hkTunnelsTolls", fs, path, "/hk-tunnels-tolls/");

  return {
    props,
  };
};
