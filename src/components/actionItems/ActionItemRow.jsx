import { CategoryTag, StatusBadge } from '../ui/Badge';

/**
 * A single AI-generated recommendation.
 *
 * The row is a button because selecting it drives the two panels below — this
 * is the hinge of the whole dashboard flow (pick a task → see its ROI → see the
 * market gap it leaves). The left rail turns accent when selected so the link
 * between the three panels is visible rather than implied.
 */
export default function ActionItemRow({ actionItem, isSelected, onSelect }) {
  const selectionStyles = isSelected
    ? 'border-l-[var(--accent)] bg-[var(--accent-wash)]'
    : 'border-l-transparent hover:bg-[var(--surface-subtle)]';

  return (
    <button
      type="button"
      onClick={() => onSelect(actionItem.id)}
      aria-pressed={isSelected}
      className={`block w-full border-b border-l-2 border-b-[var(--border)] px-6 py-4 text-left transition-colors ${selectionStyles}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {/* Provenance line: which unit, which category, where it stands. */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[var(--ink-secondary)]">
              {actionItem.propertyName}
            </span>
            <CategoryTag category={actionItem.category} />
            <StatusBadge status={actionItem.status} />
          </div>

          {/* The task itself — written as a work order, not an observation. */}
          <p className="mt-2 text-sm leading-snug font-semibold text-[var(--ink-primary)]">
            {actionItem.title}
          </p>

          {/* The evidence. Every task must be traceable to a guest's words. */}
          <blockquote className="mt-2 border-l-2 border-[var(--border-strong)] pl-3 text-xs leading-relaxed text-[var(--ink-muted)] italic">
            “{actionItem.sourceReviewQuote}”
          </blockquote>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-sm font-semibold text-[var(--ink-primary)]">
            {actionItem.estimatedImpact}
          </div>
          <div className="eyebrow text-[10px] tracking-wide text-[var(--ink-muted)] uppercase">
            est. impact
          </div>
        </div>
      </div>
    </button>
  );
}
