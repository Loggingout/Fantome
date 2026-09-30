import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    author: { type: String, default: "Fantome Technologies" },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Blog = mongoose.model("Blog", blogSchema);
