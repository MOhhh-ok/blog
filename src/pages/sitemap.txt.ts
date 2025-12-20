import { getCollection } from "astro:content";

export async function GET(context: any) {
  const posts = await getCollection("blog");
  return new Response(posts.map((post) => `${context.site}blog/posts/${encodeURIComponent(post.id)}/`).join("\n"));
}
