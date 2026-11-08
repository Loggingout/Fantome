import { Blog } from "../models/Blog.js";

export function slugifyBlogTitle(title) {
  const slug = title.normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120)
    .replace(/-+$/g, "");
  return slug && !/^[a-f0-9]{24}$/.test(slug) && !["all", "scheduled"].includes(slug)
    ? slug
    : `article-${slug || "post"}`;
}

export async function withUniqueBlogSlug(title, save) {
  const base = slugifyBlogTitle(title);
  for (let suffix = 1; ; suffix += 1) {
    const slug = suffix === 1 ? base : `${base}-${suffix}`;
    try {
      return await save(slug);
    } catch (error) {
      if (error.code !== 11000 || !error.keyPattern?.slug) throw error;
    }
  }
}

export async function backfillBlogSlugs() {
  await Blog.init();
  const posts = Blog.find({ slug: { $exists: false } }).select("_id title").sort({ createdAt: 1, _id: 1 }).cursor();
  for await (const post of posts) {
    await withUniqueBlogSlug(post.title, (slug) =>
      Blog.updateOne({ _id: post._id, slug: { $exists: false } }, { $set: { slug } }, { timestamps: false }),
    );
  }
}