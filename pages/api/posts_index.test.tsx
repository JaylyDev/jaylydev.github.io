import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

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

function getServerSideProps(): ResponseData {
  // Fetch data from external API
  const postsFiles = fs.readdirSync(path.join(process.cwd(), "posts")).filter((file) => path.extname(file) === ".md");
  const posts = postsFiles.map((file) => {
    const postData = fs.readFileSync(path.join(process.cwd(), "posts", file), "utf8");
    const data = matter(postData).data as PostMeta;
    return {
      slug: "/posts/" + file.replace(".md", ""),
      ...data,
    };
  });
  return { posts };
}
export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  res.status(200).json(getServerSideProps());
}
