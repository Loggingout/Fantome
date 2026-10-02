import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";

import { uploadBlogImage } from "../../../services/blogService";

interface BlogRichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onImageUploaded?: (imageUrl: string) => void;
}

const toolbarButtonClass =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40";

export default function BlogRichTextEditor({
  content,
  onChange,
  onImageUploaded,
}: BlogRichTextEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false },
      }),
      Placeholder.configure({ placeholder: "Start writing your article..." }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: { class: "my-8 h-auto max-w-full rounded-lg" },
      }),
    ],
    content,
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "min-h-[420px] px-5 py-6 text-base leading-8 text-neutral-200 outline-none [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-white [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white [&_p]:mb-5 [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-7 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-7 [&_li]:pl-1 [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-red-700 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-neutral-400 [&_a]:text-red-300 [&_a]:underline",
      },
    },
  });

  useEffect(() => {
    if (!editor || editor.getHTML() === content) return;
    editor.commands.setContent(content, { emitUpdate: false });
  }, [content, editor]);

  const runCommand = (command: () => void) => (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    command();
  };

  const chooseLink = () => {
    const currentHref = editor?.getAttributes("link").href as string | undefined;
    const href = window.prompt("Link URL", currentHref ?? "https://");
    if (href === null || !editor) return;
    if (!href.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: href.trim() }).run();
  };

  const handleImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file || !editor) return;

    setImageError(null);
    setIsUploadingImage(true);
    try {
      const imageUrl = await uploadBlogImage(file);
      editor.chain().focus().setImage({ src: imageUrl, alt: file.name }).run();
      onImageUploaded?.(imageUrl);
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
      <div className="flex flex-wrap items-center gap-1 border-b border-neutral-800 bg-neutral-900 p-2">
        <button type="button" title="Bold" aria-label="Bold" className={`${toolbarButtonClass} ${editor.isActive("bold") ? "bg-neutral-700 text-white" : ""}`} onMouseDown={(event) => event.preventDefault()} onClick={runCommand(() => editor.chain().focus().toggleBold().run())}><strong>B</strong></button>
        <button type="button" title="Italic" aria-label="Italic" className={`${toolbarButtonClass} ${editor.isActive("italic") ? "bg-neutral-700 text-white" : ""}`} onMouseDown={(event) => event.preventDefault()} onClick={runCommand(() => editor.chain().focus().toggleItalic().run())}><em>I</em></button>
        <button type="button" title="Underline" aria-label="Underline" className={`${toolbarButtonClass} ${editor.isActive("underline") ? "bg-neutral-700 text-white" : ""}`} onMouseDown={(event) => event.preventDefault()} onClick={runCommand(() => editor.chain().focus().toggleUnderline().run())}><span className="underline">U</span></button>
        <button type="button" title="Strikethrough" aria-label="Strikethrough" className={`${toolbarButtonClass} ${editor.isActive("strike") ? "bg-neutral-700 text-white" : ""}`} onMouseDown={(event) => event.preventDefault()} onClick={runCommand(() => editor.chain().focus().toggleStrike().run())}><s>S</s></button>
        <span className="mx-1 h-6 border-l border-neutral-700" />
        <button type="button" title="Heading 2" aria-label="Heading 2" className={`${toolbarButtonClass} ${editor.isActive("heading", { level: 2 }) ? "bg-neutral-700 text-white" : ""}`} onMouseDown={(event) => event.preventDefault()} onClick={runCommand(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}>H2</button>
        <button type="button" title="Heading 3" aria-label="Heading 3" className={`${toolbarButtonClass} ${editor.isActive("heading", { level: 3 }) ? "bg-neutral-700 text-white" : ""}`} onMouseDown={(event) => event.preventDefault()} onClick={runCommand(() => editor.chain().focus().toggleHeading({ level: 3 }).run())}>H3</button>
        <span className="mx-1 h-6 border-l border-neutral-700" />
        <button type="button" title="Bulleted list" aria-label="Bulleted list" className={`${toolbarButtonClass} ${editor.isActive("bulletList") ? "bg-neutral-700 text-white" : ""}`} onMouseDown={(event) => event.preventDefault()} onClick={runCommand(() => editor.chain().focus().toggleBulletList().run())}>• List</button>
        <button type="button" title="Numbered list" aria-label="Numbered list" className={`${toolbarButtonClass} ${editor.isActive("orderedList") ? "bg-neutral-700 text-white" : ""}`} onMouseDown={(event) => event.preventDefault()} onClick={runCommand(() => editor.chain().focus().toggleOrderedList().run())}>1. List</button>
        <button type="button" title="Quote" aria-label="Quote" className={`${toolbarButtonClass} ${editor.isActive("blockquote") ? "bg-neutral-700 text-white" : ""}`} onMouseDown={(event) => event.preventDefault()} onClick={runCommand(() => editor.chain().focus().toggleBlockquote().run())}>Quote</button>
        <span className="mx-1 h-6 border-l border-neutral-700" />
        <button type="button" title="Add link" aria-label="Add link" className={toolbarButtonClass} onMouseDown={(event) => event.preventDefault()} onClick={chooseLink}>Link</button>
        <button type="button" title="Upload inline image" aria-label="Upload inline image" className={toolbarButtonClass} disabled={isUploadingImage} onMouseDown={(event) => event.preventDefault()} onClick={() => imageInputRef.current?.click()}>{isUploadingImage ? "Compressing..." : "Image"}</button>
        <input ref={imageInputRef} type="file" accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleImage} />
        <span className="mx-1 h-6 border-l border-neutral-700" />
        <button type="button" title="Undo" aria-label="Undo" className={toolbarButtonClass} disabled={!editor.can().undo()} onMouseDown={(event) => event.preventDefault()} onClick={runCommand(() => editor.chain().focus().undo().run())}>Undo</button>
        <button type="button" title="Redo" aria-label="Redo" className={toolbarButtonClass} disabled={!editor.can().redo()} onMouseDown={(event) => event.preventDefault()} onClick={runCommand(() => editor.chain().focus().redo().run())}>Redo</button>
      </div>

      {imageError && <p role="alert" className="border-b border-red-900/50 bg-red-950/20 px-4 py-2 text-sm text-red-300">{imageError}</p>}
      <EditorContent editor={editor} />
    </div>
  );
}
