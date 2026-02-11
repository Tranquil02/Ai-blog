import Footer from "@/components/footer";
import Section from "@/components/Section";
import { getQuotesForPage } from "@/lib/quotes";

export const metadata = {
  title: "Quotes",
  description:
    "Daily AI-powered quotes on productivity, agentic workflows, and modern teams.",
};

export const dynamic = "force-dynamic";

const QuoteCard = ({ quote }) => {
  return (
    <div className="rounded-[2rem] border border-[var(--border-light)] bg-[var(--bg-secondary)] p-8 shadow-[var(--shadow-soft)]">
      <p className="text-xl font-editorial italic text-[var(--text-heading)]">
        “{quote.text}”
      </p>
      <p className="mt-4 text-xs uppercase tracking-[0.4em] text-[var(--text-muted)]">
        {quote.author || "TrendyStory AI"}
      </p>
    </div>
  );
};

export default async function QuotesPage() {
  const { daily, archive, dayKey } = await getQuotesForPage();

  return (
    <>
      <main className="bg-[var(--bg-primary)] mt-24">
        <section className="relative px-6 pb-16 pt-8 lg:pt-16">
          <div className="max-w-6xl mx-auto text-left">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--text-muted)]">
              TrendyStory Quotes
            </p>
            <h1 className="mt-4 text-4xl sm:text-6xl lg:text-7xl font-editorial italic text-[var(--text-heading)] leading-tight">
              Catchy, AI‑crafted insights to reset your focus.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-[var(--text-secondary)]">
              A daily stream of punchy ideas on agentic work, product velocity,
              and building with clarity.
            </p>
          </div>
        </section>

        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            <Section
              title="Today’s Drop"
              subtitle={`Fresh quotes for ${dayKey}`}
            >
              {daily.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {daily.map((quote) => (
                    <QuoteCard key={quote._id} quote={quote} />
                  ))}
                </div>
              ) : (
                <div className="rounded-[2rem] border border-[var(--border-light)] bg-[var(--bg-secondary)] p-10 text-center shadow-[var(--shadow-soft)]">
                  <h3 className="text-2xl font-editorial italic text-[var(--text-heading)]">
                    Quotes are warming up.
                  </h3>
                  <p className="mt-3 text-[var(--text-secondary)]">
                    Enable Gemini to generate today’s drop automatically.
                  </p>
                </div>
              )}
            </Section>
          </div>
        </section>

        <section className="px-6 pb-32">
          <div className="max-w-6xl mx-auto">
            <Section
              title="Quote Archive"
              subtitle="The best lines from recent days"
            >
              {archive.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {archive.map((quote) => (
                    <QuoteCard key={quote._id} quote={quote} />
                  ))}
                </div>
              ) : (
                <div className="rounded-[2rem] border border-[var(--border-light)] bg-[var(--bg-secondary)] p-10 text-center shadow-[var(--shadow-soft)]">
                  <h3 className="text-2xl font-editorial italic text-[var(--text-heading)]">
                    No archive yet.
                  </h3>
                  <p className="mt-3 text-[var(--text-secondary)]">
                    Once the daily generator runs, the archive will appear here.
                  </p>
                </div>
              )}
            </Section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
