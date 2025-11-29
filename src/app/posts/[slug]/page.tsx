import "@/styles/github-markdown.css";
import "@/styles/highlight.js/github.css";
import "@/styles/posts.css";
import "@/styles/markdown-alert/github-base.css";
import "@/styles/markdown-alert/github-colors-dark-class.css";
import "@/styles/markdown-alert/github-colors-dark-media.css";
import "@/styles/markdown-alert/github-colors-light.css";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { StatsCollection, SiteHeader, SiteFooter } from "@/components/SiteFormat";
import { getPostData } from "@/app/utilities/getPublicPosts";
import { PostHeadMetadata, PostHeader } from "@/components/Post";

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

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostData(slug);
  if (!post) return notFound();
  if (post.redirect) {
    return (
      <html lang="en" suppressHydrationWarning>
        <PostHeadMetadata post={post} />
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
      <PostHeadMetadata post={post} />
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
