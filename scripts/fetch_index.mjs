import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Fetch data from external API
const postsFiles = fs.readdirSync(path.join(process.cwd(), "posts")).filter((file) => path.extname(file) === ".md");
const posts = [];
for (const file of postsFiles) {
  const postData = fs.readFileSync(path.join(process.cwd(), "posts", file), "utf8");
  const data = matter(postData).data;
  
  if (data.visible === false) continue;
  
  posts.push({
    slug: "/posts/" + file.replace(".md", ""),
    ...data,
  });
} 
const response = { posts: posts.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)) };
fs.writeFileSync(path.join(process.cwd(), "public/api/posts_index.json"), JSON.stringify(response));