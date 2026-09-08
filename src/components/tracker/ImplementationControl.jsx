import { useState } from 'react';
import { formatLongDate } from '../../utils/formatters';

/**
 * The one write action in the whole dashboard: recording when a fix went live.
 *
 * That date is the pivot the entire ROI story turns on, so it is captured
 * explicitly rather than inferred from when someone clicked a button. A guessed
 * date would silently mis-split every before/after comparison downstream.
 */
export default function ImplementationControl({ actionItem, onMarkImplemented }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftDate, setDraftDate] = useState(
    actionItem.implementedDate ?? new Date().toISOString().slice(0, 10),
  );

  /** Commit the date and collapse the form. */
  function handleConfirm() {
    if (!draftDate) return;
    onMarkImplemented(actionItem.id, draftDate);
    setIsEditing(false);
  }

  /** Discard the draft and restore the last committed value. */
  function handleCancel() {
    setDraftDate(actionItem.implementedDate ?? new Date().toISOString().slice(0, 10));
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-[var(--accent)] bg-[var(--accent-wash)] px-4 py-3">
        <label className="flex flex-col gap-1">
          <span className="eyebrow text-[10px] font-semibold tracking-widest text-[var(--ink-secondary)] uppercase">
            Date implemented
          </span>
          <input
            type="date"
            value={draftDate}
            onChange={(event) => setDraftDate(event.target.value)}
            className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--ink-primary)] focus:border-[var(--accent)] focus:outline-none"
          />
        </label>

        <button
          type="button"
          onClick={handleConfirm}
          className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-strong)]"
        >
          Confirm
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--ink-secondary)] transition-colors hover:bg-[var(--surface-sunken)]"
        >
          Cancel
        </button>

        <p className="w-full text-xs text-[var(--ink-secondary)]">
          The chart splits at this date — reviews after it count as evidence of the change.
        </p>
      </div>
    );
  }

  if (actionItem.implementedDate) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-xs text-[var(--ink-secondary)]">
          Implemented on{' '}
          <span className="font-semibold text-[var(--ink-primary)]">
            {formatLongDate(actionItem.implementedDate)}
          </span>
        </p>
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="text-xs font-medium text-[var(--accent)] underline-offset-2 hover:underline"
        >
          Change date
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className="rounded-lg border border-[var(--accent)] px-3 py-1.5 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent-wash)]"
    >
      Mark as implemented
    </button>
  );
}
