// src/pages/blog/BlogPage.tsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "../../components/header/Navbar";
import Footer from "../../components/footer/Footer";
import BlogHero from "../../components/blog/BlogHero";
import BlogSearch from "../../components/blog/BlogSearch";
import BlogCategoryFilter from "../../components/blog/BlogCategoryFilter";
import FeaturedPost from "../../components/blog/FeaturedPost";
import BlogGrid from "../../components/blog/BlogGrid";
import BlogSidebar from "../../components/blog/BlogSidebar";
import { getPublishedBlogPosts } from "../../services/blogService";
import type { BlogPost } from "../../types/blog";

export default function BlogPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    getPublishedBlogPosts()
      .then((publishedPosts) => {
        if (isCurrent) setPosts(publishedPosts);
      })
      .catch(() => {
        if (isCurrent) setError("Blog posts are temporarily unavailable.");
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const categories = ["All", ...new Set(posts.map((post) => post.category).filter(Boolean))];
  const normalizedQuery = query.trim().toLowerCase();
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesQuery = !normalizedQuery ||
      `${post.title} ${post.excerpt} ${post.category} ${post.content}`
        .toLowerCase()
        .includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
  const featuredPost = filteredPosts[0] ?? null;

  return (
    <div
      className="min-h-screen bg-neutral-950 text-white"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Navbar */}
        <Navbar
          onAboutUs={() => navigate("/about")}
          onTestimonial={() => navigate("/testimonials")}
        />

        {/* Hero */}
        <BlogHero />

        {/* Search + Categories */}
        <div className="mt-10 flex flex-col gap-6">
          <BlogSearch value={query} onChange={setQuery} />
          <BlogCategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onChange={setActiveCategory}
          />
        </div>

        {error && (
          <p role="alert" className="mt-8 rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {isLoading ? (
          <p className="mt-12 text-sm text-neutral-400" role="status">Loading published posts...</p>
        ) : filteredPosts.length === 0 ? (
          <p className="mt-12 rounded-xl border border-neutral-800 bg-neutral-900 px-6 py-10 text-sm text-neutral-400">
            {posts.length === 0 ? "No published articles yet." : "No articles match your search."}
          </p>
        ) : (
          <>
            <div className="mt-12">
              <FeaturedPost post={featuredPost} />
            </div>

            <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <BlogGrid posts={filteredPosts.slice(1)} />
              </div>

              <div className="lg:col-span-4">
                <BlogSidebar
                  posts={posts}
                  categories={categories.slice(1)}
                  onSelectCategory={setActiveCategory}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
