/**
 * Small labelling primitives.
 *
 * Colour discipline: category tags stay neutral so the eye is never asked to
 * decode five hues, while status uses the reserved status palette — and always
 * pairs the colour with a word, never colour alone.
 */

/** Maps an action's lifecycle status to its reserved status colours. */
const STATUS_STYLES = {
  New: 'bg-[var(--surface-sunken)] text-[var(--ink-secondary)]',
  'In Progress': 'bg-[var(--status-warning-wash)] text-[var(--status-warning-text)]',
  Implemented: 'bg-[var(--status-good-wash)] text-[var(--status-good-text)]',
};

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

/** A review category, rendered neutrally — identity without visual competition. */
export function CategoryTag({ category }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-md border border-[var(--border)] px-2 py-0.5 text-xs font-medium text-[var(--ink-secondary)]">
      {category}
    </span>
  );
}
