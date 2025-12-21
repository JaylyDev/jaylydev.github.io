import { getStaticLocaleProps, LocaleProps } from "@/locale/i18n";
import BedrockExperimentsEditor from "@/screens/bedrock-experiments";
import { GetStaticProps } from "next";

export default function Page({ texts }: LocaleProps) {
  return <BedrockExperimentsEditor texts={texts} />;
}

export const getStaticProps: GetStaticProps<LocaleProps> = async () => {
  // TODO: Load translations
  const fs = await import("fs/promises");
  const path = await import("path");
  return {
    props: await getStaticLocaleProps("en", "bedrockExperiments", fs, path),
  };
};
