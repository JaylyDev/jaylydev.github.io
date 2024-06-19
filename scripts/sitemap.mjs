import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Fetch data from external API
const postsFiles = fs.readdirSync(path.join(process.cwd(), "posts")).filter((file) => path.extname(file) === ".md");
const posts = postsFiles.map((file) => {
  const postData = fs.readFileSync(path.join(process.cwd(), "posts", file), "utf8");
  const data = matter(postData).data;
  return `  <url>
    <loc>https://jaylydev.github.io/posts/${file.replace(".md", "")}/</loc>
    <lastmod>${new Date(data.date).toISOString().split('T')[0]}</lastmod>
  </url>`;
});
const sitemapText = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${posts.join('\n')}
</urlset>`;
fs.writeFileSync(path.join(process.cwd(), "public/api/sitemap.xml"), sitemapText);