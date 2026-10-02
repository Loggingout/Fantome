import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageContainer, {
  SectionHeader,
} from "../../../components/layout/PageContainer";

import ScheduledBlogsTable from "../../../components/admin/blog/ScheduledBlogsTable";
import { deleteBlogPost, getScheduledBlogPosts } from "../../../services/blogService";
import type { BlogPost } from "../../../types/blog";

export default function ScheduledBlogsPage() {
  const [scheduledBlogs, setScheduledBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadScheduledBlogs = async () => {
    setError(null);
    try {
      setScheduledBlogs(await getScheduledBlogPosts());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load scheduled blogs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadScheduledBlogs();
  }, []);

  const handleDelete = async (post: BlogPost) => {
    if (!window.confirm(`Delete scheduled post “${post.title}”?`)) return;
    try {
      await deleteBlogPost(post.id);
      setScheduledBlogs((current) => current.filter((item) => item.id !== post.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete scheduled post.");
    }
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Scheduled Blogs"
        action={<Link to="/admin/blog" className="rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-800">Create post</Link>}
      />
      {error && <p role="alert" className="mb-4 rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-300">{error}</p>}
      {isLoading ? (
        <p role="status" className="text-sm text-neutral-400">Loading scheduled posts...</p>
      ) : (
        <ScheduledBlogsTable blogs={scheduledBlogs} onDelete={(post) => void handleDelete(post)} />
      )}
    </PageContainer>
  );
}