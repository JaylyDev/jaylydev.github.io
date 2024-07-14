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
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, getKeyValue } from "@nextui-org/table";
import { Progress } from "@nextui-org/progress";
import { SiteFooter, SiteHeader, StatsCollection } from "@/app/components/SiteFormat";
import Head from "next/head";
import { Button } from "@nextui-org/button";

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

export interface Props extends PostMeta {
  content: string;
  image: string;
  card: "summary_large_image" | "summary";
  downloads: DownloadItem[];
}

interface PostHeaderProps {
  title: string;
  author: string;
  date: string;
}

interface DownloadItem {
  title?: string;
  channel?: string;
  supports: string;
  changelog_url: string;
  url: string;
}

interface DownloadMetadataJSON {
  post: string;
  downloads: DownloadItem[];
}

const Post: React.FC<Props> = ({ content, title, description, date, author, image, card, downloads }) => {
  const columns = [
    { key: "version", label: "Version" },
    { key: "supports", label: "Supports" },
    { key: "changelog", label: "Changelog" },
    { key: "download", label: "Download" },
  ];

  const rows = downloads.map((item, index) => {
    return {
      key: index.toString(),
      version: item.title + (item.channel ? ` (${item.channel})` : " (Release)"),
      supports: item.supports,
      changelog: item.changelog_url ? (
        <a href={item.changelog_url}>
          <Button color="primary">Changelog</Button>
        </a>
      ) : (
        <Button disabled color="default">
          Changelog
        </Button>
      ),
      download: (
        <a href={item.url}>
          <Button color="success">
            <strong>Download</strong>
          </Button>
        </a>
      ),
    };
  });

  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (value >= 100) {
        clearInterval(interval);
      }
      setValue((v) => (v >= 100 ? v : v + 5));
    }, 250);

    return () => clearInterval(interval);
  }, [value]);

  return (
    <div className="dark text-foreground">
      <Head>
        <title>{title + " - Downloads | JaylyMC"}</title>
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
      <div className="markdown-body">
        <h1>Downloads</h1>
      </div>
      {value < 100 ? (
        <Progress
          label="Fetching Downloads..."
          size="md"
          value={value}
          color="success"
          showValueLabel={true}
          className="download-assets"
        />
      ) : (
        <Table className="download-assets" aria-label="Example static collection table">
          <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
          </TableHeader>
          <TableBody items={rows} emptyContent="No rows to display.">
            {(item) => (
              <TableRow key={item.key}>{(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}</TableRow>
            )}
          </TableBody>
        </Table>
      )}
      <div className="markdown-body" dangerouslySetInnerHTML={{ __html: content }}></div>
      <SiteFooter />
    </div>
  );
};

export const PostHeader: React.FC<PostHeaderProps> = ({ title, author, date }) => {
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

  const downloadMetaPath = path.join(process.cwd(), "downloads", params.slug + ".json");
  if (!fs.existsSync(downloadMetaPath)) {
    return {
      redirect: {
        destination: "/posts/" + params.slug,
        permanent: false,
      },
    };
  }
  const metadata: DownloadMetadataJSON = JSON.parse(fs.readFileSync(downloadMetaPath, "utf8"));
  const postPath = path.join(process.cwd(), "posts", `${params.slug}.md`);
  const fileContents = fs.readFileSync(postPath, "utf8");

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
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    props: {
      title: matterData.title,
      content: contentHtml,
      date: matterData.date,
      author: matterData.author,
      description: "Download " + matterData.title + " ",
      image: matterData.image ?? "https://jaylydev.github.io/icon.png",
      card: matterData.image ? "summary_large_image" : "summary",
      downloads: metadata.downloads,
    },
  };
};

export default Post;
