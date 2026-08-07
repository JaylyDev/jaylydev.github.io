import { getStaticLocaleProps, LocaleProps } from "@/locale/i18n";
import ManifestGeneratorScreen from "@/screens/manifest-generator";
import { GetStaticProps } from "next";
import * as path from "path";
import * as fs from "fs/promises";
import { parseMarkdown } from "@/utilities/markdown";

interface PageProps extends LocaleProps {
  guideHtml: string;
}

export default function Page({ texts, lang, localizedRoutes, guideHtml }: PageProps) {
  return <ManifestGeneratorScreen texts={texts} lang={lang} localizedRoutes={localizedRoutes} guideHtml={guideHtml} />;
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const localeProps = await getStaticLocaleProps("en", "manifestGenerator", fs, path, "/manifest-generator/");

  const readmePath = path.join(process.cwd(), "src/screens/manifest-generator/README.md");
  const readmeContent = await fs.readFile(readmePath, "utf8");
  const guideHtml = await parseMarkdown(readmeContent, true);

  return {
    props: {
      ...localeProps,
      guideHtml,
    },
  };
};
