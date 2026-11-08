import mongoose from "mongoose";
import { Blog } from "../models/Blog.js";
import { BlogReaction } from "../models/BlogReaction.js";

const isValidVoterId = (value) =>
  typeof value === "string" && /^[a-f\d-]{32,64}$/i.test(value);

async function getReactionSummary(postId, voterId) {
  const [likes, dislikes, current] = await Promise.all([
    BlogReaction.countDocuments({ post: postId, reaction: "like" }),
    BlogReaction.countDocuments({ post: postId, reaction: "dislike" }),
    BlogReaction.findOne({ post: postId, voterId }).select("reaction").lean(),
  ]);

  return { likes, dislikes, reaction: current?.reaction ?? null };
}

async function findPublishedPost(id) {
  if (!mongoose.isValidObjectId(id)) return null;

  return Blog.findOne({
    _id: id,
    published: true,
    $or: [{ scheduledAt: null }, { scheduledAt: { $lte: new Date() } }],
  }).select("_id");
}

export async function getBlogReactionSummary(req, res) {
  const voterId = req.query.voterId;
  if (!isValidVoterId(voterId)) {
    return res.status(400).json({ message: "A valid voter identifier is required." });
  }

  try {
    const post = await findPublishedPost(req.params.id);
    if (!post) return res.status(404).json({ message: "Article not found." });

    return res.status(200).json(await getReactionSummary(post._id, voterId));
  } catch (error) {
    console.error("getBlogReactionSummary error:", error);
    return res.status(500).json({ message: "Unable to retrieve article reactions." });
  }
}

export async function setBlogReaction(req, res) {
  const { voterId, reaction } = req.body ?? {};
  if (!isValidVoterId(voterId) || !["like", "dislike", null].includes(reaction)) {
    return res.status(400).json({ message: "A valid voter identifier and reaction are required." });
  }

  try {
    const post = await findPublishedPost(req.params.id);
    if (!post) return res.status(404).json({ message: "Article not found." });

    if (reaction === null) {
      await BlogReaction.deleteOne({ post: post._id, voterId });
    } else {
      await BlogReaction.updateOne(
        { post: post._id, voterId },
        { $set: { reaction } },
        { upsert: true, runValidators: true },
      );
    }

    return res.status(200).json(await getReactionSummary(post._id, voterId));
  } catch (error) {
    console.error("setBlogReaction error:", error);
    return res.status(500).json({ message: "Unable to save article reaction." });
  }
}
