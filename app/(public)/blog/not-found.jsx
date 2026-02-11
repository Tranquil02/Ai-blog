import Link from "next/link";

export const metadata = {
  title: "Blog Not Found",
  description: "The article you are looking for does not exist.",
  robots: { index: false },
};

export default function BlogNotFound() {
  return (
    <main className="bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <section className="px-6 py-24 lg:px-12 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--text-muted)]">
            Article Missing
          </p>
          <h1 className="mt-6 text-4xl sm:text-6xl font-editorial italic text-[var(--text-heading)]">
            We could not find that story.
          </h1>
          <p className="mt-6 text-lg text-[var(--text-secondary)]">
            It may have been moved or unpublished. Browse the archive or head
            back to the homepage.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blog"
              className="
                inline-flex items-center justify-center
                px-6 py-3 rounded-full
                bg-[var(--text-heading)]
                text-[var(--bg-primary)]
                text-xs font-semibold uppercase tracking-[0.3em]
              "
            >
              Go to Blog
            </Link>
            <Link
              href="/"
              className="
                inline-flex items-center justify-center
                px-6 py-3 rounded-full
                border border-[var(--border-light)]
                text-xs font-semibold uppercase tracking-[0.3em]
              "
            >
              Back Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
