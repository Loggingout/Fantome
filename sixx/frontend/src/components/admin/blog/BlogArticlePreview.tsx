import BlogArticleBody from "../../blog/BlogArticleBody";

interface BlogArticlePreviewProps {
  title: string;
  excerpt: string;
  category: string;
  image: string;
  author: string;
  content: string;
}

export default function BlogArticlePreview({
  title,
  excerpt,
  category,
  image,
  author,
  content,
}: BlogArticlePreviewProps) {
  return (
    <article className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
      {image && (
        <img src={image} alt={title || "Article cover"} className="aspect-[16/9] w-full object-cover" />
      )}
      <div className="px-6 py-8 sm:px-10 sm:py-12">
        <div className="mb-5 flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-neutral-500">
          <span className="text-red-400">{category || "General"}</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-neutral-600" />
          <span>{author || "Fantome Technologies"}</span>
        </div>
        <h1 className="text-3xl font-semibold leading-tight text-white sm:text-5xl">
          {title || "Untitled article"}
        </h1>
        {excerpt && <p className="mt-5 text-lg leading-relaxed text-neutral-400">{excerpt}</p>}
        <div className="mt-9">
          <BlogArticleBody content={content} />
        </div>
      </div>
    </article>
  );
}
