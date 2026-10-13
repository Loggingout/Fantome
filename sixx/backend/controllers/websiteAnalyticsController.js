import { WebsiteAnalyticsEvent } from "../models/WebsiteAnalyticsEvent.js";

const VALID_EVENT_TYPES = new Set(["visit", "duration", "platform_link_click"]);
const INTERNAL_PATHS = ["/admin", "/employee", "/login"];
const MAX_PAGE_LENGTH = 120;
const MAX_SESSION_ID_LENGTH = 64;

function normalizePage(value) {
  if (typeof value !== "string") return "/";
  const path = value.startsWith("/") ? value : `/${value}`;
  const cleaned = path.split(/[?#]/)[0].slice(0, MAX_PAGE_LENGTH);
  return cleaned || "/";
}

export async function recordWebsiteAnalyticsEvent(req, res) {
  const { eventType, sessionId, page, durationMs, platformId, url } = req.body ?? {};
  const normalizedPage = normalizePage(page);

  if (!VALID_EVENT_TYPES.has(eventType)) {
    return res.status(400).json({ success: false, message: "Unsupported analytics event type." });
  }
  if (typeof sessionId !== "string" || sessionId.length < 12 || sessionId.length > MAX_SESSION_ID_LENGTH) {
    return res.status(400).json({ success: false, message: "Invalid analytics session." });
  }
  if (INTERNAL_PATHS.some((path) => normalizedPage === path || normalizedPage.startsWith(`${path}/`))) {
    return res.status(204).end();
  }
  if (eventType === "duration") {
    if (typeof durationMs !== "number" || !Number.isFinite(durationMs) || durationMs < 0 || durationMs > 8 * 60 * 60 * 1000) {
      return res.status(400).json({ success: false, message: "Duration is invalid." });
    }
  }
  if (eventType === "platform_link_click") {
    if (typeof platformId !== "string" || !platformId || platformId.length > 120 || typeof url !== "string" || !url || url.length > 400) {
      return res.status(400).json({ success: false, message: "Platform link details are required." });
    }
  }

  try {
    await WebsiteAnalyticsEvent.create({
      eventType,
      sessionId,
      page: normalizedPage,
      durationMs: eventType === "duration" ? Math.round(durationMs) : null,
      platformId: eventType === "platform_link_click" ? platformId : "",
      url: eventType === "platform_link_click" ? url : "",
    });
    return res.status(202).json({ success: true });
  } catch (error) {
    console.error("recordWebsiteAnalyticsEvent error:", error);
    return res.status(500).json({ success: false, message: "Unable to record analytics event." });
  }
}

export async function getWebsiteAnalyticsSummary(req, res) {
  try {
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - 29);
    start.setHours(0, 0, 0, 0);

    const events = await WebsiteAnalyticsEvent.find({ createdAt: { $gte: start } })
      .select("eventType sessionId page durationMs platformId url createdAt")
      .sort({ createdAt: 1 })
      .limit(200000)
      .lean();

    const visits = events.filter((event) => event.eventType === "visit");
    const durations = events.filter((event) => event.eventType === "duration" && typeof event.durationMs === "number");
    const linkClicks = events.filter((event) => event.eventType === "platform_link_click");
    const uniqueSessions = new Set(visits.map((event) => event.sessionId));

    const daily = new Map();
    for (const event of visits) {
      const key = event.createdAt.toISOString().slice(0, 10);
      const row = daily.get(key) ?? { date: key, visits: 0, uniqueVisitors: new Set() };
      row.visits += 1;
      row.uniqueVisitors.add(event.sessionId);
      daily.set(key, row);
    }

    const pageMap = new Map();
    const linkMap = new Map();
    for (const event of events) {
      if (event.eventType === "visit") {
        const row = pageMap.get(event.page) ?? { page: event.page, visits: 0, uniqueVisitors: new Set(), totalDurationMs: 0, durationCount: 0 };
        row.visits += 1;
        row.uniqueVisitors.add(event.sessionId);
        pageMap.set(event.page, row);
      }
      if (event.eventType === "duration") {
        const row = pageMap.get(event.page) ?? { page: event.page, visits: 0, uniqueVisitors: new Set(), totalDurationMs: 0, durationCount: 0 };
        row.totalDurationMs += event.durationMs;
        row.durationCount += 1;
        pageMap.set(event.page, row);
      }
      if (event.eventType === "platform_link_click") {
        const row = linkMap.get(event.platformId) ?? { platformId: event.platformId, url: event.url, clicks: 0, uniqueSessions: new Set() };
        row.clicks += 1;
        row.uniqueSessions.add(event.sessionId);
        linkMap.set(event.platformId, row);
      }
    }

    return res.status(200).json({
      success: true,
      rangeDays: 30,
      totals: {
        visits: visits.length,
        uniqueVisitors: uniqueSessions.size,
        averageVisitSeconds: durations.length ? Math.round(durations.reduce((sum, event) => sum + event.durationMs, 0) / durations.length / 1000) : 0,
        linkClicks: linkClicks.length,
      },
      daily: [...daily.values()]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(({ date, visits: count, uniqueVisitors }) => ({
          date,
          visits: count,
          uniqueVisitors: uniqueVisitors.size,
        })),
      topPages: [...pageMap.values()]
        .map(({ page, visits: count, uniqueVisitors, totalDurationMs, durationCount }) => ({
          page,
          visits: count,
          uniqueVisitors: uniqueVisitors.size,
          averageVisitSeconds: durationCount ? Math.round(totalDurationMs / durationCount / 1000) : 0,
        }))
        .sort((a, b) => b.visits - a.visits)
        .slice(0, 10),
      platformClicks: [...linkMap.values()]
        .map(({ platformId, url, clicks, uniqueSessions }) => ({
          platformId,
          url,
          clicks,
          uniqueVisitors: uniqueSessions.size,
        }))
        .sort((a, b) => b.clicks - a.clicks),
    });
  } catch (error) {
    console.error("getWebsiteAnalyticsSummary error:", error);
    return res.status(500).json({ success: false, message: "Unable to retrieve website analytics." });
  }
}
