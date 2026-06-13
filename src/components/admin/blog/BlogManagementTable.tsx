import React, { useState } from "react";
import DeleteBlogModal from "./DeleteBlogModal";
import EditBlogForm from "./EditBlogForm";

const MOCK_POSTS = [
  {
    id: "1",
    title: "How Fantome Builds Modern Web Apps",
    author: "Adonis",
    status: "Published",
    date: "May 12, 2026",
  },
  {
    id: "2",
    title: "The Future of AI in Web Development",
    author: "Adonis",
    status: "Draft",
    date: "May 10, 2026",
  },
];

export default function BlogManagementTable() {
  const [editPost, setEditPost] = useState<any>(null);
  const [deletePost, setDeletePost] = useState<any>(null);

  return (
    <div
      className="
        bg-neutral-900 border border-neutral-800
        rounded-2xl p-5 shadow-[0_8px_40px_rgba(0,0,0,0.35)]
        overflow-hidden
      "
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-neutral-500 text-xs uppercase tracking-widest">
              <th className="py-2">Title</th>
              <th className="py-2">Author</th>
              <th className="py-2">Status</th>
              <th className="py-2">Date</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm text-white">
            {MOCK_POSTS.map((post) => (
              <tr key={post.id} className="border-t border-neutral-800">
                <td className="py-3">{post.title}</td>
                <td className="py-3 text-neutral-400">{post.author}</td>
                <td className="py-3">
                  <span
                    className={`
                      px-2 py-1 rounded-lg text-xs
                      ${
                        post.status === "Published"
                          ? "bg-emerald-900/40 text-emerald-400"
                          : "bg-neutral-800 text-neutral-400"
                      }
                    `}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="py-3 text-neutral-500">{post.date}</td>

                <td className="py-3 text-right">
                  <button
                    onClick={() => setEditPost(post)}
                    className="text-blue-400 hover:text-blue-300 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeletePost(post)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden space-y-4">
        {MOCK_POSTS.map((post) => (
          <div
            key={post.id}
            className="
              bg-neutral-950 border border-neutral-800 rounded-xl p-4
              flex flex-col gap-3
            "
          >
            <div>
              <p className="text-white font-semibold">{post.title}</p>
              <p className="text-neutral-500 text-xs">{post.date}</p>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">{post.author}</span>
              <span
                className={`
                  px-2 py-1 rounded-lg text-xs
                  ${
                    post.status === "Published"
                      ? "bg-emerald-900/40 text-emerald-400"
                      : "bg-neutral-800 text-neutral-400"
                  }
                `}
              >
                {post.status}
              </span>
            </div>

            <div className="flex justify-end gap-4 pt-2">
              <button
                onClick={() => setEditPost(post)}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => setDeletePost(post)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editPost && (
        <EditBlogForm post={editPost} onClose={() => setEditPost(null)} />
      )}

      {deletePost && (
        <DeleteBlogModal post={deletePost} onClose={() => setDeletePost(null)} />
      )}
    </div>
  );
}
