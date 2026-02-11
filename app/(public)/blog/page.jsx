import BlogClient from './BlogClient';

export const metadata = {
  title: "TrendyStory Blog",
  description:
    "AI productivity strategies, automation playbooks, and growth tactics for small businesses.",
};

export default async function BlogPage() {
  return <BlogClient />;
}
