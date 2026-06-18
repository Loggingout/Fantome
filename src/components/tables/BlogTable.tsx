import { useEffect, useState } from "react";
import api from "../../utils/api";
import StatusBadge from "../status/StatusBadge";

interface BlogPost {
  _id: string;
  title: string;
  author: string;
  published: boolean;
  createdAt: string;
}

export default function BlogTable() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/blog/all")
      .then((res) => setPosts(res.data.posts ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const togglePublish = async (id: string, current: boolean) => {
    try {
      await api.patch(`/blog/${id}`, { published: !current });
      setPosts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, published: !current } : p))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deletePost = async (id: string) => {
    try {
      await api.delete(`/blog/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 overflow-x-auto">
      <h2 className="text-xl font-serif text-white mb-4">Blog Posts</h2>

      {loading ? (
        <p className="text-neutral-500 text-sm py-6 text-center">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="text-neutral-500 text-sm py-6 text-center">No blog posts yet.</p>
      ) : (
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="text-neutral-400 border-b border-neutral-700">
              <th className="py-2 pr-6">Title</th>
              <th className="py-2 pr-6">Author</th>
              <th className="py-2 pr-6">Status</th>
              <th className="py-2 pr-6">Date</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p._id} className="border-b border-neutral-800/60 hover:bg-neutral-800/20 transition-colors">
                <td className="py-3 pr-6 text-white font-medium truncate max-w-52">{p.title}</td>
                <td className="py-3 pr-6 text-neutral-400">{p.author}</td>
                <td className="py-3 pr-6">
                  <StatusBadge status={p.published ? "published" : "draft"} />
                </td>
                <td className="py-3 pr-6 text-neutral-400 text-xs">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 flex items-center gap-2">
                  <button
                    onClick={() => togglePublish(p._id, p.published)}
                    className="text-xs px-2 py-1 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white transition"
                  >
                    {p.published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => deletePost(p._id)}
                    className="text-xs px-2 py-1 rounded-lg bg-red-900/30 border border-red-800/40 text-red-400 hover:text-red-300 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}