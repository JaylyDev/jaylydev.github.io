import { SponsorSection } from "@/components/SponsorWidgets";
import { LocaleProps, createTranslateFunction, getStaticLocaleProps } from "@/locale/i18n";
import { GetStaticProps } from "next";

export default function Page({ texts }: LocaleProps) {
  const t = createTranslateFunction(texts);
  return <SponsorSection t={t} paddingSize={"0.75rem"} />;
}

export const getStaticProps: GetStaticProps<LocaleProps> = async () => {
  // Load translations
  const fs = await import("fs/promises");
  const path = await import("path");
  return {
    props: await getStaticLocaleProps("en", "global", fs, path),
  };
};
