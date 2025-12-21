import * as path from "path";
import * as fs from "fs";
import PostDownload, { PageProps } from "@/screens/posts/[slug]/downloads";
import { getStaticLocaleProps, ScreenLocaleProps } from "@/locale/i18n";
import { GetStaticProps, GetStaticPaths } from "next";
import { getDownloadData, getPostData } from "@/utilities/getPublicPosts";

export const getStaticPaths: GetStaticPaths = async () => {
  const postsDirectory = path.join(process.cwd(), "posts");
  if (!fs.existsSync(postsDirectory)) {
    return { paths: [], fallback: false };
  }

  const fileNames = fs.readdirSync(postsDirectory).filter((file) => file.endsWith(".md"));

  const paths = fileNames
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      // Only include paths for posts that have downloads
      const downloads = getDownloadData(slug);
      if (downloads) {
        return { params: { slug } };
      }
      return null;
    })
    .filter(Boolean) as { params: { slug: string } }[];

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const post = await getPostData(slug);
  const downloads = getDownloadData(slug);

  if (!post || !downloads) {
    return { notFound: true };
  }

  // Handle redirects at build time
  if (post.redirect) {
    return {
      redirect: {
        destination: post.redirect,
        permanent: false,
      },
    };
  }

  // Ensure all values are serializable (convert undefined to null)
  const serializedPost = JSON.parse(JSON.stringify(post));

  const props = await getStaticLocaleProps(post.lang, "posts", fs.promises, path);

  // Override HTML lang attribute with post.lang if specified
  props.hreflang = post.hreflang;

  return {
    props: Object.assign(props, {
      post: serializedPost,
      downloads,
    }),
  };
};

export default function DownloadsPage({ post, downloads, texts, lang }: PageProps & ScreenLocaleProps) {
  return <PostDownload post={post} downloads={downloads} texts={texts} lang={lang} />;
}
