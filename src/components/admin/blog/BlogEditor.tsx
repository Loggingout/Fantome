// src/components/admin/blog/BlogEditor.tsx
import React, { useState } from "react";

interface BlogEditorProps {
  initialContent?: string;
}

export default function BlogEditor({ initialContent = "" }: BlogEditorProps) {
  const [content, setContent] = useState(initialContent);

  const applyFormat = (command: string) => {
    document.execCommand(command, false);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div
        className="
          flex items-center gap-2 p-2 rounded-xl
          bg-neutral-800 border border-neutral-700
        "
      >
        <button
          onClick={() => applyFormat("bold")}
          className="px-2 py-1 text-white hover:text-neutral-300"
        >
          <b>B</b>
        </button>

        <button
          onClick={() => applyFormat("italic")}
          className="px-2 py-1 text-white hover:text-neutral-300 italic"
        >
          I
        </button>

        <button
          onClick={() => applyFormat("underline")}
          className="px-2 py-1 text-white hover:text-neutral-300 underline"
        >
          U
        </button>

        <button
          onClick={() => applyFormat("insertUnorderedList")}
          className="px-2 py-1 text-white hover:text-neutral-300"
        >
          • List
        </button>

        <button
          onClick={() => applyFormat("formatBlock", "<h2>")}
          className="px-2 py-1 text-white hover:text-neutral-300"
        >
          H2
        </button>

        <button
          onClick={() => applyFormat("formatBlock", "<pre>")}
          className="px-2 py-1 text-white hover:text-neutral-300"
        >
          Code
        </button>
      </div>

      {/* Editor */}
      <div
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => setContent(e.currentTarget.innerHTML)}
        className="
          min-h-[200px] p-4 rounded-xl
          bg-neutral-900 border border-neutral-800
          text-white leading-relaxed
          focus:outline-none
        "
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
