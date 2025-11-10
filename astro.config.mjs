// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://mohhh-ok.github.io",
  base: "/blog",
  integrations: [mdx(), sitemap(), pagefind()],
});
