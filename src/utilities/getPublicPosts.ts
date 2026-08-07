import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getGitLastModifiedDate } from "./gitHistory";
import type { DownloadItem, DownloadProps } from "@/components/Downloads";
import { parseMarkdown } from "./markdown";

export interface PublicPost {
  title: string;
  author: string;
  description: string;
  slug: string;
  lastModified: string;
}

// Types for post frontmatter and props
export interface PostMeta {
  title: string;
  author: string;
  description: string;
  image: string;
  download: boolean;
  visible: boolean;
  redirect: string | null;
  hreflang: string; // href lang attribute
  lang: string; // locale for i18n
}

export interface PostProps extends PostMeta {
  content: string;
  // We'll add the lastModified property for the Git date
  lastModified: string;
  card: "summary_large_image" | "summary";
}

// getPublicPosts fetches and returns all posts from the /posts directory.
export function getPublicPosts(): PublicPost[] {
  const postsDirectory = path.join(process.cwd(), "posts");

  if (!fs.existsSync(postsDirectory)) {
    console.error("Posts directory does not exist.");
    return [];
  }

  // Get all Markdown files.
  const fileNames = fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"));

  // Map over each file, extracting frontmatter and Git date.
  const posts: PublicPost[] = [];

  for (const fileName of fileNames) {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Extract frontmatter.
    const { data } = matter(fileContents);

    if (data.visible === false) {
      continue;
    }

    // Get last modified date from Git.
    const lastModified = getGitLastModifiedDate(fullPath);

    posts.push({
      slug,
      title: data.title,
      description: data.description,
      author: data.author,
      lastModified,
    });
  }

  return posts;
}

// Fetch post data from a Markdown file and process it to HTML
export async function getPostData(slug: string): Promise<PostProps | null> {
  const postPath = path.join(process.cwd(), "posts", `${slug}.md`);

  if (!fs.existsSync(postPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(postPath, "utf8");
  const { content: rawContent, data } = matter(fileContents);
  const matterData = data as PostMeta;

  // Process markdown into HTML
  const contentHtml = await parseMarkdown(rawContent, true);

  // Get the last modified date from Git
  const lastModified = getGitLastModifiedDate(postPath);

  return {
    title: matterData.title,
    author: matterData.author,
    description: matterData.description,
    image: matterData.image ?? "https://jaylydev.github.io/icon.png",
    download: matterData.download ?? false,
    visible: matterData.visible ?? true,
    redirect: matterData.redirect ?? null,
    content: contentHtml,
    hreflang: matterData.hreflang ?? "en",
    lang: matterData.lang ?? "en",
    lastModified,
    card: matterData.image ? "summary_large_image" : "summary",
  };
}

export function getDownloadData(slug: string): DownloadItem[] | null {
  const downloadMetaPath = path.join(process.cwd(), `downloads/${slug}.json`);
  if (!fs.existsSync(downloadMetaPath)) {
    return null;
  }
  const metadata: DownloadProps = JSON.parse(
    fs.readFileSync(downloadMetaPath, "utf8")
  );
  return metadata.downloads;
}
