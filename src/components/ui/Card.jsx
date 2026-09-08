/**
 * The single surface primitive every panel sits on.
 * Keeping the radius, ring and background in one place is what stops the
 * dashboard drifting into five slightly different card styles.
 */
export default function Card({ children, className = '' }) {
  return (
    <section
      className={`rounded-xl border border-[var(--border)] bg-[var(--surface)] ${className}`}
    >
      {children}
    </section>
  );
}
