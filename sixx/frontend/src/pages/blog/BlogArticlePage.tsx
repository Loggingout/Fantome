import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { Helmet } from "react-helmet-async";

import Navbar from "../../components/header/Navbar";
import Footer from "../../components/footer/Footer";
import { getPublicBlogPost } from "../../services/blogService";
import type { BlogPost } from "../../types/blog";

export default function BlogArticlePage() {
  const { id = "" } = useParams();
  const [result, setResult] = useState<{
    id: string;
    post?: BlogPost;
    error?: string;
  } | null>(null);

  useEffect(() => {
    let isCurrent = true;

    getPublicBlogPost(id)
      .then((data) => {
        if (isCurrent) setResult({ id, post: data });
      })
      .catch(() => {
        if (isCurrent) {
          setResult({ id, error: "This article could not be found or is not published." });
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [id]);

  const isLoading = result?.id !== id;
  const post = result?.id === id ? result.post ?? null : null;
  const error = result?.id === id ? result.error ?? null : null;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Helmet>
        <title>{post ? `${post.title} | Fantome Technologies` : "Blog | Fantome Technologies"}</title>
        {post?.excerpt && <meta name="description" content={post.excerpt} />}
      </Helmet>
      <Navbar />
      <main className="mx-auto min-h-[60vh] max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <Link to="/blog" className="mb-8 inline-flex text-sm text-neutral-400 transition hover:text-white">← All articles</Link>
        {isLoading ? (
          <p role="status" className="mt-8 text-neutral-400">Loading article...</p>
        ) : error || !post ? (
          <p role="alert" className="mt-8 rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-neutral-300">{error ?? "Article unavailable."}</p>
        ) : (
          <article className="mx-auto max-w-3xl">
            {post.image && <img src={post.image} alt={post.title} className="mb-8 aspect-[16/9] w-full rounded-xl border border-neutral-800 object-cover" />}
            <div className="mb-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-neutral-500">
              <span className="text-red-400">{post.category}</span>
              <span aria-hidden="true">·</span>
              <span>{post.author}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.publishedAt ?? undefined}>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Recently published"}</time>
            </div>
            <h1 className="text-3xl font-semibold leading-tight text-white sm:text-5xl">{post.title}</h1>
            {post.excerpt && <p className="mt-5 text-lg leading-relaxed text-neutral-400">{post.excerpt}</p>}
            <div
              className="prose prose-invert mt-10 max-w-none prose-a:text-red-300 prose-blockquote:border-red-700 prose-img:rounded-lg"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
            />
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}
