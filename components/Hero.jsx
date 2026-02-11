import SectionReveal from "./ui/SectionReveal";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--bg-primary)] paper-texture">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[var(--accent-primary)]/15 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-48 w-48 rounded-full bg-[var(--accent-secondary)]/15 blur-3xl" />
      </div>

      <div className="min-h-[85vh] flex items-center px-6 py-20">
        <SectionReveal className="w-full">
          <div className="max-w-5xl mx-auto text-left">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--text-muted)]">
              The TrendyStory Journal
            </p>
            <h1 className="mt-6 text-[12vw] sm:text-[6rem] lg:text-[7.5rem] font-editorial italic text-[var(--text-heading)] leading-[0.9]">
              Build smarter
              <br />
              <span className="text-[var(--accent-primary)]">AI-first</span> teams.
            </h1>
            <p className="mt-8 max-w-2xl text-lg sm:text-xl text-[var(--text-secondary)]">
              Strategy notes, field guides, and real workflows to help small
              businesses automate operations, sharpen marketing, and ship faster.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--text-heading)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--bg-primary)] shadow-[var(--shadow-soft)] transition hover:translate-y-[-1px]"
              >
                Explore Journal
              </Link>
              <a
                href="#blog"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border-light)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-heading)] transition hover:bg-[var(--hover-bg)]"
              >
                Latest Stories
              </a>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
