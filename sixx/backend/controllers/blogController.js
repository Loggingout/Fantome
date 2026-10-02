import { Blog } from "../models/Blog.js";
import mongoose from "mongoose";
import { BlogImage } from "../models/BlogImage.js";

const serializePost = (post) => ({
  id: post._id.toString(),
  title: post.title,
  excerpt: post.excerpt,
  content: post.content,
  category: post.category,
  image: post.image,
  author: post.author,
  published: post.published,
  scheduledAt: post.scheduledAt?.toISOString() ?? null,
  publishedAt: post.publishedAt?.toISOString() ?? null,
  createdAt: post.createdAt?.toISOString() ?? null,
  updatedAt: post.updatedAt?.toISOString() ?? null,
});

// GET /api/blog  — public, published posts only
export const getPublishedPosts = async (req, res) => {
  try {
    await publishDueBlogPosts();
    const posts = await Blog.find({
      published: true,
      $or: [{ scheduledAt: null }, { scheduledAt: { $lte: new Date() } }],
    }).sort({ publishedAt: -1, createdAt: -1 });
    return res.status(200).json({ success: true, posts: posts.map(serializePost) });
  } catch (err) {
    console.error("getPublishedPosts error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getPublishedPostById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }

  try {
    await publishDueBlogPosts();
    const post = await Blog.findOne({
      _id: req.params.id,
      published: true,
      $or: [{ scheduledAt: null }, { scheduledAt: { $lte: new Date() } }],
    });
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    return res.status(200).json({ success: true, post: serializePost(post) });
  } catch (err) {
    console.error("getPublishedPostById error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/blog/all  — admin, all posts including drafts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Blog.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, posts: posts.map(serializePost) });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getScheduledPosts = async (req, res) => {
  try {
    const posts = await Blog.find({
      published: false,
      scheduledAt: { $ne: null },
    }).sort({ scheduledAt: 1 });
    return res.status(200).json({ success: true, posts: posts.map(serializePost) });
  } catch (err) {
    console.error("getScheduledPosts error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/blog  — admin creates a post
export const createPost = async (req, res) => {
  try {
    const { title, excerpt, content, category, image, author, published, scheduledAt } = req.body;
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const scheduleDate = scheduledAt ? new Date(scheduledAt) : null;
    if (scheduledAt && (!scheduleDate || Number.isNaN(scheduleDate.getTime()))) {
      return res.status(400).json({ success: false, message: "Scheduled date is invalid" });
    }
    if (scheduleDate && scheduleDate <= new Date()) {
      return res.status(400).json({ success: false, message: "Scheduled date must be in the future" });
    }

    const shouldPublish = Boolean(published) && !scheduleDate;
    const post = await Blog.create({
      title: title.trim(),
      excerpt,
      content,
      category,
      image,
      author,
      published: shouldPublish,
      scheduledAt: scheduleDate,
      publishedAt: shouldPublish ? new Date() : null,
    });
    return res.status(201).json({ success: true, post: serializePost(post) });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /api/blog/:id  — admin updates a post
export const updatePost = async (req, res) => {
  try {
    const { title, excerpt, content, category, image, author, published, scheduledAt } = req.body;
    const updates = {};

    for (const [key, value] of Object.entries({ title, excerpt, content, category, image, author })) {
      if (value !== undefined) updates[key] = value;
    }

    if (scheduledAt !== undefined) {
      const scheduleDate = scheduledAt ? new Date(scheduledAt) : null;
      if (scheduledAt && Number.isNaN(scheduleDate.getTime())) {
        return res.status(400).json({ success: false, message: "Scheduled date is invalid" });
      }
      if (scheduleDate && scheduleDate <= new Date()) {
        return res.status(400).json({ success: false, message: "Scheduled date must be in the future" });
      }
      updates.scheduledAt = scheduleDate;
      if (scheduleDate) {
        updates.published = false;
        updates.publishedAt = null;
      }
    }

    if (published !== undefined) {
      updates.published = Boolean(published);
      updates.publishedAt = published ? new Date() : null;
      if (published) updates.scheduledAt = null;
    }

    const post = await Blog.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    return res.status(200).json({ success: true, post: serializePost(post) });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export async function publishDueBlogPosts() {
  const now = new Date();
  const result = await Blog.updateMany(
    { published: false, scheduledAt: { $ne: null, $lte: now } },
    { $set: { published: true, publishedAt: now } }
  );
  return result.modifiedCount;
}

// DELETE /api/blog/:id  — admin deletes a post
export const deletePost = async (req, res) => {
  try {
    const post = await Blog.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    return res.status(200).json({ success: true, message: "Post deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const uploadBlogImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Choose a supported image file." });
  }

  try {
    const image = await BlogImage.create({
      contentType: req.file.mimetype,
      data: req.file.buffer,
      originalName: req.file.originalname.slice(0, 255),
    });

    return res.status(201).json({ success: true, imageId: image.id });
  } catch (err) {
    console.error("uploadBlogImage error:", err);
    return res.status(500).json({ success: false, message: "Unable to store image." });
  }
};

export const getBlogImage = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).end();
  }

  try {
    const image = await BlogImage.findById(req.params.id).select("contentType data");
    if (!image) return res.status(404).end();

    res.set("Content-Type", image.contentType);
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    return res.send(image.data);
  } catch (err) {
    console.error("getBlogImage error:", err);
    return res.status(500).end();
  }
};
