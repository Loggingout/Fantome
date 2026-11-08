import mongoose from "mongoose";

const blogReactionSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
    voterId: { type: String, required: true, trim: true, maxlength: 64 },
    reaction: { type: String, enum: ["like", "dislike"], required: true },
  },
  { timestamps: true }
);

blogReactionSchema.index({ post: 1, voterId: 1 }, { unique: true });

export const BlogReaction = mongoose.model("BlogReaction", blogReactionSchema);
