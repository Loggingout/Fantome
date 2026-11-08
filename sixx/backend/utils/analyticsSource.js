const PRODUCTION_HOSTS = new Set(["fantometechnologies.com", "www.fantometechnologies.com"]);

export function isProductionAnalyticsSource(req) {
  const source = req.get("origin") || req.get("referer");
  if (!source) return false;
  try {
    const url = new URL(source);
    return url.protocol === "https:" && PRODUCTION_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}