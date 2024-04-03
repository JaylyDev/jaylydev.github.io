import "@/styles/globals.css";
import "@/styles/github-markdown-dark.css";
import "@/styles/posts.css";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import React from "react";
import { GetStaticProps, GetStaticPaths, Metadata } from "next";
import rehypeStringify from "rehype-stringify";
import rehypeDocument from "rehype-document";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import rehypeRaw from "rehype-raw";
import remarkAlert from "@/remark-alert";
import rehypeStarryNight from "@/rehype-starry-night";
import { SiteFooter, SiteHeader, StatsCollection } from "@/app/components/SiteFormat";
import Head from "next/head";

export interface PostMeta {
  title: string;
  date: string;
  author: string;
  description: string;
}

export interface PostData extends PostMeta {
  slug: string;
}

export interface ResponseData {
  posts: PostData[];
}

interface Props extends PostMeta {
  content: string;
}

const Post: React.FC<Props> = ({ content, title, description, date, author }) => {
  return (
    <>
      <Head>
        <title>{title + " | JaylyMC"}</title>
        <meta charSet="UTF-8" />
        <meta name="description" content={description} />
        <meta name="author" content={author} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div style={{ backgroundColor: "#0d1117" }}>
        <StatsCollection />
        <SiteHeader />
        <div className="markdown-header">
          <span>
            <a className="text-blue-500 hover:underline" href="/#posts">
              Posts
            </a>
            {` > ${title}`}
          </span>
          <br />
          <span className="text-gray-500">
            By {author} &middot; {new Date(date).toISOString().replace("-", "/").split("T")[0].replace("-", "/")}
          </span>
        </div>

        <div className="markdown-body" dangerouslySetInnerHTML={{ __html: content }}></div>
        <SiteFooter />
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const postsDirectory = path.join(process.cwd(), "posts");
  const fileNames = fs.readdirSync(postsDirectory);
  const paths = fileNames.map((fileName) => ({
    params: { slug: fileName.replace(/\.md$/, "") },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  if (!params || !params.slug) {
    return {
      notFound: true,
    };
  }

  const fullPath = path.join(process.cwd(), "posts", `${params.slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return {
      notFound: true,
    };
  }
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);
  const matterData = matterResult.data as PostMeta;

  // Use remark to convert markdown into HTML string
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkAlert)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeDocument)
    .use(rehypeStarryNight as any)
    .use(rehypeStringify)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    props: {
      title: matterData.title,
      content: contentHtml,
      date: matterData.date,
      author: matterData.author,
      description: matterData.description,
    },
  };
};

export default Post;
