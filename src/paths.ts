const BASE = import.meta.env.BASE_URL;
export const PATHS = {
  posts: {
    index: `${BASE}/posts`,
    post: (id: string) => `${BASE}/posts/${id}`,
  },
  categories: {
    index: `${BASE}/categories`,
    category: (id: string) => `${BASE}/categories/${id}`,
  },
  works: {
    index: `${BASE}/works`,
    work: (id: string) => `${BASE}/works/${id}`,
  },
} as const;
