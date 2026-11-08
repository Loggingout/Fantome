import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import api from "./api";
import { getAnalyticsSession, isAnalyticsHost } from "./websiteAnalyticsPolicy";

const INTERNAL_PATHS = ["/admin", "/employee", "/login"];

const isAnalyticsEnabled =
  typeof window !== "undefined" &&
  isAnalyticsHost(window.location.hostname, import.meta.env.PROD);

function isPublicPath(pathname: string) {
  return !INTERNAL_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function getSessionId() {
  return getAnalyticsSession(window.sessionStorage, Date.now(), () =>
    crypto.randomUUID().replaceAll("-", ""),
  );
}

function sendBeaconEvent(payload: Record<string, unknown>) {
  if (!isAnalyticsEnabled || typeof payload.page !== "string" || !isPublicPath(payload.page)) return;
  const url = `${api.defaults.baseURL}/website-analytics/events`;
  const body = JSON.stringify(payload);

  if (navigator.sendBeacon && navigator.sendBeacon(url, new Blob([body], { type: "text/plain" }))) {
    return;
  }

  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body,
    keepalive: true,
    credentials: "omit",
  }).catch(() => {});
}

export function useWebsiteVisitTracker() {
  const entry = useRef<{ path: string; startedAt: number; sessionId: string } | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isAnalyticsEnabled || !isPublicPath(pathname)) return;

    const beginVisit = () => {
      entry.current = { path: pathname, startedAt: Date.now(), sessionId: getSessionId() };
      sendBeaconEvent({ eventType: "visit", sessionId: entry.current.sessionId, page: pathname });
    };
    const finishVisit = () => {
      const current = entry.current;
      if (!current) return;
      entry.current = null;
      sendBeaconEvent({
        eventType: "duration",
        sessionId: current.sessionId,
        page: current.path,
        durationMs: Math.min(Date.now() - current.startedAt, 8 * 60 * 60 * 1000),
      });
    };
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted && !entry.current) beginVisit();
    };
    let lastSessionRefresh = Date.now();
    const handleActivity = () => {
      if (Date.now() - lastSessionRefresh < 30_000) return;
      getSessionId();
      lastSessionRefresh = Date.now();
    };

    beginVisit();
    window.addEventListener("pagehide", finishVisit);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("pointerdown", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("scroll", handleActivity, { passive: true });

    return () => {
      finishVisit();
      window.removeEventListener("pagehide", finishVisit);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("pointerdown", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("scroll", handleActivity);
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
