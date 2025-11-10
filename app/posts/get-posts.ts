import { normalizePages } from "nextra/normalize-pages";
import { getPageMap } from "nextra/page-map";

export async function getPosts() {
  const list = await getPageMap("/posts");
  console.log(list);
  const { directories } = normalizePages({
    list,
    route: "/posts",
  });
  return directories?.filter(post => post.name !== "index");
  // .sort((a, b) => new Date(b.frontMatter.date) - new Date(a.frontMatter.date));
}

export async function getTags() {
  const posts = await getPosts();
  const tags = posts.flatMap(post => post.frontMatter.tags);
  return tags;
}
