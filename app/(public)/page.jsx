import { getAllBlogs } from "@/lib/blog";
import HomeClient from './HomeClient';

export const metadata = {
  title: "TrendyStory",
  description:
    "AI productivity playbooks and workflows tailored for small business teams.",
};

export const revalidate = 300;

const HOME_FETCH_TIMEOUT_MS = Number(process.env.HOME_FETCH_TIMEOUT_MS || 2500);

const clamp = (value, max) => {
  const text = typeof value === "string" ? value : "";
  return text.length > max ? `${text.slice(0, max).trim()}...` : text;
};

const normalizeImageUrl = (value) => {
  if (typeof value !== "string") return null;
  const url = value.trim();
  if (!url || url.startsWith("data:")) return null;
  if (url.startsWith("http://")) return url.replace(/^http:\/\//i, "https://");
  if (url.startsWith("https://") || url.startsWith("/")) return url;
  return null;
};

const toHomeBlogCard = (post) => ({
  id: post?.id || "",
  slug: post?.slug || "",
  title: clamp(post?.title, 160),
  excerpt: clamp(post?.excerpt, 320),
  cover_image: normalizeImageUrl(post?.cover_image),
  has_cover_image: Boolean(post?.has_cover_image),
});

export default async function Home() {
  let initialBlogs = [];
  try {
    const blogs = await Promise.race([
      getAllBlogs(7),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("HOME_FETCH_TIMEOUT")), HOME_FETCH_TIMEOUT_MS)
      ),
    ]);
    initialBlogs = Array.isArray(blogs) ? blogs.map(toHomeBlogCard) : [];
  } catch {
    initialBlogs = [];
  }

  return <HomeClient initialBlogs={initialBlogs} />;
}
