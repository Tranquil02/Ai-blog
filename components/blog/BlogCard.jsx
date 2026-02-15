"use client";

import Image from "next/image";
import { User, ArrowUpRight, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export default function BlogCard({ post }) {
  const router = useRouter();


  const onSelect = (post) => {
    router.push(`/blog/${post.id}`, { scroll: false });
  };

  const publishedDate = post?.published_at
    ? dateFormatter.format(new Date(post.published_at))
    : "";

  return (
    <article
      onClick={() => onSelect(post)}
      className="
        group cursor-pointer relative w-full
        rounded-[2rem] overflow-hidden
        bg-[var(--bg-secondary)]
        border border-[var(--border-light)]
        shadow-[var(--shadow-card)]
        transition-transform duration-500 hover:-translate-y-1
      "
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw,
                   (max-width: 1200px) 50vw,
                   33vw"
            className="
              object-cover
              transition-transform duration-1000
              group-hover:scale-105
            "
          />
        ) : (
          <div className="w-full h-full bg-[var(--bg-tertiary)]" />
        )}
      </div>

      <div className="p-8 flex flex-col gap-4">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
          <span className="text-[var(--accent-secondary)]">{post.category}</span>
          {publishedDate && <span>{publishedDate}</span>}
        </div>

        <h3 className="text-2xl lg:text-3xl font-editorial italic text-[var(--text-heading)] leading-tight">
          {post.title}
        </h3>

        <p className="text-sm text-[var(--text-secondary)] line-clamp-3">
          {post.excerpt}
        </p>

        <div className="mt-2 flex items-center justify-between border-t border-[var(--border-light)] pt-4">
          <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)]">
            <User size={14} />
            <span className="uppercase tracking-[0.25em]">{post.author}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
            <Clock size={14} />
            <span>{post.reading_time || 3} min</span>
          </div>
          <Link href={`/blog/${post.id}`} scroll={false} className="text-[var(--accent-primary)]">
            <ArrowUpRight size={20} className="transition-transform duration-500 group-hover:rotate-45" />
          </Link>
        </div>
      </div>
    </article>
  );
}
