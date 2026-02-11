function Section({ title, subtitle, children }) {
  return (
    <section className="max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl font-editorial italic text-[var(--text-heading)]">
          {title}
        </h2>
        <p className="mt-2 text-[var(--text-secondary)]">
          {subtitle}
        </p>
      </div>

      {children}
    </section>
  );
}

export default Section;
