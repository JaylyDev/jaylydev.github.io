import "@/styles/globals.css";
import "@/styles/github-markdown-dark.css";
import "@/styles/posts.css";
import fs from "fs";
import path from "path";
import { notFound, redirect } from "next/navigation";
import { StatsCollection, SiteHeader, SiteFooter } from "@/components/SiteFormat";
import { getDownloadData, getPostData } from "@/app/utilities/getPublicPosts";
import { PostHeader } from "@/components/Post";
import { DownloadSection } from "@/components/Downloads";

interface PageProps {
  params: { slug: string };
}

const adsenseCode = `<ins class="adsbygoogle"
  style="display:block"
  data-ad-client="ca-pub-2533146760921020"
  data-ad-slot="7014545383"
  data-ad-format="auto"
  data-full-width-responsive="true"></ins>
<script>
  (adsbygoogle = window.adsbygoogle || []).push({});f
</script>`;

// Generate static parameters for all posts
export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "posts");
  if (!fs.existsSync(postsDirectory)) return [];

  const fileNames = fs.readdirSync(postsDirectory).filter((file) => file.endsWith(".md"));

  return fileNames.map((fileName) => ({
    slug: fileName.replace(/\.md$/, ""),
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const post = await getPostData(params.slug);
  if (!post) return notFound();

  return {
    title: `${post.title} | JaylyMC`,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      type: "article",
      images: [post.image],
    },
    twitter: {
      card: post.card,
      image: post.image,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const post = await getPostData(params.slug);
  const downloads = getDownloadData(params.slug);
  if (post?.redirect) return redirect(post.redirect);
  if (!post || !downloads) return notFound();

  return (
    <main>
      <StatsCollection />
      <SiteHeader />
      <PostHeader post={post} downloadButtonVisible={false} />
      <DownloadSection downloads={downloads} />
      <div className="markdown-body" dangerouslySetInnerHTML={{ __html: adsenseCode + post.content }} />
      <SiteFooter />
    </main>
  );
}
