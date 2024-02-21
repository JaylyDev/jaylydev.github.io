import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Fetch data from external API
const postsFiles = fs.readdirSync(path.join(process.cwd(), "posts")).filter((file) => path.extname(file) === ".md");
const posts = postsFiles.map((file) => {
  const postData = fs.readFileSync(path.join(process.cwd(), "posts", file), "utf8");
  const data = matter(postData).data;
  return {
    slug: "/posts/" + file.replace(".md", ""),
    ...data,
  };
});
const response = { posts };
fs.writeFileSync(path.join(process.cwd(), "public/api/posts_index"), JSON.stringify(response));