/**
 * Product masthead.
 *
 * The one-line positioning statement is deliberate: a reviewer landing on this
 * portfolio piece should know what the product does before they read a single
 * number.
 */
export default function DashboardHeader({ propertyCount }) {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            {/* Wordmark */}
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent)] text-sm font-bold text-white">
              R
            </span>
            <h1 className="text-lg font-semibold tracking-tight text-[var(--ink-primary)]">
              ReviewLoop
            </h1>
            <span className="eyebrow rounded border border-[var(--border-strong)] px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-[var(--ink-muted)] uppercase">
              Mockup
            </span>
          </div>

          <p className="mt-1.5 text-sm text-[var(--ink-secondary)]">
            Turns guest reviews into operational work, proves the rating lift, and prices it.
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-medium text-[var(--ink-primary)]">Coastal Stays Management</p>
          <p className="text-xs text-[var(--ink-muted)]">{propertyCount} managed properties</p>
        </div>
      </div>
    </header>
  );
}
