import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { execSync } from "child_process";

function getGitLastModifiedDate(filePath) {
  try {
    const command = `git log -1 --format=%cd -- "${filePath}"`;
    const output = execSync(command, { encoding: "utf8" }).trim();
    if (!output) {
      return new Date().toString();
    }
    return output; // e.g. "Wed May 10 15:20:30 2023 +0200"
  } catch (error) {
    console.error("Error retrieving Git date:", error);
    return new Date().toString();
  }
}

// Fetch data from external API
const postsFiles = fs.readdirSync(path.join(process.cwd(), "posts")).filter((file) => path.extname(file) === ".md");
const posts = [];
for (const file of postsFiles) {
  const filepath = path.join(process.cwd(), "posts", file);
  const postData = fs.readFileSync(filepath, "utf8");
  const data = matter(postData).data;
  if (data.visible === false) continue;
  const lastModifiedDate = getGitLastModifiedDate(filepath);
  posts.push(`  <url>
    <loc>https://jaylydev.github.io/posts/${file.replace(".md", "")}/</loc>
    <lastmod>${new Date(lastModifiedDate).toISOString().split('T')[0]}</lastmod>
  </url>`);
}
const sitemapText = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${posts.join('\n')}
</urlset>`;
fs.writeFileSync(path.join(process.cwd(), "public/api/sitemap.xml"), sitemapText);