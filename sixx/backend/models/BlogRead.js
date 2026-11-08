import mongoose from "mongoose";

const blogReadSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
    viewId: { type: String, required: true, maxlength: 64 },
    durationMs: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

blogReadSchema.index({ post: 1, viewId: 1 }, { unique: true });

export const BlogRead = mongoose.model("BlogRead", blogReadSchema);