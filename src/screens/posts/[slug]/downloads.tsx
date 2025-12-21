import Head from "next/head";
import { StatsCollection, SiteHeader, SiteFooter } from "@/components/SiteFormat";
import { PostProps } from "@/utilities/getPublicPosts";
import { PostHeader } from "@/components/Post";
import { DownloadSection, DownloadItem } from "@/components/Downloads";
import { createTranslateFunction, ScreenLocaleProps } from "@/locale/i18n";

export interface PageProps {
  post: PostProps;
  downloads: DownloadItem[];
}

const adsenseCode = `<ins class="adsbygoogle"
  style="display:block"
  data-ad-client="ca-pub-2533146760921020"
  data-ad-slot="7014545383"
  data-ad-format="auto"
  data-full-width-responsive="true"></ins>
<script>
  (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;

function PostHeadMetadata({ post }: { post: PostProps; isDownloadPage?: boolean }) {
  const title = `Download ${post.title} | JaylyMC`;
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

export default function DownloadsPage({ post, downloads, texts, lang }: PageProps & ScreenLocaleProps) {
  const t = createTranslateFunction(texts);

  return (
    <>
      <PostHeadMetadata post={post} isDownloadPage={true} />
      <StatsCollection />
      <SiteHeader t={t} lang={lang} />
      <PostHeader post={post} t={t} downloadButtonVisible={false} />
      <DownloadSection downloads={downloads} />
      <div className="markdown-body" dangerouslySetInnerHTML={{ __html: adsenseCode + post.content }} />
      <SiteFooter t={t} lang={lang} />
    </>
  );
}
