import api from "../utils/api";
import axios from "axios";
import imageCompression from "browser-image-compression";
import type { BlogPost, BlogPostPayload } from "../types/blog";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

async function compressIfNeeded(file: File): Promise<File> {
  if (file.size <= MAX_IMAGE_SIZE_BYTES) return file;

  if (file.type === "image/gif") {
    throw new Error("This GIF is over 5 MB. Animated GIFs can’t be safely compressed in the browser; optimize it first or upload a JPEG, PNG, or WebP image.");
  }

  const outputType = file.type === "image/png" ? "image/webp" : file.type;
  const compressed = await imageCompression(file, {
    maxSizeMB: 4.5,
    maxWidthOrHeight: 2560,
    initialQuality: 0.82,
    useWebWorker: true,
    fileType: outputType,
  });

  if (compressed.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("This image could not be reduced below 5 MB. Choose a smaller image or reduce its dimensions.");
  }

  return compressed;
}

interface BlogPostsResponse {
  success: boolean;
  posts: BlogPost[];
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const response = await api.get<BlogPostsResponse>("/blog");
  return response.data.posts;
}

export async function getPublicBlogPost(id: string): Promise<BlogPost> {
  const response = await api.get<{ success: boolean; post: BlogPost }>(`/blog/${encodeURIComponent(id)}`);
  return response.data.post;
}

export async function getAdminBlogPosts(): Promise<BlogPost[]> {
  const response = await api.get<BlogPostsResponse>("/blog/all");
  return response.data.posts;
}

export async function getScheduledBlogPosts(): Promise<BlogPost[]> {
  const response = await api.get<BlogPostsResponse>("/blog/scheduled");
  return response.data.posts;
}

export async function uploadBlogImage(file: File): Promise<string> {
  const uploadFile = await compressIfNeeded(file);
  const formData = new FormData();
  formData.append("image", uploadFile);

  try {
    const response = await api.post<{ imageId: string }>("/blog/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return `${api.defaults.baseURL}/blog/images/${response.data.imageId}`;
  } catch (error) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      if (error.response?.status === 401) {
        throw new Error("Your admin session has expired. Sign in again, then retry the image upload.");
      }
      if (error.response?.status === 403) {
        throw new Error("Only administrators can upload blog images.");
      }
      throw new Error(error.response?.data?.message || "Image upload failed. Check the file type and 5 MB size limit.");
    }
    throw error;
  }

}

export async function createBlogPost(payload: BlogPostPayload): Promise<BlogPost> {
  const response = await api.post<{ success: boolean; post: BlogPost }>(
    "/blog",
    payload,
  );

  return response.data.post;
}

export async function updateBlogPost(
  id: string,
  payload: BlogPostPayload,
): Promise<BlogPost> {
  const response = await api.patch<{ success: boolean; post: BlogPost }>(
    `/blog/${encodeURIComponent(id)}`,
    payload,
  );
  return response.data.post;
}

export async function deleteBlogPost(id: string): Promise<void> {
  await api.delete(`/blog/${encodeURIComponent(id)}`);
}
