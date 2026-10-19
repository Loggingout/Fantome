import DOMPurify from "dompurify";

interface BlogArticleBodyProps {
  content: string;
}

/**
 * Renders sanitized article HTML with the same typographic styling used by the
 * admin blog preview, so the public article page matches the preview exactly.
 */
export default function BlogArticleBody({ content }: BlogArticleBodyProps) {
  return (
    <div
      className="text-base leading-8 text-neutral-300 [&_a]:text-red-300 [&_a]:underline [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-red-700 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mb-4 [&_h2]:mt-9 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-white [&_h3]:mb-3 [&_h3]:mt-7 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-white [&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_li]:mb-2 [&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:pl-7 [&_p]:mb-5 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-7"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
    />
  );
}
