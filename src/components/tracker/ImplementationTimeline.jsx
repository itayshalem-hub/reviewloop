import { formatLongDate } from '../../utils/formatters';

/**
 * The lifecycle of a single recommendation: detected → implemented → measured.
 *
 * This is the product's retention loop rendered literally. A manager can see at
 * a glance which stage a fix is at, and — critically — that "measured" is a real
 * stage that takes time rather than something the tool claims instantly.
 */

/** One node on the timeline. A completed step is filled; a pending one is hollow. */
function TimelineStep({ title, detail, isComplete, isLast }) {
  return (
    <li className="flex flex-1 items-start gap-3">
      <div className="flex flex-col items-center self-stretch">
        <span
          className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 ${
            isComplete
              ? 'border-[var(--accent)] bg-[var(--accent)]'
              : 'border-[var(--border-strong)] bg-[var(--surface)]'
          }`}
          aria-hidden="true"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-xs font-semibold ${
            isComplete ? 'text-[var(--ink-primary)]' : 'text-[var(--ink-muted)]'
          }`}
        >
          {title}
        </p>
        <p className="mt-0.5 text-xs text-[var(--ink-muted)]">{detail}</p>
      </div>

      {/* Connector between nodes, omitted after the final step. */}
      {!isLast && <span className="mt-2 hidden h-px flex-1 bg-[var(--border)] sm:block" aria-hidden="true" />}
    </li>
  );
}

export default function ImplementationTimeline({ actionItem, reviewsSinceImplementation }) {
  const isImplemented = Boolean(actionItem.implementedDate);
  const hasMeasurement = isImplemented && reviewsSinceImplementation > 0;

  return (
    <ol className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-2">
      <TimelineStep
        title="Detected"
        detail={`${actionItem.category} signal in guest reviews`}
        isComplete
      />
      <TimelineStep
        title="Implemented"
        detail={
          isImplemented ? formatLongDate(actionItem.implementedDate) : 'Not yet marked as done'
        }
        isComplete={isImplemented}
      />
      <TimelineStep
        title="Measured"
        detail={
          hasMeasurement
            ? `${reviewsSinceImplementation} reviews collected since`
            : 'Awaiting post-change reviews'
        }
        isComplete={hasMeasurement}
        isLast
      />
    </ol>
  );
}
