export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  published: boolean;
  scheduledAt: string | null;
  publishedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface BlogPostPayload {
  title: string;
  excerpt: string;
  category: string;
  content: string;
  image: string;
  author: string;
  published: boolean;
  scheduledAt: string | null;
}
