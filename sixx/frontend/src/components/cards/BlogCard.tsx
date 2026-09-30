import { useEffect, useState } from "react";
import api from "../../utils/api";

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  author: string;
  published: boolean;
  createdAt: string;
}

export default function BlogCard() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/blog/all")
      .then((res) => setPosts(res.data.posts.slice(0, 5)))
      .catch((err) => console.error("BlogCard fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-3 shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      <p className="text-neutral-500 text-xs tracking-widest uppercase">
        Latest Blog Posts
      </p>

      {loading ? (
        <p className="text-neutral-500 text-sm">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-neutral-500 text-sm">No blog posts yet.</p>
      ) : (
        <ul className="mt-2 space-y-3">
          {posts.map((post) => (
            <li key={post._id} className="flex flex-col gap-0.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-white font-medium truncate">{post.title}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                  post.published ? "bg-emerald-900/40 text-emerald-400" : "bg-neutral-800 text-neutral-500"
                }`}>
                  {post.published ? "Published" : "Draft"}
                </span>
              </div>
              {post.excerpt && (
                <p className="text-xs text-neutral-500 line-clamp-1">{post.excerpt}</p>
              )}
              <p className="text-xs text-neutral-600">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}