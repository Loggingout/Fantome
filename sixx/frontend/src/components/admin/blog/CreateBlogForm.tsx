import React from "react";
import BlogEditor from "./BlogEditor";

export default function CreateBlogForm({ onClose }: { onClose: () => void }) {
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
        <h2 className="text-white text-xl font-semibold mb-4">Create New Blog Post</h2>

        <BlogEditor />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
          >
            Cancel
          </button>

          <button className="px-4 py-2 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200">
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}
