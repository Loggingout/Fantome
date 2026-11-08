import mongoose from "mongoose";
import { Blog } from "../models/Blog.js";
import { BlogRead } from "../models/BlogRead.js";
import { BlogReaction } from "../models/BlogReaction.js";
import { isProductionAnalyticsSource } from "../utils/analyticsSource.js";

export async function recordBlogRead(req, res) {
  if (req.user?.role === "admin" || !isProductionAnalyticsSource(req)) return res.status(204).end();

  const { viewId, durationMs = 0 } = req.body ?? {};
  if (!mongoose.isValidObjectId(req.params.id) ||
      typeof viewId !== "string" || !/^[a-f\d]{32}$/i.test(viewId) ||
      !Number.isInteger(durationMs) || durationMs < 0 || durationMs > 8 * 60 * 60 * 1000) {
    return res.status(400).json({ message: "Invalid article read event." });
  }

  try {
    const post = await Blog.exists({
      _id: req.params.id,
      published: true,
      $or: [{ scheduledAt: null }, { scheduledAt: { $lte: new Date() } }],
    });
    if (!post) return res.status(404).json({ message: "Article not found." });

    await BlogRead.updateOne(
      { post: post._id, viewId },
      { $inc: { durationMs } },
      { upsert: true, setDefaultsOnInsert: true },
    );
    return res.status(204).end();
  } catch (error) {
    console.error("recordBlogRead error:", error);
    return res.status(500).json({ message: "Unable to record article read." });
  }
}

export async function getBlogAnalytics(_req, res) {
  try {
    const [posts, reads, reactions] = await Promise.all([
      Blog.find({ published: true }).select("title slug inflatedLikes inflatedDislikes").sort({ title: 1 }).lean(),
      BlogRead.aggregate([
        { $group: { _id: "$post", opens: { $sum: 1 }, readTimeMs: { $sum: "$durationMs" } } },
      ]),
      BlogReaction.aggregate([
        { $group: { _id: { post: "$post", reaction: "$reaction" }, count: { $sum: 1 } } },
      ]),
    ]);
    const readByPost = new Map(reads.map((row) => [String(row._id), row]));
    const reactionByPost = new Map();
    for (const row of reactions) {
      const id = String(row._id.post);
      const counts = reactionByPost.get(id) || { likes: 0, dislikes: 0 };
      counts[row._id.reaction === "like" ? "likes" : "dislikes"] = row.count;
      reactionByPost.set(id, counts);
    }

    return res.status(200).json(posts.map((post) => {
      const id = String(post._id);
      const read = readByPost.get(id);
      const counts = reactionByPost.get(id) || { likes: 0, dislikes: 0 };
      return {
        id,
        slug: post.slug || id,
        title: post.title,
        opens: read?.opens || 0,
        readTimeMs: read?.readTimeMs || 0,
        realLikes: counts.likes,
        realDislikes: counts.dislikes,
        inflatedLikes: post.inflatedLikes || 0,
        inflatedDislikes: post.inflatedDislikes || 0,
      };
    }));
  } catch (error) {
    console.error("getBlogAnalytics error:", error);
    return res.status(500).json({ message: "Unable to retrieve article analytics." });
  }
}

export async function updateBlogInflation(req, res) {
  const { inflatedLikes, inflatedDislikes } = req.body ?? {};
  if (!mongoose.isValidObjectId(req.params.id) ||
      ![inflatedLikes, inflatedDislikes].every((value) => Number.isSafeInteger(value) && value >= 0 && value <= 1000000)) {
    return res.status(400).json({ message: "Adjustments must be whole numbers between 0 and 1,000,000." });
  }

  try {
    const post = await Blog.findOneAndUpdate(
      { _id: req.params.id, published: true },
      { $set: { inflatedLikes, inflatedDislikes } },
      { new: true, runValidators: true, timestamps: false },
    );
    if (!post) return res.status(404).json({ message: "Article not found." });
    return res.status(200).json({ inflatedLikes: post.inflatedLikes, inflatedDislikes: post.inflatedDislikes });
  } catch (error) {
    console.error("updateBlogInflation error:", error);
    return res.status(500).json({ message: "Unable to update article adjustments." });
  }
}