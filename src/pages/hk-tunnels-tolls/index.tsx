import { getStaticLocaleProps, LocaleProps } from "@/locale/i18n";
import HKTunnelsTolls from "@/screens/hk-tunnels-tolls";
import { GetStaticProps } from "next";
import * as path from "path";
import * as fs from "fs/promises";
import { parseMarkdown } from "@/utilities/markdown";

interface PageProps extends LocaleProps {
  aboutHtml: string;
  iosGuideHtml: string;
}

export default function Page({ texts, lang, localizedRoutes, aboutHtml, iosGuideHtml }: PageProps) {
  return (
    <HKTunnelsTolls
      texts={texts}
      lang={lang}
      localizedRoutes={localizedRoutes}
      aboutHtml={aboutHtml}
      iosGuideHtml={iosGuideHtml}
    />
  );
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const localeProps = await getStaticLocaleProps("en", "hkTunnelsTolls", fs, path, "/hk-tunnels-tolls/");

  const aboutPath = path.join(process.cwd(), "src/screens/hk-tunnels-tolls/docs/about/en.md");
  const aboutContent = await fs.readFile(aboutPath, "utf8");
  const aboutHtml = await parseMarkdown(aboutContent);

  const iosGuidePath = path.join(process.cwd(), "src/screens/hk-tunnels-tolls/docs/ios-guide/en.md");
  const iosGuideContent = await fs.readFile(iosGuidePath, "utf8");
  const iosGuideHtml = await parseMarkdown(iosGuideContent);

  return {
    props: {
      ...localeProps,
      aboutHtml,
      iosGuideHtml,
    },
  };
};
