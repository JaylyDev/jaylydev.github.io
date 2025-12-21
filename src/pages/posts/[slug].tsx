import { getStaticLocaleProps, LocaleProps } from "@/locale/i18n";
import Posts, { PageProps } from "@/screens/posts/[slug]";
import { GetStaticProps, GetStaticPaths } from "next";
import * as path from "path";
import * as fs from "fs";
import { getPostData } from "@/utilities/getPublicPosts";

export default function Page({ texts, post, lang }: PageProps & LocaleProps) {
  return <Posts texts={texts} post={post} lang={lang} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const postsDirectory = path.join(process.cwd(), "posts");
  if (!fs.existsSync(postsDirectory)) {
    return { paths: [], fallback: false };
  }

  const fileNames = fs.readdirSync(postsDirectory).filter((file) => file.endsWith(".md"));

  const paths = fileNames.map((fileName) => ({
    params: { slug: fileName.replace(/\.md$/, "") },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PageProps & LocaleProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const post = await getPostData(slug);
  const fspromises = await import("fs/promises");

  if (!post) {
    return { notFound: true };
  }

  // Ensure all values are serializable (convert undefined to null)
  const serializedPost = JSON.parse(JSON.stringify(post));

  const props = await getStaticLocaleProps(post.lang, "posts", fspromises, path);

  // Override HTML lang attribute with post.lang if specified
  props.hreflang = post.hreflang;

  return {
    props: Object.assign(props, {
      post: serializedPost,
    }),
  };
};
