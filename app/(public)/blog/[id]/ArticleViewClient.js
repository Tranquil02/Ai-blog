"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Heart,
  Bookmark,
  Share2,
  User,
  Clock,
  Calendar,
  Eye,
  Tag,
} from "lucide-react";

export default function ArticleViewClient({ post }) {
  const router = useRouter();

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeBusy, setLikeBusy] = useState(false);
  const [saveBusy, setSaveBusy] = useState(false);
  const [views, setViews] = useState(post?.views ?? 0);
  const [likeCount, setLikeCount] = useState(post?.likes ?? 0);
  const [saveCount, setSaveCount] = useState(post?.saves ?? 0);

  const publishedDate = useMemo(() => {
    if (!post?.published_at) return null;
    return new Date(post.published_at).toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [post?.published_at]);

  useEffect(() => {
    if (!post?.id) return;
    let active = true;

    const updateViews = async () => {
      try {
        const res = await fetch(`/api/blog/views/${post.id}`, {
          method: "POST",
        });
        const data = await res.json();
        if (active && typeof data?.views === "number") {
          setViews(data.views);
        }
      } catch {
        // Silent fail for analytics-only action
      }
    };

    updateViews();
    return () => {
      active = false;
    };
  }, [post?.id]);

  useEffect(() => {
    if (!post?.id || typeof window === "undefined") return;
    try {
      const likedKey = `blog_like_${post.id}`;
      const savedKey = `blog_save_${post.id}`;
      setLiked(localStorage.getItem(likedKey) === "1");
      setSaved(localStorage.getItem(savedKey) === "1");
    } catch {
      // Ignore storage errors
    }
  }, [post?.id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleLike = async () => {
    if (likeBusy) return;
    const delta = liked ? -1 : 1;
    const nextLiked = !liked;
    setLikeBusy(true);
    setLiked(nextLiked);
    setLikeCount((prev) => Math.max(0, prev + delta));
    try {
      const res = await fetch(`/api/blog/like/${post.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delta }),
      });
      const data = await res.json();
      if (typeof data?.likes === "number") {
        setLikeCount(data.likes);
      }
      if (typeof window !== "undefined") {
        const key = `blog_like_${post.id}`;
        if (nextLiked) {
          localStorage.setItem(key, "1");
        } else {
          localStorage.removeItem(key);
        }
      }
    } catch {
      setLiked((prev) => !prev);
      setLikeCount((prev) => Math.max(0, prev - delta));
    } finally {
      setLikeBusy(false);
    }
  };

  const handleSave = async () => {
    if (saveBusy) return;
    const delta = saved ? -1 : 1;
    const nextSaved = !saved;
    setSaveBusy(true);
    setSaved(nextSaved);
    setSaveCount((prev) => Math.max(0, prev + delta));
    try {
      const res = await fetch(`/api/blog/save/${post.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delta }),
      });
      const data = await res.json();
      if (typeof data?.saves === "number") {
        setSaveCount(data.saves);
      }
      if (typeof window !== "undefined") {
        const key = `blog_save_${post.id}`;
        if (nextSaved) {
          localStorage.setItem(key, "1");
        } else {
          localStorage.removeItem(key);
        }
      }
    } catch {
      setSaved((prev) => !prev);
      setSaveCount((prev) => Math.max(0, prev - delta));
    } finally {
      setSaveBusy(false);
    }
  };

  const contentBlocks = useMemo(() => {
    const raw = post?.content || "";
    const stripTags = (value) =>
      value.replace(/<\/?[^>]+(>|$)/g, "").trim();
    const normalized = raw
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/li>/gi, "</li>\n");
    const lines = normalized.split(/\r?\n/);
    const blocks = [];
    let listBuffer = [];
    let listType = null;

    const pushList = () => {
      if (listBuffer.length) {
        blocks.push({ type: listType || "ul", items: listBuffer });
        listBuffer = [];
        listType = null;
      }
    };

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        pushList();
        return;
      }

      const liMatch = trimmed.match(/<li[^>]*>(.*?)<\/li>/i);
      if (liMatch) {
        const isOrdered = /<ol[^>]*>/i.test(trimmed);
        if (listType && listType !== (isOrdered ? "ol" : "ul")) {
          pushList();
        }
        listType = isOrdered ? "ol" : "ul";
        listBuffer.push(stripTags(liMatch[1]));
        return;
      }

      const h1Match = trimmed.match(/^<h1[^>]*>(.*?)<\/h1>$/i);
      if (h1Match) {
        pushList();
        blocks.push({ type: "h1", text: stripTags(h1Match[1]) });
        return;
      }

      const h2Match = trimmed.match(/^<h2[^>]*>(.*?)<\/h2>$/i);
      if (h2Match) {
        pushList();
        blocks.push({ type: "h2", text: stripTags(h2Match[1]) });
        return;
      }

      const h3Match = trimmed.match(/^<h3[^>]*>(.*?)<\/h3>$/i);
      if (h3Match) {
        pushList();
        blocks.push({ type: "h3", text: stripTags(h3Match[1]) });
        return;
      }

      const pMatch = trimmed.match(/^<p[^>]*>(.*?)<\/p>$/i);
      if (pMatch) {
        pushList();
        blocks.push({ type: "p", text: stripTags(pMatch[1]) });
        return;
      }

      if (trimmed.startsWith("### ")) {
        pushList();
        blocks.push({ type: "h3", text: trimmed.replace(/^###\s+/, "") });
        return;
      }

      if (trimmed.startsWith("## ")) {
        pushList();
        blocks.push({ type: "h2", text: trimmed.replace(/^##\s+/, "") });
        return;
      }

      if (trimmed.startsWith("# ")) {
        pushList();
        blocks.push({ type: "h1", text: trimmed.replace(/^#\s+/, "") });
        return;
      }

      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        if (listType && listType !== "ul") {
          pushList();
        }
        listType = "ul";
        listBuffer.push(trimmed.replace(/^[-*]\s+/, ""));
        return;
      }

      if (/^\d+[\.\)]\s+/.test(trimmed)) {
        if (listType && listType !== "ol") {
          pushList();
        }
        listType = "ol";
        listBuffer.push(trimmed.replace(/^\d+[\.\)]\s+/, ""));
        return;
      }

      pushList();
      blocks.push({ type: "p", text: stripTags(trimmed) });
    });

    pushList();
    return blocks;
  }, [post?.content]);

  const renderInline = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const value = part.slice(2, -2);
        return (
          <strong key={`b-${idx}`} className="text-[var(--text-heading)]">
            {value}
          </strong>
        );
      }
      return <span key={`t-${idx}`}>{part}</span>;
    });
  };

  if (!post) return null;

  return (
    <article className="bg-[var(--bg-primary)] paper-texture px-6 py-20 lg:px-12 lg:py-28 min-h-screen">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt || "",
            author: {
              "@type": "Person",
              name: post.author || "TrendyStory Editorial",
            },
            datePublished: post.published_at || post.created_at,
            dateModified: post.updated_at || post.published_at || post.created_at,
            image: post.cover_image ? [post.cover_image] : undefined,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id":
                (process.env.NEXT_PUBLIC_SITE_URL || "https://trendystory.site") +
                `/blog/${post.id}`,
            },
            publisher: {
              "@type": "Organization",
              name: "TrendyStory",
            },
          }),
        }}
      />
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent-secondary)] mb-10"
        >
          <ArrowLeft size={16} />
          Back to Journal
        </button>

        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-[var(--accent-secondary)] mb-4">
            <span>{post.category}</span>
            <span className="w-6 h-px bg-[var(--border-light)]" />
            <Calendar size={14} className="text-[var(--text-muted)]" />
            <span className="text-[var(--text-muted)]">{publishedDate}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-editorial italic text-[var(--text-heading)] leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-secondary)] flex items-center justify-center">
                <User size={16} className="text-[var(--bg-primary)]" />
              </div>
              <div className="text-sm">
                <p className="text-[var(--text-heading)]">{post.author}</p>
                <p className="text-[var(--text-muted)] flex items-center gap-2">
                  <Clock size={12} />
                  {post.reading_time || 4} min read
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
              <Eye size={14} />
              {views} views
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full border ${
                liked
                  ? "border-red-500 text-red-500"
                  : "border-[var(--border-light)] text-[var(--text-muted)]"
              }`}
            >
              <Heart size={16} fill={liked ? "currentColor" : "none"} />
            </button>
            <span className="text-xs text-[var(--text-muted)]">{likeCount}</span>

            <button
              onClick={handleSave}
              className={`p-2 rounded-full border ${
                saved
                  ? "border-[var(--accent-secondary)] text-[var(--accent-secondary)]"
                  : "border-[var(--border-light)] text-[var(--text-muted)]"
              }`}
            >
              <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
            </button>
            <span className="text-xs text-[var(--text-muted)]">{saveCount}</span>

            <button
              onClick={handleShare}
              className="p-2 rounded-full border border-[var(--border-light)] text-[var(--text-muted)]"
            >
              <Share2 size={16} />
            </button>
          </div>
        </header>

        <div className="relative aspect-[16/9] rounded-[2rem] overflow-hidden border border-[var(--border-light)] shadow-[var(--shadow-soft)] mb-12">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              priority
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 900px"
            />
          ) : (
            <div className="w-full h-full bg-[var(--bg-tertiary)]" />
          )}
        </div>

        <section className="leading-relaxed space-y-6 text-[var(--text-primary)]">
          <p className="text-xl font-editorial italic text-[var(--text-heading)]">
            {post.excerpt}
          </p>
          <div className="space-y-6 text-[var(--text-secondary)]">
            {contentBlocks.map((block, index) => {
              if (block.type === "h1") {
                return (
                  <h1
                    key={`h1-${index}`}
                    className="text-3xl sm:text-4xl font-editorial italic text-[var(--text-heading)]"
                  >
                    {renderInline(block.text)}
                  </h1>
                );
              }
              if (block.type === "h2") {
                return (
                  <h2
                    key={`h2-${index}`}
                    className="text-2xl sm:text-3xl font-editorial italic text-[var(--text-heading)]"
                  >
                    {renderInline(block.text)}
                  </h2>
                );
              }
              if (block.type === "h3") {
                return (
                  <h3
                    key={`h3-${index}`}
                    className="text-xl sm:text-2xl font-editorial italic text-[var(--text-heading)]"
                  >
                    {renderInline(block.text)}
                  </h3>
                );
              }
              if (block.type === "ul") {
                return (
                  <ul
                    key={`ul-${index}`}
                    className="list-disc pl-6 space-y-2 text-[var(--text-secondary)]"
                  >
                    {block.items.map((item, itemIndex) => (
                      <li key={`li-${index}-${itemIndex}`}>
                        {renderInline(item)}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (block.type === "ol") {
                return (
                  <ol
                    key={`ol-${index}`}
                    className="list-decimal pl-6 space-y-2 text-[var(--text-secondary)]"
                  >
                    {block.items.map((item, itemIndex) => (
                      <li key={`li-${index}-${itemIndex}`}>
                        {renderInline(item)}
                      </li>
                    ))}
                  </ol>
                );
              }
              return (
                <p key={`p-${index}`} className="text-[var(--text-secondary)]">
                  {renderInline(block.text)}
                </p>
              );
            })}
          </div>
        </section>

        {post.tags?.length ? (
          <section className="mt-12 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">
            <Tag size={14} />
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--border-light)] px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </section>
        ) : null}
      </div>
    </article>
  );
}
