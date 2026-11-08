export const SESSION_KEY = "ft_analytics_session";
export const SESSION_TIMESTAMP_KEY = "ft_analytics_session_timestamp";
export const SESSION_MAX_AGE_MS = 30 * 60 * 1000;

export function isAnalyticsHost(hostname: string, isProduction: boolean): boolean {
  return isProduction && ["fantometechnologies.com", "www.fantometechnologies.com"].includes(hostname);
}

export function getAnalyticsSession(storage: Storage, now: number, createId: () => string): string {
  const existing = storage.getItem(SESSION_KEY);
  const lastActivity = Number(storage.getItem(SESSION_TIMESTAMP_KEY) ?? 0);
  const sessionId = existing && lastActivity > 0 && now >= lastActivity && now - lastActivity <= SESSION_MAX_AGE_MS
    ? existing
    : createId();
  storage.setItem(SESSION_KEY, sessionId);
  storage.setItem(SESSION_TIMESTAMP_KEY, String(now));
  return sessionId;
}