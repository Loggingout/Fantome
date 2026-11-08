import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageContainer, { SectionHeader } from "../../../components/layout/PageContainer";
import { getBlogAnalytics, type BlogAnalyticsRow } from "../../../services/blogAnalyticsService";

function formatTime(milliseconds: number) {
  const seconds = Math.round(milliseconds / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours ? `${hours}h ${minutes}m` : minutes ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
}

export default function BlogAnalyticsPage() {
  const [articles, setArticles] = useState<BlogAnalyticsRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"opens" | "readTimeMs">("opens");

  useEffect(() => {
    let active = true;
    getBlogAnalytics()
      .then((data) => { if (active) setArticles(data); })
      .catch(() => { if (active) setError("Unable to load article analytics."); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const sorted = [...articles].sort((left, right) => right[sortBy] - left[sortBy]);

  return (
    <PageContainer>
      <SectionHeader title="Opened Blog Posts Analytics" />
      <div className="space-y-5">
        <p className="text-sm text-neutral-400">Reader opens and active read time are tracked from this update onward. Signed-in admin activity and manual adjustments are excluded. Earlier reactions may include admin votes.</p>
        {error && <p role="alert" className="rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-300">{error}</p>}
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-neutral-400">Published articles</p>
          <label className="flex items-center gap-2 text-xs text-neutral-400">
            Sort by
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value as "opens" | "readTimeMs")} className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white">
              <option value="opens">Most opened</option>
              <option value="readTimeMs">Most read time</option>
            </select>
          </label>
        </div>
        {isLoading ? <p role="status" className="text-sm text-neutral-400">Loading article analytics...</p> : !error && articles.length === 0 ? <p className="text-sm text-neutral-400">No published articles yet.</p> : !error && (
          <div className="overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-900">
            <table className="w-full min-w-[48rem] text-left text-sm">
              <thead className="border-b border-neutral-800 text-xs uppercase text-neutral-500">
                <tr><th className="px-5 py-4">Article</th><th className="px-4 py-4">Opens</th><th className="px-4 py-4">Total read time</th><th className="px-4 py-4">Avg. per open</th><th className="px-4 py-4">Reader likes</th><th className="px-4 py-4">Reader dislikes</th></tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {sorted.map((article) => (
                  <tr key={article.id}>
                    <td className="px-5 py-4"><Link className="text-white hover:underline" to={`/blog/${encodeURIComponent(article.slug)}`} target="_blank" rel="noopener noreferrer">{article.title}</Link></td>
                    <td className="px-4 py-4 text-neutral-300">{article.opens.toLocaleString()}</td>
                    <td className="px-4 py-4 text-neutral-300">{formatTime(article.readTimeMs)}</td>
                    <td className="px-4 py-4 text-neutral-400">{article.opens ? formatTime(article.readTimeMs / article.opens) : "—"}</td>
                    <td className="px-4 py-4 text-neutral-300">{article.realLikes.toLocaleString()}</td>
                    <td className="px-4 py-4 text-neutral-300">{article.realDislikes.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageContainer>
  );
}