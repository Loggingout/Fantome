import api from "../utils/api";

export interface NewsletterAnalytics {
  totalSubscribers: number;
  blogEmailsSent: number;
  pendingBlogEmails: number;
}

export async function getNewsletterAnalytics(): Promise<NewsletterAnalytics> {
  const response = await api.get<NewsletterAnalytics>("/admin/newsletter/analytics");
  return response.data;
}
