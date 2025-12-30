import type { getCollection } from "astro:content";

export type Category = typeof CATEGORIES[number];

export type CategoryTreeItem = {
  category: Category;
  children?: CategoryTreeItem[];
};

export const CATEGORIES = [
  "未分類",
  "Google",
  "Google Cloud",
  "エディタ",
  "Docker",
  "Python",
  "GAS",
  "WordPress",
  "AI",
  "PHP",
  "Next.js",
  "TypeScript",
  "Node.js",
  "MUI",
  "React",
  "HTML",
  "CSS",
  "NestJS",
  "Prisma",
  "Database",
  "Laravel",
  "Shell",
  "Electron",
  "Flutter",
  "Vite",
  "Linux",
  "C2PA",
  "Drizzle",
  "開発",
] as const;

export const CATEGORIES_TREE: CategoryTreeItem[] = [
  {
    category: "TypeScript",
    children: [
      {
        category: "Node.js",
        children: [
          { category: "NestJS" },
          { category: "Prisma" },
          { category: "Drizzle" },
        ],
      },
      {
        category: "React",
        children: [
          { category: "Next.js" },
          { category: "MUI" },
        ],
      },
      { category: "Vite" },
      { category: "Electron" },
    ],
  },
  {
    category: "Google",
    children: [
      { category: "Google Cloud" },
      { category: "GAS" },
    ],
  },
  {
    category: "開発",
    children: [
      { category: "Docker" },
      { category: "エディタ" },
      { category: "Shell", children: [] },
      { category: "Linux", children: [] },
    ],
  },
  {
    category: "AI",
    children: [],
  },
  { category: "C2PA", children: [] },
  {
    category: "PHP",
    children: [
      {
        category: "Laravel",
        children: [],
      },
      { category: "WordPress" },
    ],
  },
  {
    category: "Python",
    children: [],
  },
  {
    category: "Flutter",
    children: [],
  },
  {
    category: "HTML",
    children: [
      { category: "CSS" },
    ],
  },
  {
    category: "Database",
    children: [],
  },
  { category: "未分類", children: [] },
];

export function filterPostsByCategory(posts: Awaited<ReturnType<typeof getCollection<"blog">>>, category: Category) {
  const item = findCategoryTreeItem(category);
  if (!item) return [];
  const categories = flatCategoryChildrenDeep(item).map(c => c.category);
  return posts.filter(post => isInCategories(categories, post.data.categories ?? []));
}

function isInCategories(categories1: Category[], categories2: Category[]) {
  return categories1.some(category => categories2.includes(category));
}

function flatCategoryChildrenDeep(item: CategoryTreeItem): CategoryTreeItem[] {
  return item.children
    ? [item, ...item.children.flatMap(child => flatCategoryChildrenDeep(child))]
    : [item];
}

function findCategoryTreeItem(category: Category): CategoryTreeItem | undefined {
  return flatCategoryTreeItems(CATEGORIES_TREE)
    .find(item => item.category === category);
}

export function flatCategoryTreeItems(items: CategoryTreeItem[]): CategoryTreeItem[] {
  return items
    .flatMap(item => [
      item,
      ...(item.children ? flatCategoryTreeItems(item.children) : []),
    ]);
}
