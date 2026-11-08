const SITE_URL = (process.env.FRONTEND_URL || "https://fantometechnologies.com").replace(/\/+$/, "");
const API_ORIGIN = (
  process.env.API_BASE_URL ||
  process.env.VITE_API_BASE ||
  "https://fantome.onrender.com"
)
  .replace(/\/api\/?$/, "")
  .replace(/\/+$/, "");

const PUBLIC_PATHS = [
  ["/", "weekly", "1.0"],
  ["/about", "monthly", "0.7"],
  ["/contact", "yearly", "0.6"],
  ["/blog", "daily", "0.9"],
  ["/ecosystem", "monthly", "0.8"],
  ["/platforms", "monthly", "0.8"],
  ["/donations", "monthly", "0.5"],
  ["/the-mission", "monthly", "0.6"],
  ["/join-the-team", "monthly", "0.6"],
  ["/making-a-difference", "monthly", "0.5"],
  ["/newsletter", "monthly", "0.4"],
  ["/status", "hourly", "0.5"],
  ["/status/history", "daily", "0.4"],
  ["/growth-and-impact", "monthly", "0.5"],
];

const escapeXml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;",
    };
    return entities[character];
  });

function staticUrl(path, changefreq, priority) {
  return `<url><loc>${escapeXml(`${SITE_URL}${path === "/" ? "/" : path}`)}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}

function articleUrl(post) {
  const loc = `${SITE_URL}/blog/${encodeURIComponent(post.slug || post.id)}`;
  const lastmod = post.updatedAt || post.publishedAt;
  const lastmodTag = lastmod && !Number.isNaN(Date.parse(lastmod))
    ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>`
    : "";
  return `<url><loc>${escapeXml(loc)}</loc>${lastmodTag}<changefreq>yearly</changefreq><priority>0.7</priority></url>`;
}

export default async function handler(_req, res) {
  let posts = [];

  try {
    const response = await fetch(`${API_ORIGIN}/api/blog`);
    if (response.ok) {
      const payload = await response.json();
      if (payload.success && Array.isArray(payload.posts)) posts = payload.posts;
    }
  } catch (error) {
    console.error("Sitemap blog lookup failed:", error.message);
  }

  const urls = [
    ...PUBLIC_PATHS.map(([path, changefreq, priority]) =>
      staticUrl(path, changefreq, priority),
    ),
    ...posts.map(articleUrl),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  return res.status(200).send(xml);
}