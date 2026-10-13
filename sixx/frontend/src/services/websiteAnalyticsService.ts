import api from "../utils/api";

export interface WebsiteAnalyticsTotals {
  visits: number;
  uniqueVisitors: number;
  averageVisitSeconds: number;
  linkClicks: number;
}

export interface WebsiteAnalyticsDaily {
  date: string;
  visits: number;
  uniqueVisitors: number;
}

export interface WebsiteAnalyticsPageRow {
  page: string;
  visits: number;
  uniqueVisitors: number;
  averageVisitSeconds: number;
}

export interface WebsiteAnalyticsPlatformRow {
  platformId: string;
  url: string;
  clicks: number;
  uniqueVisitors: number;
}

export interface WebsiteAnalyticsSummary {
  success: boolean;
  rangeDays: number;
  totals: WebsiteAnalyticsTotals;
  daily: WebsiteAnalyticsDaily[];
  topPages: WebsiteAnalyticsPageRow[];
  platformClicks: WebsiteAnalyticsPlatformRow[];
}

export async function getWebsiteAnalyticsSummary(): Promise<WebsiteAnalyticsSummary> {
  const response = await api.get<WebsiteAnalyticsSummary>("/website-analytics/summary");
  return response.data;
}
