"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Heart,
  Bookmark,
  Share2,
  User,
  Clock,
  Send,
} from "lucide-react";

export default function ArticleView({ post, onBack }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");


  if (!post) return null;

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

  const addComment = () => {
    if (!input.trim()) return;
    setComments([...comments, { id: Date.now(), text: input }]);
    setInput("");
  };

  return (
    <article className="bg-[var(--bg-primary)] px-6 py-16">
      <div className="max-w-3xl mx-auto">

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent-secondary)] mb-6"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <header className="mb-10">
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[var(--accent-secondary)] mb-3">
            <span>{post.category}</span>
            <span className="w-6 h-px bg-[var(--border-light)]" />
            <span className="text-[var(--text-muted)]">{post.date}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-editorial italic text-[var(--text-heading)] leading-tight mb-4">
            {post.title}
          </h1>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[var(--accent-secondary)] flex items-center justify-center">
                <User size={16} className="text-[var(--bg-primary)]" />
              </div>
              <div className="text-sm">
                <p className="text-[var(--text-heading)]">{post.author}</p>
                <p className="text-[var(--text-muted)] flex items-center gap-1">
                  <Clock size={12} />
                  {post.readTime}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setLiked(!liked)}
                className={`p-2 rounded-full border ${
                  liked
                    ? "border-red-500 text-red-500"
                    : "border-[var(--border-light)] text-[var(--text-muted)]"
                }`}
              >
                <Heart size={18} fill={liked ? "currentColor" : "none"} />
              </button>

              <button
                onClick={() => setSaved(!saved)}
                className={`p-2 rounded-full border ${
                  saved
                    ? "border-[var(--accent-secondary)] text-[var(--accent-secondary)]"
                    : "border-[var(--border-light)] text-[var(--text-muted)]"
                }`}
              >
                <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-full border border-[var(--border-light)] text-[var(--text-muted)]"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </header>

        <div className="aspect-[16/9] rounded-xl overflow-hidden mb-10">
          <Image
            src={post.image}
            alt={post.title}
            width={1280}
            height={720}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>

        <section className="text-[var(--text-primary)] leading-relaxed space-y-6">
          <p className="text-xl font-editorial italic text-[var(--text-heading)]">
            {post.excerpt}
          </p>
          <p className="text-[var(--text-secondary)]">{post.content}</p>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-editorial italic text-[var(--text-heading)] mb-6">
            Discussion
          </h2>

          <div className="space-y-4 mb-6">
            {comments.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-light)] text-[var(--text-primary)]"
              >
                {c.text}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write a comment…"
              className="
                flex-1 px-4 py-3 rounded-full
                bg-[var(--bg-secondary)]
                border border-[var(--border-light)]
                text-[var(--text-primary)]
                outline-none
                focus:border-[var(--accent-secondary)]
              "
            />
            <button
              onClick={addComment}
              className="w-11 h-11 rounded-full bg-[var(--accent-secondary)] flex items-center justify-center"
            >
              <Send size={16} className="text-[var(--bg-primary)]" />
            </button>
          </div>
        </section>

      </div>
    </article>
  );
}
