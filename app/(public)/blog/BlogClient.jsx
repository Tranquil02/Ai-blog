'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/footer';
import BlogGrid from '@/components/blog/BlogGrid';
import Section from '@/components/Section';
import Image from 'next/image';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchBlogsPage, fetchFeaturedBlogs } from '@/lib/api/blog';

export default function BlogClient() {
  const router = useRouter();
  const loadMoreRef = useRef(null);

  const { data: featureData, isLoading, error } = useQuery({
    queryKey: ['featured-blogs'],
    queryFn: fetchFeaturedBlogs,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  const {
    data: pagedBlogs,
    isLoading: isBlogsLoading,
    error: blogsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['all-blogs-infinite'],
    queryFn: ({ pageParam }) => fetchBlogsPage({ pageParam, limit: 24 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const {
    featured,
    trending = [],
    latest = [],
    mostViewed = [],
  } = featureData || {};

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: '300px 0px',
        threshold: 0.1,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allBlogs = useMemo(() => {
    return (pagedBlogs?.pages || []).flatMap((page) => page?.items || []);
  }, [pagedBlogs]);

  const allPosts = useMemo(() => {
    const map = new Map();
    allBlogs.forEach((post) => {
      if (post?.id) map.set(post.id, post);
    });
    return Array.from(map.values());
  }, [allBlogs]);

  const categories = useMemo(() => {
    const unique = new Set(allPosts.map((post) => post.category).filter(Boolean));
    return ['All', ...Array.from(unique)];
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesCategory =
        activeCategory === 'All' || post.category === activeCategory;
      const matchesSearch =
        !search ||
        post.title?.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allPosts, activeCategory, search]);

  const hasAnyPosts = allPosts.length > 0;
  const hasFilteredPosts = filteredPosts.length > 0;
  const hasTrending = trending.length > 0;
  const hasLatest = latest.length > 0;
  const hasMostViewed = mostViewed.length > 0;
  const loadingInitial = isLoading || isBlogsLoading;
  const loadError = error || blogsError;

  if (loadingInitial) {
    return (
      <div className="min-h-screen grid place-items-center">
        Loading...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen grid place-items-center text-red-500">
        {loadError?.message || 'Failed to load blogs'}
      </div>
    );
  }

  const openPost = (post) => {
    router.push(`/blog/${post.slug || post.id}`, { scroll: false });
  };

  return (
    <>
      <main className="bg-[var(--bg-primary)] mt-24">
        <section className="relative px-6 pb-16 pt-8 lg:pt-16">
          <div className="max-w-6xl mx-auto text-left">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--text-muted)]">
              TrendyStory Journal
            </p>
            <h1 className="mt-4 text-4xl sm:text-6xl lg:text-7xl font-editorial italic text-[var(--text-heading)] leading-tight">
              Stories, playbooks, and experiments from the front lines of AI adoption.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-[var(--text-secondary)]">
              Explore weekly field notes, founder interviews, and sharp insights for teams adopting AI.
            </p>
          </div>
        </section>

        {featured && (
          <section className="relative px-6">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center rounded-[2.5rem] border border-[var(--border-light)] bg-[var(--bg-secondary)] p-8 lg:p-12 shadow-[var(--shadow-soft)]">
              <div>
                <span className="text-xs uppercase tracking-[0.4em] text-[var(--accent-secondary)]">
                  Featured
                </span>

                <h2 className="mt-4 text-4xl sm:text-5xl font-editorial italic text-[var(--text-heading)] leading-tight">
                  {featured?.title}
                </h2>

                <p className="mt-6 max-w-lg text-[var(--text-secondary)]">
                  {featured?.excerpt}
                </p>

                <button
                  onClick={() => openPost(featured)}
                  className="
                    mt-8 inline-flex items-center gap-3
                    px-6 py-3 rounded-full
                    bg-[var(--text-heading)]
                    text-[var(--bg-primary)]
                    text-xs font-semibold uppercase tracking-[0.3em]
                    hover:translate-y-[-1px]
                    transition
                  "
                >
                  Read Article 
                </button>
              </div>

              <div className="relative h-[420px] rounded-[2rem] overflow-hidden group border border-[var(--border-light)]">
                {featured?.cover_image && (
                  <Image
                    src={featured?.cover_image}
                    alt={featured?.title}
                    width={800}
                    height={400}
                    priority
                    unoptimized
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-[var(--bg-primary)]/10" />
              </div>
            </div>
          </section>
        )}

        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 lg:items-end lg:justify-between">
            <div>
              <h3 className="text-3xl sm:text-4xl font-editorial italic text-[var(--text-heading)]">
                Browse the archive
              </h3>
              <p className="mt-3 text-[var(--text-secondary)]">
                Filter by theme and search across the library.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles"
                className="w-full sm:w-64 rounded-full border border-[var(--border-light)] bg-white/60 px-4 py-2 text-sm outline-none focus:border-[var(--accent-primary)]"
              />
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="rounded-full border border-[var(--border-light)] bg-white/60 px-4 py-2 text-sm outline-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="max-w-6xl mx-auto mt-10">
            {hasFilteredPosts ? (
              <BlogGrid posts={filteredPosts} reveal={false} />
            ) : (
              <div className="rounded-[2rem] border border-[var(--border-light)] bg-[var(--bg-secondary)] p-10 text-center shadow-[var(--shadow-soft)]">
                <h4 className="text-2xl font-editorial italic text-[var(--text-heading)]">
                  {hasAnyPosts ? "No matches found" : "No posts yet"}
                </h4>
                <p className="mt-3 text-[var(--text-secondary)]">
                  {hasAnyPosts
                    ? "Try a different keyword or reset your filters."
                    : "We are working on fresh stories. Check back soon."}
                </p>
                {(search || activeCategory !== "All") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setActiveCategory("All");
                    }}
                    className="
                      mt-6 inline-flex items-center gap-2
                      px-5 py-2 rounded-full
                      bg-[var(--text-heading)]
                      text-[var(--bg-primary)]
                      text-xs font-semibold uppercase tracking-[0.3em]
                      hover:translate-y-[-1px]
                      transition
                    "
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            )}
            <div ref={loadMoreRef} className="h-8" />
            {isFetchingNextPage && (
              <div className="mt-6 flex items-center justify-center">
                <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border-light)] bg-[var(--bg-secondary)] px-4 py-2 text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent-secondary)]" />
                  Loading more stories
                </div>
              </div>
            )}
            {!hasNextPage && allPosts.length > 0 && (
              <p className="mt-8 text-center text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">
                You reached the end
              </p>
            )}
          </div>
        </section>

        <div className="px-6 pb-32 space-y-32">
          {hasTrending && (
            <Section title="Trending Now" subtitle="Most talked about articles">
              <BlogGrid posts={trending} reveal={false} />
            </Section>
          )}

          {hasLatest && (
            <Section title="Latest Stories" subtitle="Fresh perspectives">
              <BlogGrid posts={latest} reveal={false} />
            </Section>
          )}

          {hasMostViewed && (
            <Section title="Most Read" subtitle="Reader favorites">
              <BlogGrid posts={mostViewed} reveal={false} />
            </Section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
