import Head from "next/head";
import { useRouter } from "next/router";
import { StatsCollection, SiteHeader, SiteFooter } from "@/components/SiteFormat";
import { PostProps } from "@/utilities/getPublicPosts";
import { PostHeader } from "@/components/Post";
import { createTranslateFunction, ScreenLocaleProps } from "@/locale/i18n";

export interface PageProps {
  post: PostProps;
}

function PostHeadMetadata({ post }: { post: PostProps }) {
  const title = `${post.title} | JaylyMC`;
  const image = post.image || "https://jaylydev.github.io/icon.png";

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={post.description} />
      <meta name="author" content={post.author} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={post.description} />
      <meta property="og:type" content="article" />
      <meta property="og:image" content={image} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={post.description} />
      <meta property="twitter:card" content={post.card} />
      <meta property="twitter:image" content={image} />
    </Head>
  );
}

export default function PostPage({ post, texts, lang }: PageProps & ScreenLocaleProps) {
  const router = useRouter();
  const t = createTranslateFunction(texts);

  // Handle redirect
  if (post.redirect) {
    if (typeof window !== "undefined") {
      router.push(post.redirect);
    }
    return (
      <>
        <PostHeadMetadata post={post} />
        <StatsCollection />
        <SiteHeader t={t} lang={lang} />
        <div className="markdown-header">
          <p>
            Redirecting to <a href={post.redirect}>{post.redirect}</a>...
          </p>
        </div>
        <SiteFooter t={t} lang={lang} />
      </>
    );
  }

  return (
    <>
      <PostHeadMetadata post={post} />
      <StatsCollection />
      <SiteHeader t={t} lang={lang} />
      <PostHeader post={post} t={t} lang={lang} />
      <div className="markdown-body" dangerouslySetInnerHTML={{ __html: post.content }} />
      <SiteFooter t={t} lang={lang} />
    </>
  );
}
