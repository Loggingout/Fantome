const SITE_URL = (process.env.FRONTEND_URL || "https://fantometechnologies.com").replace(/\/+$/, "");
const API_ORIGIN = (
  process.env.API_BASE_URL ||
  process.env.VITE_API_BASE ||
  "https://fantome.onrender.com"
)
  .replace(/\/api\/?$/, "")
  .replace(/\/+$/, "");

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });

function absoluteImageUrl(image) {
  try {
    const url = new URL(image || "/new-logo.png", SITE_URL);
    return ["http:", "https:"].includes(url.protocol)
      ? url.toString()
      : `${SITE_URL}/new-logo.png`;
  } catch {
    return `${SITE_URL}/new-logo.png`;
  }
}

export default async function handler(req, res) {
  const postId = typeof req.query?.id === "string" ? req.query.id : "";
  if (!/^[a-f\d]{24}$/i.test(postId)) {
    return res.status(404).send("Article not found");
  }

  try {
    const [postResponse, shellResponse] = await Promise.all([
      fetch(`${API_ORIGIN}/api/blog/${encodeURIComponent(postId)}`),
      fetch(`${req.headers["x-forwarded-proto"] || "https"}://${(req.headers["x-forwarded-host"] || req.headers.host).split(",")[0]}/`),
    ]);

    if (!postResponse.ok || !shellResponse.ok) {
      return res.status(404).send("Article not found");
    }

    const payload = await postResponse.json();
    if (!payload.success || !payload.post) {
      return res.status(404).send("Article not found");
    }

    const shell = await shellResponse.text();
    const post = payload.post;
    const canonicalUrl = `${SITE_URL}/blog/${encodeURIComponent(post.id)}`;
    const title = escapeHtml(post.title);
    const pageTitle = `${title} | Fantome Technologies`;
    const description = escapeHtml(
      post.excerpt || "Read the latest article from Fantome Technologies.",
    );
    const image = escapeHtml(absoluteImageUrl(post.image));
    const metadata = `
    <title>${pageTitle}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Fantome Technologies" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:alt" content="${title}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />`;
    const html = shell
      .replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, "")
      .replace(/<meta\b(?=[^>]*(?:name|property)=["'](?:description|robots|og:[^"']+|twitter:[^"']+)["'])[^>]*>/gi, "")
      .replace(/<link\b(?=[^>]*rel=["']canonical["'])[^>]*>/gi, "")
      .replace(/<head\b[^>]*>/i, (head) => `${head}${metadata}`);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return res.status(200).send(html);
  } catch (error) {
    console.error("Article share metadata error:", error);
    return res.status(502).send("Article preview is temporarily unavailable");
  }
}