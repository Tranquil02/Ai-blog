import { getAllBlogs } from '@/lib/blog';
import HomeClient from './HomeClient';

export const metadata = {
  title: "TrendyStory",
  description:
    "AI productivity playbooks and workflows tailored for small business teams.",
};

export const dynamic = "force-dynamic";

export default async function Home() {
  let blogs = [];
  try {
    blogs = await getAllBlogs();
  } catch {
    blogs = [];
  }

  return <HomeClient initialBlogs={blogs} />;
}
