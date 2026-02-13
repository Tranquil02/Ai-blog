import { getAllBlogs } from '@/lib/blog';
import HomeClient from './HomeClient';

export const metadata = {
  title: "TrendyStory",
  description:
    "AI productivity playbooks and workflows tailored for small business teams.",
};

export const revalidate = 300;

const clamp = (value, max) => {
  const text = typeof value === "string" ? value : "";
  return text.length > max ? `${text.slice(0, max).trim()}...` : text;
};

const normalizeImageUrl = (value) => {
  if (typeof value !== "string") return null;
  const url = value.trim();
  if (!url) return null;
  // Avoid embedding huge base64/data URIs in ISR payloads.
  if (url.startsWith("data:")) return null;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
    return url;
  }
  return null;
};

const toHomeBlogCard = (post) => ({
  id: post?.id || "",
  slug: post?.slug || "",
  title: clamp(post?.title, 160),
  excerpt: clamp(post?.excerpt, 320),
  cover_image: normalizeImageUrl(post?.cover_image),
});

export default async function Home() {
  let blogs = [];
  try {
    blogs = (await getAllBlogs(7)).map(toHomeBlogCard);
  } catch {
    blogs = [];
  }

  return <HomeClient initialBlogs={blogs} />;
}
