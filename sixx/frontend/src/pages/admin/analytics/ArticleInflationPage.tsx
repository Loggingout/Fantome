import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import PageContainer, { SectionHeader } from "../../../components/layout/PageContainer";
import { getBlogAnalytics, updateBlogInflation, type BlogAnalyticsRow } from "../../../services/blogAnalyticsService";

function AdjustmentRow({ article, onSaved }: { article: BlogAnalyticsRow; onSaved: (id: string, likes: number, dislikes: number) => void }) {
  const [likes, setLikes] = useState(String(article.inflatedLikes));
  const [dislikes, setDislikes] = useState(String(article.inflatedDislikes));
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      await updateBlogInflation(article.id, Number(likes), Number(dislikes));
      onSaved(article.id, Number(likes), Number(dislikes));
      setFeedback("Saved");
    } catch {
      setFeedback("Unable to save adjustments.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="grid gap-4 border-t border-neutral-800 px-5 py-5 lg:grid-cols-[minmax(0,1fr)_8rem_8rem_auto] lg:items-end">
      <div className="min-w-0">
        <h2 className="wrap-break-word text-sm font-medium text-white">{article.title}</h2>
        <p className="mt-1 text-xs text-neutral-500">Reader votes: {article.realLikes.toLocaleString()} likes, {article.realDislikes.toLocaleString()} dislikes</p>
      </div>
      <label className="text-xs text-neutral-400">Added likes<input aria-label={`Added likes for ${article.title}`} required type="number" min="0" max="1000000" step="1" value={likes} onChange={(event) => setLikes(event.target.value)} className="mt-1 block w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white" /></label>
      <label className="text-xs text-neutral-400">Added dislikes<input aria-label={`Added dislikes for ${article.title}`} required type="number" min="0" max="1000000" step="1" value={dislikes} onChange={(event) => setDislikes(event.target.value)} className="mt-1 block w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white" /></label>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white hover:bg-neutral-700 disabled:opacity-50"><Save className="h-4 w-4" />{saving ? "Saving..." : "Save"}</button>
        {feedback && <span role="status" className="text-xs text-neutral-400">{feedback}</span>}
      </div>
    </form>
  );
}

export default function ArticleInflationPage() {
  const [articles, setArticles] = useState<BlogAnalyticsRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getBlogAnalytics()
      .then((data) => { if (active) setArticles(data); })
      .catch(() => { if (active) setError("Unable to load articles."); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <PageContainer>
      <SectionHeader title="Article Inflation" />
      <p className="mb-5 text-sm text-neutral-400">Manual additions change the public reaction totals but remain separate from reader analytics. Set either value to zero to remove it.</p>
      {error && <p role="alert" className="mb-4 text-sm text-red-300">{error}</p>}
      {isLoading ? <p role="status" className="text-sm text-neutral-400">Loading articles...</p> : !error && articles.length === 0 ? <p className="text-sm text-neutral-400">No published articles yet.</p> : !error && (
        <section className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
          <div className="px-5 py-4 text-xs uppercase text-neutral-500">Published articles</div>
          {articles.map((article) => <AdjustmentRow key={article.id} article={article} onSaved={(id, likes, dislikes) => setArticles((current) => current.map((item) => item.id === id ? { ...item, inflatedLikes: likes, inflatedDislikes: dislikes } : item))} />)}
        </section>
      )}
    </PageContainer>
  );
}