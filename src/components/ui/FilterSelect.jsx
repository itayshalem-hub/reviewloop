/**
 * A labelled dropdown used by the action-item filter row.
 *
 * Options are passed as plain `{ value, label }` objects so callers stay
 * declarative and no component needs to know how a property id maps to a name.
 */
export default function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="eyebrow text-[10px] font-semibold tracking-widest text-[var(--ink-muted)] uppercase">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 cursor-pointer rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--ink-primary)] transition-colors hover:border-[var(--accent)] focus:border-[var(--accent)] focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
