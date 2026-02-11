'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import Hero from "@/components/Hero"
import BlogGrid from '@/components/blog/BlogGrid';
import Newsletter from '@/components/Newsletter';
import Connect from '@/components/Connect';
import Footer from '@/components/footer';
import SectionReveal from '@/components/ui/SectionReveal';
import Link from 'next/link';
import Image from 'next/image';

export default function HomeClient({ initialBlogs }) {
  const { data: blogs, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data } = await axios.get('/api/blog/getAll');
      return data;
    },
    initialData: initialBlogs,
    staleTime: 60_000,
  });

  if (error) {
    return <p className="text-red-500">Failed to load blogs</p>;
  }

  const blogList = Array.isArray(blogs) ? blogs : [];
  const featured = blogList[0];
  const latest = blogList.slice(1, 7);

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Hero />

      <section
        id="blog"
        className="min-h-screen py-16 px-6 sm:px-12 lg:px-24 bg-[var(--bg-secondary)]"
      >
        <SectionReveal className="flex flex-col items-start text-left mb-16 max-w-5xl">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--text-muted)]">
            Latest from the Journal
          </p>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-editorial italic text-[var(--text-heading)] mt-4">
            Insightful stories for practical AI builders.
          </h2>
          <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl">
            Read deep dives on automation strategy, operational playbooks, and
            emerging tools built for small teams.
          </p>
        </SectionReveal>

        {featured && (
          <SectionReveal className="mb-16">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] items-center rounded-[2.5rem] border border-[var(--border-light)] bg-[var(--bg-primary)] p-8 lg:p-12 shadow-[var(--shadow-soft)]">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-[var(--accent-secondary)]">
                  Featured story
                </p>
                <h3 className="mt-4 text-3xl sm:text-4xl font-editorial italic text-[var(--text-heading)]">
                  {featured.title}
                </h3>
                <p className="mt-4 text-[var(--text-secondary)] line-clamp-3">
                  {featured.excerpt}
                </p>
                <Link
                  href={`/blog/${featured.id}`}
                  className="mt-6 inline-flex items-center gap-3 rounded-full bg-[var(--text-heading)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--bg-primary)]"
                >
                  Read the story
                </Link>
              </div>
              {featured.cover_image && (
                <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden border border-[var(--border-light)]">
                  <Image
                    src={featured.cover_image}
                    alt={featured.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>
              )}
            </div>
          </SectionReveal>
        )}

        <BlogGrid posts={latest} />
        <div className="flex justify-center mt-16">
          <Link
            href="/blog"
            className="
            relative inline-flex items-center justify-center
            px-6 py-3
            text-base font-semibold
            text-[var(--text-heading)]
            border border-[var(--border-light)]
            rounded-2xl
            backdrop-blur-md
            bg-[var(--bg-secondary)]/40
            transition-all duration-300 ease-out
            hover:bg-[var(--text-heading)]
            hover:text-[var(--bg-primary)]
            hover:shadow-[0_12px_40px_rgba(255,255,255,0.35)]
            hover:-translate-y-0.5
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-[var(--text-heading)]/70
            active:translate-y-0
          "
          >
            View More
          </Link>
        </div>
      </section>

      <Connect />
      <Newsletter />
      <Footer />
    </main>
  );
}
