import { useEffect, useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";

import {
  getBlogReactionSummary,
  saveBlogReaction,
  type BlogReactionChoice,
  type BlogReactionSummary,
} from "../../services/blogReactionService";

const VOTER_KEY = "fantome-blog-voter-id";
let memoryVoterId = "";

function getVoterId() {
  try {
    const existing = localStorage.getItem(VOTER_KEY);
    if (existing) return existing;

    const voterId = crypto.randomUUID().replaceAll("-", "");
    localStorage.setItem(VOTER_KEY, voterId);
    return voterId;
  } catch {
    if (!memoryVoterId) memoryVoterId = crypto.randomUUID().replaceAll("-", "");
    return memoryVoterId;
  }
}

const emptySummary: BlogReactionSummary = {
  likes: 0,
  dislikes: 0,
  reaction: null,
};

export default function ArticleReactions({ postId }: { postId: string }) {
  const [summary, setSummary] = useState(emptySummary);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    getBlogReactionSummary(postId, getVoterId())
      .then((data) => {
        if (isCurrent) {
          setSummary(data);
          setError(null);
        }
      })
      .catch(() => {
        if (isCurrent) setError("Reactions are unavailable.");
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [postId]);

  const vote = async (choice: Exclude<BlogReactionChoice, null>) => {
    if (isSaving) return;

    setIsSaving(true);
    setError(null);
    try {
      const nextChoice = summary.reaction === choice ? null : choice;
      setSummary(await saveBlogReaction(postId, getVoterId(), nextChoice));
    } catch {
      setError("Your reaction could not be saved. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const buttonClass = (choice: Exclude<BlogReactionChoice, null>) =>
    `inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
      summary.reaction === choice
        ? "border-neutral-600 bg-neutral-800 text-white"
        : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-600 hover:text-white"
    }`;

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Article reactions">
      <button
        type="button"
        onClick={() => void vote("like")}
        disabled={isLoading || isSaving}
        aria-label={`Like article, ${summary.likes} likes`}
        aria-pressed={summary.reaction === "like"}
        className={buttonClass("like")}
      >
        <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{summary.likes}</span>
      </button>
      <button
        type="button"
        onClick={() => void vote("dislike")}
        disabled={isLoading || isSaving}
        aria-label={`Dislike article, ${summary.dislikes} dislikes`}
        aria-pressed={summary.reaction === "dislike"}
        className={buttonClass("dislike")}
      >
        <ThumbsDown className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{summary.dislikes}</span>
      </button>
      {error && (
        <span role="status" className="sr-only">
          {error}
        </span>
      )}
    </div>
  );
}
