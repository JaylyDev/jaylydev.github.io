import "@/styles/github-markdown.css";
import "@/styles/highlight.js/github.css";
import "@/styles/posts.css";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { StatsCollection, SiteHeader, SiteFooter } from "@/components/SiteFormat";
import { getPostData } from "@/app/utilities/getPublicPosts";
import { PostHeader } from "@/components/Post";

interface PageProps {
  params: Promise<{ slug: string }>;
}

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
  const { slug } = await params;
  const post = await getPostData(slug);
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

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostData(slug);
  if (!post) return notFound();
  if (post.redirect) {
    return (
      <html lang="en" suppressHydrationWarning>
        <meta httpEquiv="refresh" content={`0; url=${post.redirect}`} />
        <StatsCollection />
        <SiteHeader />
        <div className="markdown-header">
          <p>
            Redirecting to <a href={post.redirect}>{post.redirect}</a>...
          </p>
        </div>
        <SiteFooter />
      </html>
    );
  }

  return (
    <html lang={post.lang} suppressHydrationWarning>
      <body>
        <StatsCollection />
        <SiteHeader lang={post.lang === "zh-HK" ? "zh-HK" : "en"} />
        <PostHeader post={post} />
        <div className="markdown-body" dangerouslySetInnerHTML={{ __html: post.content }} />
        <SiteFooter lang={post.lang === "zh-HK" ? "zh-HK" : "en"} />
      </body>
    </html>
  );
}
