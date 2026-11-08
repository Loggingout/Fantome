import api, { getAuthToken } from "../utils/api";

export interface BlogAnalyticsRow {
  id: string;
  slug: string;
  title: string;
  opens: number;
  readTimeMs: number;
  realLikes: number;
  realDislikes: number;
  inflatedLikes: number;
  inflatedDislikes: number;
}

export async function getBlogAnalytics(): Promise<BlogAnalyticsRow[]> {
  const response = await api.get<BlogAnalyticsRow[]>("/admin/blog-analytics");
  return response.data;
}

export async function updateBlogInflation(id: string, inflatedLikes: number, inflatedDislikes: number): Promise<void> {
  await api.put(`/admin/blog-analytics/${encodeURIComponent(id)}/inflation`, { inflatedLikes, inflatedDislikes });
}

export function recordArticleRead(postId: string, viewId: string, durationMs: number): void {
  const token = getAuthToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  void fetch(`${api.defaults.baseURL}/blog/${encodeURIComponent(postId)}/read`, {
    method: "POST",
    headers,
    body: JSON.stringify({ viewId, durationMs }),
    keepalive: true,
  }).catch(() => {});
}