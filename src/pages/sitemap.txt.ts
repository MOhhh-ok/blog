import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";

export async function GET(context: any) {
  const posts = await getCollection("blog");
  const res = new Response();
  return new Response(posts.map((post) => `${context.site}blog/${post.id}`).join("\n"));
  // ({
  //     ...post.data,
  //     pubDate: post.data.pubDate,
  //     description: post.data.description || "",
  //     link: `${context.site}blog/${post.id}/`,
  //   })),
  // });
}
