import { Blog } from "../models/Blog.js";

// GET /api/blog  — public, published posts only
export const getPublishedPosts = async (req, res) => {
  try {
    const posts = await Blog.find({ published: true }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, posts });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/blog/all  — admin, all posts including drafts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Blog.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, posts });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/blog  — admin creates a post
export const createPost = async (req, res) => {
  try {
    const { title, excerpt, content, author, published } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }
    const post = await Blog.create({ title, excerpt, content, author, published });
    return res.status(201).json({ success: true, post });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /api/blog/:id  — admin updates a post
export const updatePost = async (req, res) => {
  try {
    const post = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    return res.status(200).json({ success: true, post });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

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
