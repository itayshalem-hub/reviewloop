import { useState } from 'react';

/**
 * A hover/focus disclosure for the assumption behind a number.
 *
 * Every modelled figure in this product is required to show its basis, so this
 * is a load-bearing component rather than decoration. It opens on focus as well
 * as hover so the explanation is reachable by keyboard.
 */
export default function InfoTooltip({ label, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label={label}
        className="flex h-4 w-4 items-center justify-center rounded-full border border-[var(--border-strong)] text-[10px] font-semibold text-[var(--ink-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      >
        ?
      </button>

      {isOpen && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-xs leading-relaxed font-normal text-[var(--ink-secondary)] shadow-lg"
        >
          {children}
        </span>
      )}
    </span>
  );
}
