import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { Blog } from "../backend/models/Blog.js";
import { getPublishedPostById } from "../backend/controllers/blogController.js";
import { backfillBlogSlugs, slugifyBlogTitle, withUniqueBlogSlug } from "../backend/services/blogSlugService.js";

const originalFindOne = Blog.findOne;
const originalUpdateMany = Blog.updateMany;
const originalInit = Blog.init;
const originalFind = Blog.find;
const originalUpdateOne = Blog.updateOne;

afterEach(() => {
  Blog.findOne = originalFindOne;
  Blog.updateMany = originalUpdateMany;
  Blog.init = originalInit;
  Blog.find = originalFind;
  Blog.updateOne = originalUpdateOne;
});

test("titles are normalized and reserved paths are avoided", () => {
  assert.equal(slugifyBlogTitle("Caf\u00e9 & News!"), "cafe-news");
  assert.equal(slugifyBlogTitle("All"), "article-all");
  assert.equal(slugifyBlogTitle("Scheduled"), "article-scheduled");
  assert.equal(slugifyBlogTitle("507f1f77bcf86cd799439011"), "article-507f1f77bcf86cd799439011");
});

test("duplicate titles receive a numeric suffix", async () => {
  const attempts = [];
  const slug = await withUniqueBlogSlug("News & Updates", async (candidate) => {
    attempts.push(candidate);
    if (attempts.length === 1) {
      throw Object.assign(new Error("duplicate"), { code: 11000, keyPattern: { slug: 1 } });
    }
    return candidate;
  });
  assert.equal(slug, "news-updates-2");
  assert.deepEqual(attempts, ["news-updates", "news-updates-2"]);
});

test("public article lookup accepts both slugs and legacy IDs", async () => {
  Blog.updateMany = async () => ({ modifiedCount: 0 });
  const queries = [];
  Blog.findOne = async (query) => {
    queries.push(query);
    return {
      _id: { toString: () => "507f1f77bcf86cd799439011" },
      slug: "news-updates",
      title: "News & Updates",
    };
  };
  const response = {
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };

  await getPublishedPostById({ params: { id: "news-updates" } }, response);
  await getPublishedPostById({ params: { id: "507f1f77bcf86cd799439011" } }, response);
  assert.equal(queries[0].slug, "news-updates");
  assert.equal(queries[1]._id, "507f1f77bcf86cd799439011");
  assert.equal(response.body.post.slug, "news-updates");
});

test("backfill only assigns a slug to records that do not already have one", async () => {
  const calls = [];
  Blog.init = async () => {};
  Blog.find = (query) => {
    assert.deepEqual(query, { slug: { $exists: false } });
    return {
      select() { return this; },
      sort() { return this; },
      async *cursor() {
        yield { _id: "legacy-id", title: "Legacy Post" };
      },
    };
  };
  Blog.updateOne = async (...args) => { calls.push(args); };

  await backfillBlogSlugs();
  assert.deepEqual(calls, [[
    { _id: "legacy-id", slug: { $exists: false } },
    { $set: { slug: "legacy-post" } },
    { timestamps: false },
  ]]);
});