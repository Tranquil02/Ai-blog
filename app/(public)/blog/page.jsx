import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';
import { fetchFeaturedBlogs } from '@/lib/api/blog';
import BlogClient from './BlogClient';

export const metadata = {
  title: "TrendyStory Blog",
  description:
    "AI productivity strategies, automation playbooks, and growth tactics for small businesses.",
};

export default async function BlogPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['featured-blogs'],
    queryFn: fetchFeaturedBlogs,
  });

  // console.log(res)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogClient />
    </HydrationBoundary>
  );
}
