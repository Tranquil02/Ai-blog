import BlogClient from './BlogClient';
import Provider from '@/lib/tanstack_query';

export const metadata = {
  title: "TrendyStory Blog",
  description:
    "AI productivity strategies, automation playbooks, and growth tactics for small businesses.",
  keywords: [
    "ai blog",
    "ai productivity tips",
    "ai automation examples",
    "ai workflow templates",
    "small business ai strategies",
    "chatgpt workflows",
    "ai operations playbook",
    "agentic workflows",
  ],
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage() {
  return (
    <Provider>
      <BlogClient />
    </Provider>
  );
}
