import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { Blog } from "../backend/models/Blog.js";
import { BlogRead } from "../backend/models/BlogRead.js";
import { BlogReaction } from "../backend/models/BlogReaction.js";
import { getBlogAnalytics, recordBlogRead, updateBlogInflation } from "../backend/controllers/blogAnalyticsController.js";
import { getBlogReactionSummary, setBlogReaction } from "../backend/controllers/blogReactionController.js";

const postId = "507f1f77bcf86cd799439011";
const voterId = "a".repeat(32);
const response = () => ({
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; },
  end() { return this; },
});

afterEach(() => mock.restoreAll());

test("authenticated admin activity does not create reads or votes", async () => {
  const read = mock.method(BlogRead, "updateOne", async () => {});
  const res = response();
  await recordBlogRead({ user: { role: "admin" } }, res);
  assert.equal(res.statusCode, 204);
  assert.equal(read.mock.callCount(), 0);

  const voteResponse = response();
  await setBlogReaction({ user: { role: "admin" }, body: {} }, voteResponse);
  assert.equal(voteResponse.statusCode, 403);
});

test("Codespaces article reads are not stored", async () => {
  const read = mock.method(BlogRead, "updateOne", async () => {});
  const res = response();
  await recordBlogRead({ get: () => "https://workspace-5173.app.github.dev" }, res);
  assert.equal(res.statusCode, 204);
  assert.equal(read.mock.callCount(), 0);
});

test("reader opens and duration use the same per-view record", async () => {
  mock.method(Blog, "exists", async () => ({ _id: postId }));
  const update = mock.method(BlogRead, "updateOne", async () => {});
  for (const durationMs of [0, 2500]) {
    const res = response();
    await recordBlogRead({ get: () => "https://www.fantometechnologies.com", params: { id: postId }, body: { viewId: voterId, durationMs } }, res);
    assert.equal(res.statusCode, 204);
  }
  assert.deepEqual(update.mock.calls[0].arguments[0], update.mock.calls[1].arguments[0]);
  assert.deepEqual(update.mock.calls[1].arguments[1], { $inc: { durationMs: 2500 } });
});

test("public totals include adjustments while analytics reports genuine reactions separately", async () => {
  const post = { _id: postId, title: "Article", slug: "article", inflatedLikes: 7, inflatedDislikes: 3 };
  mock.method(Blog, "findOne", () => ({ select: async () => post }));
  mock.method(BlogReaction, "countDocuments", async ({ reaction }) => reaction === "like" ? 2 : 1);
  mock.method(BlogReaction, "findOne", () => ({ select: () => ({ lean: async () => null }) }));
  const publicResponse = response();
  await getBlogReactionSummary({ params: { id: postId }, query: { voterId } }, publicResponse);
  assert.deepEqual(publicResponse.body, { likes: 9, dislikes: 4, reaction: null });

  mock.method(Blog, "find", () => ({ select() { return this; }, sort() { return this; }, lean: async () => [post] }));
  mock.method(BlogRead, "aggregate", async () => [{ _id: postId, opens: 2, readTimeMs: 5000 }]);
  mock.method(BlogReaction, "aggregate", async () => [
    { _id: { post: postId, reaction: "like" }, count: 2 },
    { _id: { post: postId, reaction: "dislike" }, count: 1 },
  ]);
  const adminResponse = response();
  await getBlogAnalytics({}, adminResponse);
  assert.deepEqual(adminResponse.body[0], {
    id: postId, slug: "article", title: "Article", opens: 2, readTimeMs: 5000,
    realLikes: 2, realDislikes: 1, inflatedLikes: 7, inflatedDislikes: 3,
  });
});

test("invalid adjustments are rejected before database updates", async () => {
  const update = mock.method(Blog, "findOneAndUpdate", async () => {});
  const res = response();
  await updateBlogInflation({ params: { id: postId }, body: { inflatedLikes: -1, inflatedDislikes: 0 } }, res);
  assert.equal(res.statusCode, 400);
  assert.equal(update.mock.callCount(), 0);
});