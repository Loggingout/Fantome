// src/components/admin/blog/EditBlogForm.tsx
import React from "react";
import BlogEditor from "./BlogEditor";

interface EditBlogFormProps {
  post: any;
  onClose: () => void;
}

export default function EditBlogForm({ post, onClose }: EditBlogFormProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="
          bg-neutral-900 border border-neutral-800
          rounded-2xl p-6 w-full max-w-3xl
          shadow-[0_8px_40px_rgba(0,0,0,0.35)]
        "
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
      >
        <h2 className="text-white text-xl font-semibold mb-4">
          Edit Blog Post
        </h2>

        {/* Title */}
        <input
          defaultValue={post.title}
          placeholder="Post Title"
          className="
            w-full mb-4 px-4 py-3 rounded-xl
            bg-neutral-800 border border-neutral-700
            text-white placeholder-neutral-500
          "
        />

        {/* Editor */}
        <BlogEditor initialContent={post.content || ""} />

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-xl
              bg-neutral-800 text-neutral-300
              hover:bg-neutral-700 transition
            "
          >
            Cancel
          </button>

          <button
            className="
              px-4 py-2 rounded-xl
              bg-white text-black font-semibold
              hover:bg-neutral-200 transition
            "
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
