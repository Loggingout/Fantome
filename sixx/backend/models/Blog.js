import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    category: { type: String, default: "General" },
    image: { type: String, default: "" },
    author: { type: String, default: "Fantome Technologies" },
    published: { type: Boolean, default: false },
    scheduledAt: { type: Date, default: null, index: true },
    publishedAt: { type: Date, default: null },
    newsletterDispatchedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Blog = mongoose.model("Blog", blogSchema);
