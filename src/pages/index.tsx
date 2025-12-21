import Home, { HomeProps } from "@/screens";
import { getStaticLocaleProps, LocaleProps } from "@/locale/i18n";
import { getPublicPosts } from "@/utilities/getPublicPosts";
import { GetStaticProps } from "next";

export default function HomePage({ posts, texts, lang, localizedRoutes }: LocaleProps & HomeProps) {
  return <Home posts={posts} texts={texts} lang={lang} localizedRoutes={localizedRoutes} />;
}

export const getStaticProps: GetStaticProps<HomeProps & LocaleProps> = async () => {
  // Load translations
  const fs = await import("fs/promises");
  const path = await import("path");
  return {
    props: Object.assign(await getStaticLocaleProps("en", "home", fs, path, "/"), { posts: getPublicPosts() }),
  };
};
