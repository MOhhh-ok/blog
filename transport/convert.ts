import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import TurndownService from "turndown";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface Post {
  title: string;
  date: string;
  content: string;
  categories: string[];
  tags: string[];
  slug: string;
}

// XMLパーサー設定
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  ignoreDeclaration: true,
  parseTagValue: false,
  cdataPropName: "__cdata",
  processEntities: true,
  trimValues: true,
});

// Turndown設定（HTMLをMarkdownに変換）
const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

// WordPressコードブロック用のカスタムルール
turndownService.addRule("wordpressCode", {
  filter: (node) => {
    return node.nodeName === "PRE"
      && node.classList.contains("wp-block-code");
  },
  replacement: (content, node) => {
    // <code>タグから言語を抽出
    const codeElement = node.querySelector("code");
    let language = "";

    if (codeElement) {
      const classList = Array.from(codeElement.classList);
      const langClass = classList.find(cls => cls.startsWith("language-"));
      if (langClass) {
        language = langClass.replace("language-", "");
      }
    }

    return `\n\n\`\`\`${language}\n${content}\n\`\`\`\n\n`;
  },
});

function extractValue(obj: any): string {
  if (typeof obj === "string") return obj;
  if (obj?.__cdata) return obj.__cdata;
  if (obj?.["#text"]) return obj["#text"];
  return "";
}

function extractPosts(xmlContent: string): Post[] {
  const parsed = parser.parse(xmlContent);
  const items = parsed.rss?.channel?.item || [];

  console.log(`全アイテム数: ${Array.isArray(items) ? items.length : 1}`);

  const itemsArray = Array.isArray(items) ? items : [items];
  const posts: Post[] = [];

  for (const item of itemsArray) {
    const postType = extractValue(item["wp:post_type"]);
    const status = extractValue(item["wp:status"]);

    console.log(`タイプ: ${postType}, ステータス: ${status}`);

    // postタイプでpublish状態のみ
    if (postType !== "post" || status !== "publish") {
      continue;
    }

    const title = extractValue(item.title) || "Untitled";
    const date = extractValue(item["wp:post_date"]) || "";
    const slug = extractValue(item["wp:post_name"]) || "";
    const content = extractValue(item["content:encoded"]) || "";

    // カテゴリーとタグを抽出
    const categories: string[] = [];
    const tags: string[] = [];

    if (item.category) {
      const cats = Array.isArray(item.category) ? item.category : [item.category];
      cats.forEach((cat: any) => {
        const domain = cat["@_domain"];
        const text = extractValue(cat);
        if (domain === "category") {
          categories.push(text);
        } else if (domain === "post_tag") {
          tags.push(text);
        }
      });
    }

    posts.push({
      title,
      date,
      content,
      categories,
      tags,
      slug,
    });
  }

  return posts;
}
function generateFilename(title: string, date: string, slug: string): string {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");

  const cleanSlug = title
    .toLowerCase()
    // .replace(/[^a-z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/[\s\/]/g, "-")
    .substring(0, 50);

  return `${month}-${day}-${cleanSlug}.md`;
}

function getYearMonthPath(date: string): string {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  return `${year}`;
}

// メイン処理
const xmlPath = path.join(__dirname, "WordPress.2025-11-10.xml");
const xmlContent = fs.readFileSync(xmlPath, "utf-8");
const posts = extractPosts(xmlContent);

const outputDir = path.join(__dirname, "output");

posts.forEach(post => {
  const yearMonth = getYearMonthPath(post.date);
  const postDir = path.join(outputDir, yearMonth);

  if (!fs.existsSync(postDir)) {
    fs.mkdirSync(postDir, { recursive: true });
  }

  // HTMLをMarkdownに変換
  const markdown = turndownService.turndown(post.content);

  const frontmatter = `---
title: "${post.title.replace(/"/g, "\\\"")}"
pubDate: ${post.date.split(" ")[0]}
categories: [${post.categories.map(c => `"${c}"`).join(", ")}]
tags: [${post.tags.map(t => `"${t}"`).join(", ")}]
---

`;

  const filename = generateFilename(post.title, post.date, post.slug);
  const filepath = path.join(postDir, filename);

  fs.writeFileSync(filepath, frontmatter + markdown, "utf-8");
  console.log(`✓ ${yearMonth}/${filename}`);
});

console.log(`\n変換完了: ${posts.length}件の記事`);
