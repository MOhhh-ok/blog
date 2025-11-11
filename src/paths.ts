const BASE = import.meta.env.BASE_URL;
export const PATHS = {
  posts: {
    index: `${BASE}/posts`,
    post: (id: string) => `${BASE}/posts/${id}`,
  },
} as const;
