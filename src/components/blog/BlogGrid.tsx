// src/components/blog/BlogGrid.tsx
import React from "react";
import BlogCard from "./BlogCard";

const MOCK_POSTS = [
  {
    id: "1",
    title: "Designing for the Future: Fantome’s UI Philosophy",
    excerpt:
      "A deep dive into the design principles that guide Fantome’s modern digital experiences.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    category: "Design",
    date: "May 18, 2026",
  },
  {
    id: "2",
    title: "AI and Creativity: How Fantome Blends Art with Engineering",
    excerpt:
      "Exploring the intersection of artificial intelligence and creative expression.",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    category: "AI",
    date: "May 15, 2026",
  },
  {
    id: "3",
    title: "Building Scalable Web Apps with Modern Architecture",
    excerpt:
      "A breakdown of the engineering patterns Fantome uses to build fast, scalable systems.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    category: "Development",
    date: "May 10, 2026",
  },
];

export default function BlogGrid() {
  return (
    <div
      className="
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
        gap-8
      "
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {MOCK_POSTS.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
