import { CalendarClock, Trash2 } from "lucide-react";
import type { BlogPost } from "../../../types/blog";

interface ScheduledBlogsTableProps {
  blogs: BlogPost[];
  onDelete: (blog: BlogPost) => void;
}

export default function ScheduledBlogsTable({
  blogs,
  onDelete,
}: ScheduledBlogsTableProps) {
  if (blogs.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 px-6 py-12">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-700 bg-neutral-800">
            <CalendarClock className="h-5 w-5 text-neutral-300" />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-white">
            No Scheduled Blogs
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-neutral-500">
            Blogs scheduled for future publication will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
      <div className="hidden md:grid md:grid-cols-[1.5fr_1fr_1fr_auto] gap-4 border-b border-neutral-800 px-6 py-3 text-xs uppercase tracking-widest text-neutral-600">
        <span>Blog</span>
        <span>Category</span>
        <span>Scheduled For</span>
        <span>Actions</span>
      </div>

      <div className="divide-y divide-neutral-800">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="
              grid
              grid-cols-1
              gap-4
              px-6
              py-5
              md:grid-cols-[1.5fr_1fr_1fr_auto]
              md:items-center
            "
          >
            <div>
              <p className="font-medium text-white">
                {blog.title}
              </p>

              {blog.author && (
                <p className="mt-1 text-sm text-neutral-500">
                  {blog.author}
                </p>
              )}
            </div>

            <div className="text-sm text-neutral-400">
              {blog.category || "Uncategorized"}
            </div>

            <div>
              <p className="text-sm text-neutral-300">
                {blog.scheduledAt
                  ? new Date(blog.scheduledAt).toLocaleString()
                  : "No schedule set"}
              </p>

              <span className="mt-1 inline-flex rounded-full border border-neutral-800 bg-neutral-950 px-2.5 py-1 text-xs text-neutral-500">
                Scheduled
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onDelete(blog)}
                className="inline-flex items-center gap-2 rounded-lg border border-red-900/50 px-3 py-2 text-sm text-red-300 transition hover:bg-red-950/40"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}