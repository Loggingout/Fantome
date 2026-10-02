import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarClock, Eye, ImagePlus, Pencil, Save, Send } from "lucide-react";

import PageContainer, { SectionHeader } from "../../../components/layout/PageContainer";
import BlogArticlePreview from "../../../components/admin/blog/BlogArticlePreview";
import BlogRichTextEditor from "../../../components/admin/blog/BlogRichTextEditor";
import { createBlogPost, getAdminBlogPosts, updateBlogPost, uploadBlogImage } from "../../../services/blogService";

const fieldClass =
  "w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-neutral-600";

const toLocalDateTimeValue = (date: Date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
};

export default function BlogManagementPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Ecosystem");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [error, setError] = useState<string | null>(null);
  const [isLoadingDraft, setIsLoadingDraft] = useState(Boolean(id));

  useEffect(() => {
    if (!id) return;
    let isCurrent = true;

    getAdminBlogPosts()
      .then((posts) => {
        const draft = posts.find((post) => post.id === id && !post.published && !post.scheduledAt);
        if (!draft) {
          if (isCurrent) setError("This draft could not be found.");
          return;
        }
        if (!isCurrent) return;
        setTitle(draft.title);
        setExcerpt(draft.excerpt);
        setCategory(draft.category);
        setContent(draft.content);
        setCoverImage(draft.image);
      })
      .catch((loadError) => {
        if (isCurrent) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load this draft.");
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoadingDraft(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [id]);

  const author = (() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") ?? "null");
      return user?.name || "Fantome Technologies";
    } catch {
      return "Fantome Technologies";
    }
  })();

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;

    setError(null);
    setIsUploadingCover(true);
    try {
      const imageUrl = await uploadBlogImage(file);
      setCoverImage(imageUrl);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed.");
    } finally {
      setIsUploadingCover(false);
    }
  };

  const savePost = async (mode: "draft" | "publish" | "schedule") => {
    if (!title.trim()) {
      setError("Add a title before saving the post.");
      return;
    }

    const scheduleDate = mode === "schedule" ? new Date(scheduledAt) : null;
    if (mode === "schedule" && (!scheduledAt || Number.isNaN(scheduleDate?.getTime()))) {
      setError("Choose a valid date and time to schedule this post.");
      return;
    }
    if (scheduleDate && scheduleDate <= new Date()) {
      setError("Scheduled publication must be in the future.");
      return;
    }

    const articleText = new DOMParser().parseFromString(content, "text/html").body.textContent?.trim();
    if (mode === "publish" && !articleText) {
      setError("Add article content before publishing.");
      return;
    }

    setError(null);
    setIsSaving(true);
    try {
      const payload = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        category: category.trim() || "General",
        content,
        image: coverImage,
        author,
        published: mode === "publish",
        scheduledAt: scheduleDate?.toISOString() ?? null,
      };
      if (id) {
        await updateBlogPost(id, payload);
      } else {
        await createBlogPost(payload);
      }
      navigate(
        mode === "schedule"
          ? "/admin/blog/scheduled"
          : mode === "draft"
            ? "/admin/blog/drafts"
            : "/admin/blog/view",
      );
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save this post.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageContainer>
      <SectionHeader
        title={id ? "Continue Draft" : "Create Blog Post"}
        action={
          <button
            type="button"
            onClick={() => navigate("/admin/blog/view")}
            className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
          >
            View posts
          </button>
        }
      />

      <div className="space-y-5">
        <div className="flex flex-col gap-4 border-b border-neutral-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-neutral-400">{id ? "Continue editing this saved draft." : "Compose an article for the Fantome Technologies blog."}</p>
            <p className="mt-1 text-xs text-neutral-600">Images are stored with the post media in MongoDB. Images over 5 MB are compressed before upload.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg border border-neutral-800 bg-neutral-950 p-1" aria-label="Editor view">
              <button
                type="button"
                aria-pressed={view === "edit"}
                onClick={() => setView("edit")}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${view === "edit" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white"}`}
              >
                <Pencil className="h-4 w-4" /> Edit
              </button>
              <button
                type="button"
                aria-pressed={view === "preview"}
                onClick={() => setView("preview")}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${view === "preview" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white"}`}
              >
                <Eye className="h-4 w-4" /> Preview
              </button>
            </div>

            <button
              type="button"
              disabled={isSaving || isUploadingCover || isLoadingDraft}
              onClick={() => void savePost("draft")}
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-200 transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" /> Save draft
            </button>
            <button
              type="button"
              disabled={isSaving || isUploadingCover || isLoadingDraft}
              onClick={() => void savePost("schedule")}
              className="inline-flex items-center gap-2 rounded-lg border border-amber-800/70 bg-amber-950/30 px-4 py-2.5 text-sm font-medium text-amber-200 transition hover:bg-amber-950/60 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CalendarClock className="h-4 w-4" /> Schedule
            </button>
            <button
              type="button"
              disabled={isSaving || isUploadingCover || isLoadingDraft}
              onClick={() => void savePost("publish")}
              className="inline-flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" /> {isSaving ? "Saving..." : "Publish"}
            </button>
          </div>
        </div>

        {error && (
          <div role="alert" className="rounded-lg border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {view === "preview" ? (
          <BlogArticlePreview
            title={title}
            excerpt={excerpt}
            category={category}
            image={coverImage}
            author={author}
            content={content}
          />
        ) : (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="min-w-0 space-y-5">
              <div>
                <label htmlFor="blog-title" className="mb-2 block text-xs font-medium uppercase tracking-widest text-neutral-500">Title</label>
                <input id="blog-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={180} placeholder="Write a clear, specific headline" className={`${fieldClass} text-lg font-semibold`} />
              </div>

              <div>
                <label htmlFor="blog-excerpt" className="mb-2 block text-xs font-medium uppercase tracking-widest text-neutral-500">Excerpt</label>
                <textarea id="blog-excerpt" value={excerpt} onChange={(event) => setExcerpt(event.target.value)} maxLength={320} rows={3} placeholder="A short summary shown on the blog listing" className={`${fieldClass} resize-y`} />
                <p className="mt-1 text-right text-xs text-neutral-600">{excerpt.length}/320</p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <label className="block text-xs font-medium uppercase tracking-widest text-neutral-500">Article</label>
                  <span className="text-xs text-neutral-600">Formatting is preserved in preview and saved post</span>
                </div>
                <BlogRichTextEditor content={content} onChange={setContent} />
              </div>
            </div>

            <aside className="space-y-5">
              <div>
                <label htmlFor="blog-category" className="mb-2 block text-xs font-medium uppercase tracking-widest text-neutral-500">Category</label>
                <input id="blog-category" value={category} onChange={(event) => setCategory(event.target.value)} maxLength={48} placeholder="Ecosystem" className={fieldClass} />
              </div>

              <div>
                <label htmlFor="blog-scheduled-at" className="mb-2 block text-xs font-medium uppercase tracking-widest text-neutral-500">Publish date and time</label>
                <input
                  id="blog-scheduled-at"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(event) => setScheduledAt(event.target.value)}
                  min={toLocalDateTimeValue(new Date(Date.now() + 60_000))}
                  className={fieldClass}
                />
                <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                  Times use your browser’s local timezone. Choose a future time, then select Schedule.
                </p>
              </div>

              <section className="space-y-3 border-t border-neutral-800 pt-5">
                <div>
                  <h2 className="text-sm font-medium text-neutral-200">Cover image</h2>
                  <p className="mt-1 text-xs leading-relaxed text-neutral-500">JPG/JPEG, PNG, WebP, or GIF. Images over 5 MB are compressed automatically; animated GIFs must already be under 5 MB.</p>
                </div>

                {coverImage ? (
                  <div className="relative overflow-hidden rounded-lg border border-neutral-800">
                    <img src={coverImage} alt="Blog cover preview" className="aspect-16/10 w-full object-cover" />
                    <button type="button" onClick={() => setCoverImage("")} className="absolute right-2 top-2 rounded-md bg-neutral-950/90 px-2.5 py-1.5 text-xs text-white hover:bg-neutral-900">Remove</button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    disabled={isUploadingCover}
                    className="flex aspect-16/10 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-700 bg-neutral-950 text-sm text-neutral-400 transition hover:border-neutral-500 hover:text-white disabled:opacity-50"
                  >
                    <ImagePlus className="h-5 w-5" />
                    {isUploadingCover ? "Compressing and uploading..." : "Upload cover image"}
                  </button>
                )}
                <input ref={coverInputRef} type="file" accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleCoverUpload} />
              </section>

              <div className="border-t border-neutral-800 pt-5">
                <p className="text-xs uppercase tracking-widest text-neutral-500">Author</p>
                <p className="mt-2 text-sm text-neutral-300">{author}</p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
