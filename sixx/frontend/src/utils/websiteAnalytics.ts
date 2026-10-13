import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import api from "./api";

const SESSION_KEY = "ft_analytics_session";
const SESSION_TIMESTAMP_KEY = "ft_analytics_session_timestamp";
const SESSION_MAX_AGE_MS = 30 * 60 * 1000;
const INTERNAL_PATHS = ["/admin", "/employee", "/login"];

const isAnalyticsEnabled =
  typeof window !== "undefined" &&
  import.meta.env.PROD &&
  window.location.hostname === "fantometechnologies.com";

function isPublicPath(pathname: string) {
  return !INTERNAL_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function getSessionId() {
  const now = Date.now();
  const existing = window.sessionStorage.getItem(SESSION_KEY);
  const createdAt = Number(window.sessionStorage.getItem(SESSION_TIMESTAMP_KEY) ?? 0);

  if (existing && now - createdAt <= SESSION_MAX_AGE_MS) {
    return existing;
  }

  const sessionId = crypto.randomUUID().replaceAll("-", "");
  window.sessionStorage.setItem(SESSION_KEY, sessionId);
  window.sessionStorage.setItem(SESSION_TIMESTAMP_KEY, String(now));
  return sessionId;
}

function sendBeaconEvent(payload: Record<string, unknown>) {
  if (!isAnalyticsEnabled || !isPublicPath(window.location.pathname)) return;
  const url = `${api.defaults.baseURL}/website-analytics/events`;
  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
    return;
  }

  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
    credentials: "include",
  }).catch(() => {});
}

export function useWebsiteVisitTracker() {
  const entry = useRef<{ path: string; startedAt: number } | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isAnalyticsEnabled || !isPublicPath(pathname)) return;

    entry.current = { path: pathname, startedAt: Date.now() };
    sendBeaconEvent({ eventType: "visit", sessionId: getSessionId(), page: entry.current.path });

    return () => {
      if (!entry.current) return;
      sendBeaconEvent({
        eventType: "duration",
        sessionId: getSessionId(),
        page: entry.current.path,
        durationMs: Date.now() - entry.current.startedAt,
      });
      entry.current = null;
    };
  }, [pathname]);
}

export function trackPlatformLinkClick(platform: { id: string; url: string }) {
  sendBeaconEvent({
    eventType: "platform_link_click",
    sessionId: getSessionId(),
    page: window.location.pathname,
    platformId: platform.id,
    url: platform.url,
  });
}

export function WebsiteVisitTracker() {
  useWebsiteVisitTracker();
  return null;
}
