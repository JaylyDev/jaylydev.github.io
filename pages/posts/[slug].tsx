import "@/styles/globals.css";
import "@/styles/github-markdown-dark.css";
import "@/styles/posts.css";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import React from "react";
import { GetStaticProps, GetStaticPaths, Metadata } from "next";
import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import remarkAlert from "@/remark-alert";
import { SiteFooter, SiteHeader, StatsCollection } from "@/app/components/SiteFormat";
import type { PostMeta } from "../api/posts_index.test";

interface Props extends PostMeta {
  content: string;
}

const Post: React.FC<Props> = ({ content, title, date, author }) => {
  return (
    <div style={{ backgroundColor: "#0d1117" }}>
      <title>{title} | JaylyMC</title>
      <StatsCollection />
      <SiteHeader />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
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

      <article className="markdown-body" dangerouslySetInnerHTML={{ __html: content }}></article>
      <SiteFooter />
    </div>
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

  // Use remark to convert markdown into HTML string
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkAlert)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    props: {
      title: matterResult.data.title,
      content: contentHtml,
      date: matterResult.data.date,
      author: matterResult.data.author,
      description: matterResult.data.description,
    },
  };
};

export default Post;
