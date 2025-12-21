import { getStaticLocaleProps, LocaleProps } from "@/locale/i18n";
import StartFromTemplate from "@/screens/bedrock-experiments/start-from-template";
import { GetStaticProps } from "next";

export default function Page({ texts }: LocaleProps) {
  return <StartFromTemplate texts={texts} />;
}

export const getStaticProps: GetStaticProps<LocaleProps> = async () => {
  // TODO: Load translations
  const fs = await import("fs/promises");
  const path = await import("path");
  return {
    props: await getStaticLocaleProps("en", "bedrockExperiments", fs, path),
  };
};
