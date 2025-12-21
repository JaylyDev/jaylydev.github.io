import { getStaticLocaleProps, LocaleProps } from "@/locale/i18n";
import MathSymbols from "@/screens/math-symbols";
import { GetStaticProps } from "next";

export default function Page({ texts }: LocaleProps) {
  return <MathSymbols texts={texts} />;
}

export const getStaticProps: GetStaticProps<LocaleProps> = async () => {
  // TODO: Load translations
  const fs = await import("fs/promises");
  const path = await import("path");
  return {
    props: await getStaticLocaleProps("en", "mathSymbols", fs, path),
  };
};
