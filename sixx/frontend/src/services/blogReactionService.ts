import api from "../utils/api";

export type BlogReactionChoice = "like" | "dislike" | null;

export interface BlogReactionSummary {
  likes: number;
  dislikes: number;
  reaction: BlogReactionChoice;
}

export async function getBlogReactionSummary(
  postId: string,
  voterId: string,
): Promise<BlogReactionSummary> {
  const response = await api.get<BlogReactionSummary>(
    `/blog/${encodeURIComponent(postId)}/reactions`,
    { params: { voterId } },
  );
  return response.data;
}

export async function saveBlogReaction(
  postId: string,
  voterId: string,
  reaction: BlogReactionChoice,
): Promise<BlogReactionSummary> {
  const response = await api.post<BlogReactionSummary>(
    `/blog/${encodeURIComponent(postId)}/reactions`,
    { voterId, reaction },
  );
  return response.data;
}
