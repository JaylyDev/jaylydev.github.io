import fs from "fs";
import path from "path";
import { getPublicPosts } from "../src/utilities/getPublicPosts";
import routesConfig from "../src/locale/routes.json";

const SITE_URL = "https://jaylydev.github.io";
const OUTPUT_DIR = path.join(process.cwd(), "out");

interface PathRoute {
  lang: string;
  hreflang?: string;
  path: string;
}

interface Route {
  id?: string;
  noindex?: boolean;
  paths: PathRoute[];
}

interface UrlAlternate {
  hreflang: string;
  href: string;
}

interface UrlEntry {
  loc: string;
  lastmod: string;
  alternates?: UrlAlternate[];
}

/**
 * Convert date string to YYYY-MM-DD format
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}

/**
 * Generate XML sitemap from URL entries
 */
function generateXML(urls: UrlEntry[]): string {
  const urlElements = urls
    .map((url) => {
      const alternateLinks = url.alternates
        ? url.alternates
            .map(
              (alt) =>
                `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />`
            )
            .join("\n")
        : "";

      return [
        "  <url>",
        `    <loc>${url.loc}</loc>`,
        `    <lastmod>${formatDate(url.lastmod)}</lastmod>`,
        alternateLinks ? alternateLinks : undefined,
        "  </url>",
      ]
        .filter((v) => v)
        .join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlElements}
</urlset>`;
}

/**
 * Generate sitemap for posts
 */
function generatePostsSitemap(): UrlEntry[] {
  const posts = getPublicPosts();
  const urls: UrlEntry[] = [];

  for (const post of posts) {
    urls.push({
      loc: `${SITE_URL}/posts/${post.slug}/`,
      lastmod: post.lastModified,
    });
  }

  return urls;
}

function buildAlternates(paths: PathRoute[]): UrlAlternate[] | undefined {
  if (paths.length <= 1) return undefined;
  const alternates: UrlAlternate[] = [];
  for (const p of paths) {
    const code = p.hreflang || p.lang;
    alternates.push({ hreflang: code, href: `${SITE_URL}${p.path}` });
    if (code === "zh-HK") {
      alternates.push({ hreflang: "zh-Hant", href: `${SITE_URL}${p.path}` });
    }
  }
  const zhHkRoute = paths.find((p) => p.hreflang === "zh-HK");
  const enRoute = paths.find((p) => p.lang === "en");
  const defaultRoute = zhHkRoute ?? enRoute ?? paths[0];
  alternates.push({ hreflang: "x-default", href: `${SITE_URL}${defaultRoute.path}` });
  return alternates;
}

/**
 * Generate sitemap for localized webpages
 */
function generateLocalizedSitemap(): UrlEntry[] {
  const routes = routesConfig.routes as Route[];
  const urls: UrlEntry[] = [];
  const today = new Date().toISOString();

  for (const route of routes) {
    if (route.noindex) continue;
    // Create URL entries for each language version
    const alternates = buildAlternates(route.paths);
    for (const pathConfig of route.paths) {
      urls.push({
        loc: `${SITE_URL}${pathConfig.path}`,
        lastmod: today,
        alternates,
      });
    }
  }

  return urls;
}

/**
 * Main function to generate all sitemaps
 */
export function generateSitemaps() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Generate combined sitemap with all URLs
  const postsUrls = generatePostsSitemap();
  const localizedUrls = generateLocalizedSitemap();
  const allUrls = [...localizedUrls, ...postsUrls];
  const sitemapXML = generateXML(allUrls);

  // Write sitemap to file
  const outputPath = path.join(OUTPUT_DIR, "sitemap-pages.xml");
  fs.writeFileSync(outputPath, sitemapXML, "utf8");

  console.log(`Generated sitemap with ${allUrls.length} URLs`);
  console.log(`   - ${localizedUrls.length} localized pages`);
  console.log(`   - ${postsUrls.length} posts`);
  console.log(`Sitemap saved to: ${outputPath}`);
}

generateSitemaps();
