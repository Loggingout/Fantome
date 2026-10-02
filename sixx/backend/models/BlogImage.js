import mongoose from "mongoose";

const blogImageSchema = new mongoose.Schema(
  {
    contentType: {
      type: String,
      enum: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      required: true,
    },
    data: { type: Buffer, required: true },
    originalName: { type: String, default: "" },
  },
  { timestamps: true }
);

export const BlogImage = mongoose.model("BlogImage", blogImageSchema);
