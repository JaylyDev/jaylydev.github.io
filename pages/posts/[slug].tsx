import "@/styles/globals.css";
import "@/styles/github-markdown-dark.css";
import "@/styles/posts.css";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import React, { useEffect, useState } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { unified } from "unified";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import remarkAlert from "@/remark-alert";
import rehypeStarryNight from "@/rehype-starry-night";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeToc, { toc } from "@jsdevtools/rehype-toc";
import rehypeSlug from "rehype-slug";
import { SiteFooter, SiteHeader, StatsCollection } from "@/app/components/SiteFormat";
import Head from "next/head";

export interface PostMeta {
  title: string;
  date: string;
  author: string;
  description: string;
  image: string | null;
}

export interface PostData extends PostMeta {
  slug: string;
}

export interface ResponseData {
  posts: PostData[];
}

interface Props extends PostMeta {
  content: string;
  image: string;
  card: "summary_large_image" | "summary";
}

interface PostHeaderProps {
  title: string;
  author: string;
  date: string;
}

const Post: React.FC<Props> = ({ content, title, description, date, author, image, card }) => {
  return (
    <>
      <Head>
        <title>{title + " | JaylyMC"}</title>
        <meta charSet="UTF-8" />
        <meta name="description" content={description} />
        <meta name="author" content={author} />

        <meta property="og:type" content="article" />
        <meta property="og:image" content={image} />
        <meta property="twitter:card" content={card} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <StatsCollection />
      <SiteHeader />
      <PostHeader title={title} author={author} date={date} />
      <div className="markdown-body" dangerouslySetInnerHTML={{ __html: content }}></div>
      <SiteFooter />
    </>
  );
};

const PostHeader: React.FC<PostHeaderProps> = ({ title, author, date }) => {
  const [dateString, setDate] = useState(date);

  useEffect(() => {
    setDate(new Date(date).toISOString().replace("-", "/").split("T")[0].replace("-", "/"));
  }, [date]);

  return (
    <div className="markdown-header">
      <span>
        <a className="hyperlink" href="/#posts">
          Posts
        </a>
        {` > ${title}`}
      </span>
      <br />
      <span className="text-gray-500">
        By {author} &middot; {dateString}
      </span>
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
  const matterData = matterResult.data as PostMeta;

  // Use remark to convert markdown into HTML string
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkAlert)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStarryNight as any)
    .use(rehypeStringify)
    .use(rehypeSlug)
    .use(rehypeToc, {
      headings: ["h1", "h2", "h3"],
      customizeTOC(toc) {
        if (toc.children) {
          toc.children.forEach((child) => {
            if ("tagName" in child && child.tagName === "ol") {
              child.tagName = "ul";
            }
          });
        }
        return toc;
      },
      customizeTOCItem(tocItem) {
        for (const child of tocItem.children ?? []) {
          if ("tagName" in child && child.tagName === "ol") {
            child.tagName = "ul";
          }
        }
        return true;
      },
    })
    .use(rehypeAutolinkHeadings, { behavior: "append" })
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    props: {
      title: matterData.title,
      content: contentHtml,
      date: matterData.date,
      author: matterData.author,
      description: matterData.description,
      image: matterData.image ?? "https://jaylydev.github.io/icon.png",
      card: matterData.image ? "summary_large_image" : "summary",
    },
  };
};

export default Post;
