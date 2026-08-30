import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import remarkGithubAlerts from "@/remark-github-alerts";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { unified } from "unified";
import rehypeToc from "@jsdevtools/rehype-toc";

/**
 * Parses raw Markdown text into HTML with slug headings, GFM support,
 * code syntax highlighting, and GitHub Alerts.
 */
export async function parseMarkdown(
  content: string,
  tableOfContents: boolean = false,
): Promise<string> {
  const processor = unified()
    .use(remarkParse, { fragment: true })
    .use(remarkGfm)
    .use(remarkGithubAlerts)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "append" });

  if (tableOfContents) {
    processor.use(rehypeToc, {
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
    });
  }

  const result = await processor.process(content);
  return result.toString();
}
