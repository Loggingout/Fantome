import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { afterEach, test } from "node:test";
import handler from "../api/blog-preview.js";

const postId = "507f1f77bcf86cd799439011";
const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

async function renderPreview(image, identifier = postId) {
  globalThis.fetch = async (url) =>
    String(url).includes(`/api/blog/${identifier}`)
      ? new Response(JSON.stringify({
          success: true,
          post: { id: postId, slug: "news-updates", title: "News & updates", excerpt: "Article description", image },
        }))
      : new Response('<html><head><title>Home</title><meta property="og:image" content="logo"></head><body></body></html>');

  const response = {
    status(code) { this.statusCode = code; return this; },
    setHeader() {},
    send(body) { this.body = body; return this; },
  };

  await handler({ query: { id: identifier }, headers: { host: "example.test" } }, response);
  assert.equal(response.statusCode, 200);
  return response.body;
}

test("article route targets the static preview function", async () => {
  const config = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));
  assert.equal(
    config.rewrites.find((rewrite) => rewrite.source === "/blog/:id")?.destination,
    "/api/blog-preview?id=:id",
  );
});

test("crawler HTML uses the article title and absolute image", async () => {
  const html = await renderPreview("https://images.example.test/article.jpg");
  assert.match(html, /property="og:title" content="News &amp; updates"/);
  assert.match(html, /property="og:image" content="https:\/\/images\.example\.test\/article\.jpg"/);
  assert.match(html, /name="twitter:image" content="https:\/\/images\.example\.test\/article\.jpg"/);
  assert.equal((html.match(/property="og:image"/g) || []).length, 1);
});

test("uploaded relative image paths use the backend origin", async () => {
  const html = await renderPreview("/api/blog/images/507f1f77bcf86cd799439012");
  assert.match(html, /property="og:image" content="https:\/\/fantome\.onrender\.com\/api\/blog\/images\/507f1f77bcf86cd799439012"/);
});

test("articles without an image use the company logo", async () => {
  const html = await renderPreview("");
  assert.match(html, /property="og:image" content="https:\/\/fantometechnologies\.com\/new-logo\.png"/);
});

test("slug and legacy ID links use the title-based canonical URL", async () => {
  for (const identifier of ["news-updates", postId]) {
    const html = await renderPreview("https://images.example.test/article.jpg", identifier);
    assert.match(html, /rel="canonical" href="https:\/\/fantometechnologies\.com\/blog\/news-updates"/);
    assert.match(html, /property="og:url" content="https:\/\/fantometechnologies\.com\/blog\/news-updates"/);
  }
});