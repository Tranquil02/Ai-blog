export default function Logo({ className = "" }) {
  return (
    <span className={`inline-flex items-end gap-1 ${className}`}>
      <span className="font-sans font-black tracking-tight text-[var(--text-heading)]">
        Trendystory
      </span>
      <span
        aria-hidden="true"
        className="inline-block w-2 h-2 rounded-full bg-[var(--accent-primary)] translate-y-[-2px]"
      />
    </span>
  );
}
