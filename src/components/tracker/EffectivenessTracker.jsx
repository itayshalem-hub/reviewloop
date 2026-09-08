import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import BeforeAfterChart from './BeforeAfterChart';
import GatheringDataState from './GatheringDataState';
import ImplementationControl from './ImplementationControl';
import ImplementationTimeline from './ImplementationTimeline';
import PricingSuggestion from './PricingSuggestion';
import { revenueModel } from '../../data/mockData';
import { formatRating, formatRatingDelta } from '../../utils/formatters';
import {
  buildBeforeAfterSeries,
  calculateRatingLift,
  findImplementationBoundaryDate,
  getCategoryHistory,
  hasEnoughDataToPlot,
} from '../../utils/portfolioMetrics';

/**
 * Prove — did the fix actually move the number?
 *
 * Everything in this panel is scoped to the action selected in the panel above,
 * which keeps the flow readable as a sentence: *this task, on this property,
 * moved this category by this much, measured across this many reviews.*
 */

/** Before → After → delta, with the sample size behind each side. */
function RatingLiftSummary({ lift }) {
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
      <div>
        <div className="text-lg font-semibold text-[var(--ink-secondary)]">
          {formatRating(lift.beforeAverage)}
        </div>
        <div className="text-xs text-[var(--ink-muted)]">Before · n={lift.beforeReviews}</div>
      </div>

      <span className="text-[var(--ink-muted)]" aria-hidden="true">
        →
      </span>

      <div>
        <div className="text-lg font-semibold text-[var(--ink-primary)]">
          {formatRating(lift.afterAverage)}
        </div>
        <div className="text-xs text-[var(--ink-muted)]">After · n={lift.afterReviews}</div>
      </div>

      <div className="rounded-lg bg-[var(--accent-wash)] px-3 py-2">
        <div className="text-lg font-semibold text-[var(--accent-strong)]">
          {formatRatingDelta(lift.delta)}
        </div>
        <div className="text-xs text-[var(--ink-secondary)]">category rating</div>
      </div>
    </div>
  );
}

/**
 * The caveat that keeps the panel honest. A lift measured on a handful of
 * reviews is a signal worth watching, not a result worth reporting to an owner.
 */
function EvidenceStrengthNote({ lift }) {
  if (lift.isSustained) {
    return (
      <p className="text-xs leading-relaxed text-[var(--ink-secondary)]">
        Based on {lift.afterReviews} reviews since the change — enough to treat this lift as
        sustained.
      </p>
    );
  }

  return (
    <p className="rounded-lg bg-[var(--status-warning-wash)] px-3 py-2 text-xs leading-relaxed text-[var(--status-warning-text)]">
      Directional only: {lift.afterReviews} review
      {lift.afterReviews === 1 ? '' : 's'} since the change, below the{' '}
      {revenueModel.sustainedReviewThreshold}-review bar this product uses before calling a lift
      proven.
    </p>
  );
}

/** Shown before the user has picked anything — the panel explains its own input. */
function NoSelectionState() {
  return (
    <p className="px-6 py-16 text-center text-sm text-[var(--ink-muted)]">
      Select an action item above to see whether it moved the rating.
    </p>
  );
}

export default function EffectivenessTracker({
  selectedAction,
  property,
  pricingRecommendation,
  isPricingDismissed,
  onMarkImplemented,
  onDismissPricing,
}) {
  if (!selectedAction || !property) {
    return (
      <Card>
        <SectionHeader
          act="Prove"
          title="Effectiveness & pricing tracker"
          description="Before/after evidence that a completed action changed the rating it was meant to change."
        />
        <NoSelectionState />
      </Card>
    );
  }

  const categoryHistory = getCategoryHistory(property, selectedAction.category);
  const canPlot = hasEnoughDataToPlot(categoryHistory);
  const { implementedDate } = selectedAction;

  // Only a real implementation date produces a split, a lift, or a boundary marker.
  const lift = implementedDate ? calculateRatingLift(categoryHistory, implementedDate) : null;
  const boundaryDate = implementedDate
    ? findImplementationBoundaryDate(categoryHistory, implementedDate)
    : null;
  const series = buildBeforeAfterSeries(categoryHistory, implementedDate);

  // The pricing prompt is earned, not automatic: it needs a recommendation, an
  // undismissed state, and enough post-change reviews to stand behind.
  const shouldShowPricing =
    pricingRecommendation &&
    !isPricingDismissed &&
    pricingRecommendation.reviewsSinceImplemented >= revenueModel.sustainedReviewThreshold;

  return (
    <Card>
      <SectionHeader
        act="Prove"
        title="Effectiveness & pricing tracker"
        description="Before/after evidence that a completed action changed the rating it was meant to change."
      />

      <div className="space-y-6 px-6 py-5">
        {/* What is being measured, and the control that sets the pivot date. */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--ink-primary)]">
              {selectedAction.title}
            </p>
            <p className="mt-1 text-xs text-[var(--ink-secondary)]">
              {property.name} · tracking {selectedAction.category}
            </p>
          </div>
          <ImplementationControl
            actionItem={selectedAction}
            onMarkImplemented={onMarkImplemented}
          />
        </div>

        <div className="border-y border-[var(--border)] py-4">
          <ImplementationTimeline
            actionItem={selectedAction}
            reviewsSinceImplementation={lift ? lift.afterReviews : 0}
          />
        </div>

        {canPlot ? (
          <div className="space-y-5">
            {lift ? (
              <div className="space-y-3">
                <RatingLiftSummary lift={lift} />
                <EvidenceStrengthNote lift={lift} />
              </div>
            ) : (
              <p className="text-xs leading-relaxed text-[var(--ink-secondary)]">
                Not yet implemented — the line below is the current trend. Mark an implementation
                date to split it into before and after.
              </p>
            )}

            <BeforeAfterChart
              series={series}
              boundaryDate={boundaryDate}
              implementedDate={implementedDate}
            />

            {shouldShowPricing && (
              <PricingSuggestion
                recommendation={pricingRecommendation}
                property={property}
                onDismiss={() => onDismissPricing(property.id)}
              />
            )}
          </div>
        ) : (
          <GatheringDataState
            dataPointCount={categoryHistory.length}
            totalReviews={categoryHistory.reduce((sum, entry) => sum + entry.reviewCount, 0)}
          />
        )}
      </div>
    </Card>
  );
}
