import { useEffect, useRef, useState } from "react";
import { Check, Copy, Link2, Mail, MessageSquare, Share2, X } from "lucide-react";

interface ShareArticleButtonProps {
  title: string;
  text: string;
  url: string;
}

const SHARE_LINKS: Array<{
  id: string;
  label: string;
  icon: typeof Link2;
  href: (url: string, title: string, text: string) => string;
}> = [
  {
    id: "x",
    label: "X",
    icon: X,
    href: (url, title) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: Share2,
    href: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: Share2,
    href: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    id: "email",
    label: "Email",
    icon: Mail,
    href: (url, title, text) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
  },
  {
    id: "sms",
    label: "SMS",
    icon: MessageSquare,
    href: (url, title, text) =>
      `sms:?&body=${encodeURIComponent(`${title} — ${text}\n${url}`)}`,
  },
];

export default function ShareArticleButton({ title, text, url }: ShareArticleButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const canNativeShare =
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function";

  const handleShare = async () => {
    if (canNativeShare) {
      try {
        await navigator.share({ title, text, url });
      } catch (error) {
        // User closed the native share sheet; not an error state.
        if ((error as Error)?.name !== "AbortError") {
          console.error("Share failed:", error);
        }
      }
      return;
    }
    setOpen((prev) => !prev);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked (insecure context); leave the link in the menu.
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => void handleShare()}
        aria-haspopup={canNativeShare ? undefined : "menu"}
        aria-expanded={canNativeShare ? undefined : open}
        className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-3.5 py-1.5 text-xs font-medium text-neutral-300 transition hover:border-neutral-600 hover:text-white"
      >
        <Share2 className="h-3.5 w-3.5" />
        Share
      </button>

      {open && !canNativeShare && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-neutral-800 bg-neutral-950 p-2 shadow-2xl"
        >
          {SHARE_LINKS.map((shareLink) => {
            const Icon = shareLink.icon;
            return (
              <a
                key={shareLink.id}
                role="menuitem"
                href={shareLink.href(url, title, text)}
                target={shareLink.id === "email" || shareLink.id === "sms" ? undefined : "_blank"}
                rel={shareLink.id === "email" || shareLink.id === "sms" ? undefined : "noopener noreferrer"}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-neutral-300 transition hover:bg-neutral-900 hover:text-white"
              >
                <Icon className="h-4 w-4 shrink-0" />
                {shareLink.label}
              </a>
            );
          })}

          <button
            type="button"
            role="menuitem"
            onClick={() => void handleCopy()}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-neutral-300 transition hover:bg-neutral-900 hover:text-white"
          >
            {copied ? (
              <Check className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4 shrink-0" />
            )}
            {copied ? "Link copied" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}
