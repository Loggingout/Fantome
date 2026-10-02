import DOMPurify from "dompurify";

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
        <div
          className="mt-9 text-base leading-8 text-neutral-300 [&_a]:text-red-300 [&_a]:underline [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-red-700 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mb-4 [&_h2]:mt-9 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-white [&_h3]:mb-3 [&_h3]:mt-7 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-white [&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_li]:mb-2 [&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:pl-7 [&_p]:mb-5 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-7"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
        />
      </div>
    </article>
  );
}
