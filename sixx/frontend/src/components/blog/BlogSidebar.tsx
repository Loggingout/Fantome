// src/components/blog/BlogSidebar.tsx
import { useState } from "react";
import RecentPosts from "./RecentPosts";
import BlogTags from "./BlogTags";
import type { BlogPost } from "../../types/blog";
import { subscribeToBlogUpdates } from "../../services/marketingService";

interface BlogSidebarProps {
  posts: BlogPost[];
  categories: string[];
  onSelectCategory: (category: string) => void;
}

export default function BlogSidebar({ posts, categories, onSelectCategory }: BlogSidebarProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const message = await subscribeToBlogUpdates(email);
      setFeedback({ type: "success", message });
      setEmail("");
    } catch (error) {
      setFeedback({ type: "error", message: error instanceof Error ? error.message : "Unable to subscribe right now." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside
      className="
        w-full flex flex-col gap-8
      "
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Recent Posts */}
      <div
        className="
          bg-neutral-900 border border-neutral-800
          rounded-2xl p-5 shadow-[0_8px_40px_rgba(0,0,0,0.35)]
        "
      >
        <h3 className="text-white text-lg font-semibold mb-4">
          Recent Posts
        </h3>
        <RecentPosts posts={posts} />
      </div>

      {/* Tags */}
      <div
        className="
          bg-neutral-900 border border-neutral-800
          rounded-2xl p-5 shadow-[0_8px_40px_rgba(0,0,0,0.35)]
        "
      >
        <h3 className="text-white text-lg font-semibold mb-4">
          Tags
        </h3>
        <BlogTags tags={categories} onSelect={onSelectCategory} />
      </div>

      {/* Optional Newsletter Box */}
      <div
        className="
          bg-neutral-900 border border-neutral-800
          rounded-2xl p-5 shadow-[0_8px_40px_rgba(0,0,0,0.35)]
          flex flex-col gap-4
        "
      >
        <h3 className="text-white text-lg font-semibold">
          Stay Updated
        </h3>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Get the latest articles, insights, and updates from Fantome delivered straight to your inbox.
        </p>

        <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Your email"
            autoComplete="email"
            required
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-500"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-60"
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </button>
          {feedback && (
            <p role={feedback.type === "error" ? "alert" : "status"} className={`text-xs ${feedback.type === "error" ? "text-red-300" : "text-emerald-300"}`}>
              {feedback.message}
            </p>
          )}
        </form>
      </div>
    </aside>
  );
}
