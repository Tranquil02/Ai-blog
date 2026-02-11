export default function Newsletter() {
  return (
    <section className="py-32 text-center px-6 bg-[var(--bg-primary)]">
      <h2 className="text-6xl md:text-8xl font-editorial italic text-[var(--text-heading)]">
        This is not a{" "}
        <span className="gold-shimmer not-italic font-black">
          Newsletter
        </span>
        .
      </h2>

      <p className="mt-8 max-w-2xl mx-auto text-[var(--text-secondary)] text-lg md:text-2xl italic font-editorial">
        A signal-rich briefing for founders and operators who want AI to
        actually save time and money.
      </p>

      <form className="mt-12 flex justify-center gap-4 flex-wrap">
        <input
          type="email"
          placeholder="you@trendystory.com"
          className="
            px-6 py-4 rounded-full
            bg-[var(--bg-secondary)]
            border border-[var(--border-light)]
            text-[var(--text-primary)]
            outline-none
            focus:border-[var(--accent-secondary)]
          "
        />
        <button
          className="
            px-8 py-4 rounded-full
            bg-[var(--accent-secondary)]
            text-[var(--bg-primary)]
            font-black uppercase
            text-xs tracking-widest
            hover:bg-[var(--text-heading)]
            transition-colors
          "
        >
          Enter
        </button>
      </form>

      <p className="mt-4 text-xs text-[var(--text-muted)]">
        Monthly field notes. No spam. Unsubscribe anytime.
      </p>
    </section>
  );
}
