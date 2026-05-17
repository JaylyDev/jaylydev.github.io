import Donation from "@/screens/donate";
import { getStaticLocaleProps, LocaleProps } from "@/locale/i18n";
import { GetStaticProps } from "next";

export default function DonationPage({ texts, lang, localizedRoutes }: LocaleProps) {
  return <Donation texts={texts} lang={lang} localizedRoutes={localizedRoutes} />;
}

export const getStaticProps: GetStaticProps<LocaleProps> = async () => {
  // Load translations
  const fs = await import("fs/promises");
  const path = await import("path");
  return {
    props: await getStaticLocaleProps("en", "donate", fs, path, "/donate/"),
  };
};
