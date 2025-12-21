import { GetStaticPaths, GetStaticProps } from "next";
import Home, { HomeProps } from "@/screens";
import { getStaticLocaleProps, LocaleProps, SUPPORTED_LOCALES } from "@/locale/i18n";
import { getPublicPosts } from "@/utilities/getPublicPosts";

export default function HomePage({ posts, lang, texts, localizedRoutes }: HomeProps & LocaleProps) {
  return <Home posts={posts} texts={texts} lang={lang} localizedRoutes={localizedRoutes} />;
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

export const getStaticProps: GetStaticProps<HomeProps & LocaleProps> = async ({ params }) => {
  const locale = params?.locale as string;
  const fs = await import("fs/promises");
  const path = await import("path");

  if (!SUPPORTED_LOCALES.includes(locale)) {
    return {
      notFound: true,
    };
  }

  const currentPath = `/${locale}/`;
  const props = Object.assign(await getStaticLocaleProps(locale, "home", fs, path, currentPath), {
    posts: getPublicPosts(),
  });

  // Override HTML lang attribute for specific locales
  if (locale === "zh") {
    props.hreflang = "zh-Hant";
  }

  return {
    props,
  };
};
