// src/components/admin/blog/DeleteBlogModal.tsx
import React from "react";

export default function DeleteBlogModal({
  post,
  onClose,
}: {
  post: any;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="
          bg-neutral-900 border border-neutral-800
          rounded-2xl p-6 w-full max-w-md
          shadow-[0_8px_40px_rgba(0,0,0,0.35)]
        "
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
      >
        <h2 className="text-white text-xl font-semibold mb-4">
          Delete Blog Post
        </h2>

        <p className="text-neutral-400 mb-6">
          Are you sure you want to delete{" "}
          <span className="text-white font-semibold">{post.title}</span>?  
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
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
              bg-red-600 text-white font-semibold
              hover:bg-red-500 transition
            "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
