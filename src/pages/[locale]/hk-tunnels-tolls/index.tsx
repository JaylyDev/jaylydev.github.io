import { GetStaticPaths, GetStaticProps } from "next";
import HKTunnelsTolls from "@/screens/hk-tunnels-tolls";
import { getStaticLocaleProps, LocaleProps, SUPPORTED_LOCALES } from "@/locale/i18n";
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

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = SUPPORTED_LOCALES.map((locale) => ({
    params: { locale },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const locale = params?.locale as string;

  if (!SUPPORTED_LOCALES.includes(locale)) {
    return {
      notFound: true,
    };
  }

  const currentPath = locale === "en" ? "/en/hk-tunnels-tolls/" : `/${locale}/hk-tunnels-tolls/`;
  const props = await getStaticLocaleProps(locale, "hkTunnelsTolls", fs, path, currentPath);

  // set hreflang to be more region specific.
  if (locale === "zh") {
    props.hreflang = "zh-HK";
  }

  const docFileName = locale === "zh" || props.hreflang === "zh-HK" ? "zh-HK.md" : "en.md";
  const aboutPath = path.join(process.cwd(), "src/screens/hk-tunnels-tolls/docs/about", docFileName);
  const aboutContent = await fs.readFile(aboutPath, "utf8");
  const aboutHtml = await parseMarkdown(aboutContent);

  const iosGuidePath = path.join(process.cwd(), "src/screens/hk-tunnels-tolls/docs/ios-guide", docFileName);
  const iosGuideContent = await fs.readFile(iosGuidePath, "utf8");
  const iosGuideHtml = await parseMarkdown(iosGuideContent);

  return {
    props: {
      ...props,
      aboutHtml,
      iosGuideHtml,
    },
  };
};
