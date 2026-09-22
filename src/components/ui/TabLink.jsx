/**
 * A cross-tab navigation link — the connective tissue between the three
 * dashboard sections now that they live on separate tabs instead of one
 * scrolling page. Styled as a link, not a button, because it moves the reader
 * somewhere rather than changing anything.
 */
export default function TabLink({ direction = 'forward', children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
    >
      {direction === 'back' && <span aria-hidden="true">←</span>}
      {children}
      {direction === 'forward' && <span aria-hidden="true">→</span>}
    </button>
  );
}
