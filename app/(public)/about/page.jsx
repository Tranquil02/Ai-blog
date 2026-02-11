export const metadata = {
  title: "About TrendyStory",
  description:
    "Learn about TrendyStory, the journal for practical AI workflows and modern small business growth.",
};

export default function AboutPage() {
  return (
    <main className="bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <section className="px-6 py-20 lg:px-12 lg:py-28">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--text-muted)]">
            About TrendyStory
          </p>
          <h1 className="mt-6 text-4xl sm:text-6xl font-editorial italic text-[var(--text-heading)]">
            We turn AI noise into practical workflows.
          </h1>
          <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-3xl">
            TrendyStory is a modern journal for founders and small teams who
            want to adopt AI without the hype. We publish playbooks, field notes,
            and experiments that make automation feel concrete and doable.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24 lg:px-12">
        <div className="max-w-5xl mx-auto grid gap-10 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-[var(--border-light)] bg-[var(--bg-secondary)] p-8 shadow-[var(--shadow-soft)]">
            <h2 className="text-2xl font-editorial italic text-[var(--text-heading)]">
              What we cover
            </h2>
            <p className="mt-4 text-[var(--text-secondary)]">
              Automation workflows, AI tooling guides, and operational systems
              that help small businesses move faster with fewer resources.
            </p>
          </div>
          <div className="rounded-[2rem] border border-[var(--border-light)] bg-[var(--bg-secondary)] p-8 shadow-[var(--shadow-soft)]">
            <h2 className="text-2xl font-editorial italic text-[var(--text-heading)]">
              Why we exist
            </h2>
            <p className="mt-4 text-[var(--text-secondary)]">
              We believe AI should feel like a capable teammate. Our goal is to
              make the tooling practical, measurable, and accessible.
            </p>
          </div>
          <div className="rounded-[2rem] border border-[var(--border-light)] bg-[var(--bg-secondary)] p-8 shadow-[var(--shadow-soft)]">
            <h2 className="text-2xl font-editorial italic text-[var(--text-heading)]">
              Our promise
            </h2>
            <p className="mt-4 text-[var(--text-secondary)]">
              No fluff, no empty predictions. Just clear guidance, tested ideas,
              and a consistent focus on practical outcomes.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
