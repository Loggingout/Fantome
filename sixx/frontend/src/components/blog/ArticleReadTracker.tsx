import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { recordArticleRead } from "../../services/blogAnalyticsService";
import { isAnalyticsHost } from "../../utils/websiteAnalyticsPolicy";

export default function ArticleReadTracker({ postId }: { postId: string }) {
  const { user } = useUser();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (isAdmin || !isAnalyticsHost(window.location.hostname, import.meta.env.PROD)) return;

    const viewId = crypto.randomUUID().replaceAll("-", "");
    let activeSince: number | null = document.visibilityState === "visible" ? Date.now() : null;
    recordArticleRead(postId, viewId, 0);

    const flush = () => {
      if (activeSince === null) return;
      const duration = Math.min(Date.now() - activeSince, 8 * 60 * 60 * 1000);
      activeSince = null;
      if (duration > 0) recordArticleRead(postId, viewId, duration);
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") activeSince = Date.now();
      else flush();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pagehide", flush);
    return () => {
      flush();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", flush);
    };
  }, [postId, isAdmin]);

  return null;
}