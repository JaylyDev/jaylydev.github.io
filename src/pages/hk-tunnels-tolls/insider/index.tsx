import { getStaticLocaleProps, LocaleProps } from "@/locale/i18n";
import HKTunnelsTollsInsider from "@/screens/hk-tunnels-tolls/insider";
import { GetStaticProps } from "next";

export default function Page({ texts }: LocaleProps) {
  return <HKTunnelsTollsInsider texts={texts} />;
}

export const getStaticProps: GetStaticProps<LocaleProps> = async () => {
  const fs = await import("fs/promises");
  const path = await import("path");
  return {
    props: await getStaticLocaleProps("zh", "hkTunnelsTolls", fs, path),
  };
};
