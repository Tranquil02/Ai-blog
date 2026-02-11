import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <section className="px-6 py-24 lg:px-12 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--text-muted)]">
            404
          </p>
          <h1 className="mt-6 text-4xl sm:text-6xl font-editorial italic text-[var(--text-heading)]">
            This page does not exist.
          </h1>
          <p className="mt-6 text-lg text-[var(--text-secondary)]">
            The link may be outdated, or the page has been moved. Use the links
            below to get back on track.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="
                inline-flex items-center justify-center
                px-6 py-3 rounded-full
                bg-[var(--text-heading)]
                text-[var(--bg-primary)]
                text-xs font-semibold uppercase tracking-[0.3em]
              "
            >
              Go Home
            </Link>
            <Link
              href="/blog"
              className="
                inline-flex items-center justify-center
                px-6 py-3 rounded-full
                border border-[var(--border-light)]
                text-xs font-semibold uppercase tracking-[0.3em]
              "
            >
              Browse Blog
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
