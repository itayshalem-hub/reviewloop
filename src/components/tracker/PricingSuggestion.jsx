import {
  formatCurrency,
  formatRating,
  formatRatio,
  formatSignedPercent,
} from '../../utils/formatters';

/**
 * The retention loop's payoff: a proven rating gain converted into a pricing
 * question.
 *
 * Deliberate framing constraints, because this is the single easiest place for
 * a product like this to overclaim:
 *   • it is a *suggestion to test*, never a promise of revenue;
 *   • the sample size stays on screen beside the claim;
 *   • it only appears once the rating has actually held — see
 *     `pricingRecommendations` in mockData for the threshold logic;
 *   • it is dismissible, because a manager may know something the model does not.
 */
export default function PricingSuggestion({ recommendation, property, onDismiss }) {
  const suggestedRate = property.adr * (1 + recommendation.suggestedRateChangePct / 100);

  return (
    <aside className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface-subtle)] p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="eyebrow text-xs font-semibold tracking-widest text-[var(--ink-muted)] uppercase">
              Pricing suggestion
            </h4>
            <span className="rounded border border-[var(--border-strong)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--ink-secondary)]">
              Directional · n={recommendation.reviewsSinceImplemented}
            </span>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-primary)]">
            Rating has held at{' '}
            <span className="font-semibold">{formatRating(recommendation.newStableRating)}</span>{' '}
            across {recommendation.reviewsSinceImplemented} reviews since this change. Consider
            testing a{' '}
            <span className="font-semibold text-[var(--accent-strong)]">
              {formatSignedPercent(recommendation.suggestedRateChangePct)} nightly rate
            </span>{' '}
            — {formatCurrency(property.adr)} → {formatCurrency(suggestedRate)}.
          </p>

          <p className="mt-2 text-xs leading-relaxed text-[var(--ink-secondary)]">
            {recommendation.rationale}
          </p>

          {/* Occupancy is the sanity check on any rate increase: a unit already
              running full is the one with room to move on price. */}
          <p className="mt-2 text-xs text-[var(--ink-secondary)]">
            Currently {formatCurrency(property.adr)}/night at{' '}
            {formatRatio(property.occupancyRate)} occupancy.
          </p>

          <p className="mt-2 text-xs text-[var(--ink-muted)]">
            A recommendation to validate against your own booking pace — not a forecast.
          </p>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss pricing suggestion"
          className="shrink-0 rounded px-1.5 py-0.5 text-sm text-[var(--ink-muted)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--ink-primary)]"
        >
          ✕
        </button>
      </div>
    </aside>
  );
}
