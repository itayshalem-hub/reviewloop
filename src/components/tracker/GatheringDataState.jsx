import { CHART_CONFIDENCE_THRESHOLDS } from '../../data/mockData';

/**
 * The honest empty state.
 *
 * Drawing a trend line through four reviews would be the easiest way to make
 * this product look impressive and the fastest way to make it untrustworthy.
 * When the sample is too thin, the chart is replaced by an explicit statement of
 * what is missing and what would unlock it.
 */
export default function GatheringDataState({ dataPointCount, totalReviews }) {
  const reviewsStillNeeded = Math.max(
    0,
    CHART_CONFIDENCE_THRESHOLDS.minimumTotalReviews - totalReviews,
  );

  return (
    <div className="rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--surface-subtle)] px-6 py-10 text-center">
      <p className="text-sm font-semibold text-[var(--ink-primary)]">Gathering data</p>

      <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[var(--ink-secondary)]">
        This category has {totalReviews} review{totalReviews === 1 ? '' : 's'} across{' '}
        {dataPointCount} month{dataPointCount === 1 ? '' : 's'} — below the{' '}
        {CHART_CONFIDENCE_THRESHOLDS.minimumTotalReviews}-review,{' '}
        {CHART_CONFIDENCE_THRESHOLDS.minimumDataPoints}-month minimum this product uses before
        drawing a trend.
      </p>

      <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-[var(--ink-muted)]">
        {reviewsStillNeeded > 0
          ? `${reviewsStillNeeded} more review${reviewsStillNeeded === 1 ? '' : 's'} will unlock the before/after comparison.`
          : 'A few more monthly data points will unlock the before/after comparison.'}{' '}
        We would rather show nothing than a line that implies certainty the sample cannot support.
      </p>
    </div>
  );
}
