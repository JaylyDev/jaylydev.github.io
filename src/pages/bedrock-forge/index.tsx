import { getStaticLocaleProps, LocaleProps } from "@/locale/i18n";
import BedrockForgeApp from "@/screens/bedrock-forge";
import { GetStaticProps } from "next";

export default function Page({ texts }: LocaleProps) {
  return <BedrockForgeApp texts={texts} />;
}

export const getStaticProps: GetStaticProps<LocaleProps> = async () => {
  const fs = await import("fs/promises");
  const path = await import("path");
  return {
    props: await getStaticLocaleProps("en", "beforge", fs, path),
  };
};
