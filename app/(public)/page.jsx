import { getAllBlogs } from '@/lib/blog';
import HomeClient from './HomeClient';

export const metadata = {
  title: "TrendyStory",
  description:
    "AI productivity playbooks and workflows tailored for small business teams.",
};

export default async function Home() {
  const blogs = await getAllBlogs(); // server fetch

  return <HomeClient initialBlogs={blogs} />;
}
