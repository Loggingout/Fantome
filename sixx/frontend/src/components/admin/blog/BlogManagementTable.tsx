import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";

import { deleteBlogPost, getAdminBlogPosts } from "../../../services/blogService";
import type { BlogPost } from "../../../types/blog";

function postStatus(post: BlogPost) {
  if (post.published) return "Published";
  if (post.scheduledAt) return "Scheduled";
  return "Draft";
}

function postDate(post: BlogPost) {
  const date = post.publishedAt ?? post.scheduledAt ?? post.updatedAt ?? post.createdAt;
  return date ? new Date(date).toLocaleString() : "—";
}

export default function BlogManagementTable({ showOnlyDrafts = false }: { showOnlyDrafts?: boolean }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;
    getAdminBlogPosts()
      .then((data) => {
        if (isCurrent) setPosts(data);
      })
      .catch((loadError) => {
        if (isCurrent) setError(loadError instanceof Error ? loadError.message : "Unable to load blog posts.");
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, []);

  const handleDelete = async (post: BlogPost) => {
    if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return;
    try {
      await deleteBlogPost(post.id);
      setPosts((current) => current.filter((item) => item.id !== post.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete the post.");
    }
  };

  if (isLoading) {
    return <p role="status" className="text-sm text-neutral-400">Loading blog posts...</p>;
  }

  const visiblePosts = showOnlyDrafts
    ? posts.filter((post) => !post.published && !post.scheduledAt)
    : posts;

  return (
    <div className="space-y-4">
      {error && <p role="alert" className="rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-300">{error}</p>}
      {visiblePosts.length === 0 ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-6 py-12 text-center">
          <p className="text-neutral-300">{showOnlyDrafts ? "No saved drafts yet." : "No posts have been created yet."}</p>
          <Link to="/admin/blog" className="mt-4 inline-flex rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600">Create a post</Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
          <div className="hidden grid-cols-[minmax(0,1fr)_10rem_9rem_12rem_auto] gap-4 border-b border-neutral-800 px-5 py-3 text-xs uppercase tracking-widest text-neutral-500 md:grid">
            <span>Title</span><span>Category</span><span>Status</span><span>Date</span><span>Actions</span>
          </div>
          <div className="divide-y divide-neutral-800">
            {visiblePosts.map((post) => {
              const status = postStatus(post);
              return (
                <div key={post.id} className="grid gap-3 px-5 py-4 md:grid-cols-[minmax(0,1fr)_10rem_9rem_12rem_auto] md:items-center md:gap-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">{post.title}</p>
                    <p className="mt-1 text-xs text-neutral-500">{post.author}</p>
                  </div>
                  <span className="text-sm text-neutral-400">{post.category || "General"}</span>
                  <span className={`w-fit rounded-full border px-2.5 py-1 text-xs ${status === "Published" ? "border-emerald-900/60 bg-emerald-950/30 text-emerald-300" : status === "Scheduled" ? "border-amber-900/60 bg-amber-950/30 text-amber-300" : "border-neutral-700 bg-neutral-950 text-neutral-400"}`}>{status}</span>
                  <span className="text-sm text-neutral-500">{postDate(post)}</span>
                  <div className="flex items-center gap-2">
                    {showOnlyDrafts && (
                      <Link
                        to={`/admin/blog/${post.id}/edit`}
                        aria-label={`Continue editing ${post.title}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-800"
                      >
                        <Pencil className="h-4 w-4" />
                        Continue
                      </Link>
                    )}
                    {post.published && <Link to={`/blog/${post.id}`} aria-label={`View ${post.title}`} className="rounded-lg border border-neutral-700 p-2 text-neutral-300 hover:bg-neutral-800"><Eye className="h-4 w-4" /></Link>}
                    <button type="button" onClick={() => void handleDelete(post)} aria-label={`Delete ${post.title}`} className="rounded-lg border border-red-900/50 p-2 text-red-300 hover:bg-red-950/40"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
