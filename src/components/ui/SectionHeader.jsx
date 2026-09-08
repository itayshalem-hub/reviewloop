/**
 * The heading for each of the three dashboard acts.
 *
 * The `act` chip is the product's narrative spine — Act, Prove, Compare — and
 * makes the flow between the panels legible at a glance.
 */
export default function SectionHeader({ act, title, description, children }) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border)] px-6 py-5">
      <div className="min-w-0">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="eyebrow rounded bg-[var(--accent-wash)] px-1.5 py-0.5 text-[10px] font-semibold tracking-widest text-[var(--accent-strong)] uppercase">
            {act}
          </span>
        </div>
        <h2 className="text-base font-semibold text-[var(--ink-primary)]">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm text-[var(--ink-secondary)]">{description}</p>
      </div>

      {/* Optional slot for controls that belong to the section header. */}
      {children}
    </header>
  );
}
