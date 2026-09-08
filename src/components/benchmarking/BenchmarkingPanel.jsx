import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import CompetitiveGap from './CompetitiveGap';
import { formatPercentileRank, formatRating, formatRatingDelta } from '../../utils/formatters';

/**
 * Compare — one property, three questions.
 *
 *   1. Internal: is this unit dragging my own portfolio down?
 *   2. External: how does it sit against the local market?
 *   3. Gap: where specifically am I losing, and what do the winners do?
 *
 * Merging all three into one module matters: a manager who only sees the
 * internal view over-invests in their weakest unit even when it already beats
 * the neighbourhood.
 */

/**
 * Internal benchmark. The colour carries meaning here (above/below average), so
 * it uses the reserved status palette — and always alongside the word, never
 * colour alone.
 */
function InternalBenchmark({ internalDelta, portfolioAverage }) {
  const isAboveAverage = internalDelta >= 0;
  const toneClass = isAboveAverage
    ? 'text-[var(--status-good-text)]'
    : 'text-[var(--status-critical)]';

  return (
    <div className="rounded-lg border border-[var(--border)] p-5">
      <h3 className="eyebrow text-xs font-semibold tracking-widest text-[var(--ink-muted)] uppercase">
        Internal benchmark
      </h3>

      <p className={`mt-3 text-2xl font-semibold tracking-tight ${toneClass}`}>
        {formatRatingDelta(internalDelta)}
      </p>

      <p className="mt-1 text-sm text-[var(--ink-secondary)]">
        {isAboveAverage ? 'above' : 'below'} portfolio average
      </p>

      <p className="mt-3 border-t border-[var(--border)] pt-3 text-xs text-[var(--ink-muted)]">
        Portfolio average is {formatRating(portfolioAverage)} across all managed units.
      </p>
    </div>
  );
}

/** External benchmark: rank against the local market, on a zero-based track. */
function ExternalBenchmark({ percentile, competitorDescriptor }) {
  return (
    <div className="rounded-lg border border-[var(--border)] p-5">
      <h3 className="eyebrow text-xs font-semibold tracking-widest text-[var(--ink-muted)] uppercase">
        External benchmark
      </h3>

      <p className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink-primary)]">
        {formatPercentileRank(percentile)}
      </p>

      <p className="mt-1 text-sm text-[var(--ink-secondary)]">in the local market</p>

      {/* Percentile track — 0 to 100, so a filled bar is an honest encoding. */}
      <div className="mt-4">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-sunken)]">
          <div
            className="h-full rounded-full bg-[var(--accent)]"
            style={{ width: `${percentile}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[10px] tabular-nums text-[var(--ink-muted)]">
          <span>0th</span>
          <span>{percentile}th percentile</span>
          <span>100th</span>
        </div>
      </div>

      <p className="mt-3 border-t border-[var(--border)] pt-3 text-xs text-[var(--ink-muted)]">
        Ranked against {competitorDescriptor}.
      </p>
    </div>
  );
}

export default function BenchmarkingPanel({
  property,
  benchmark,
  internalDelta,
  portfolioAverage,
}) {
  if (!property || !benchmark) {
    return (
      <Card>
        <SectionHeader
          act="Compare"
          title="Benchmarking"
          description="How this property sits against the rest of your portfolio and the local market."
        />
        <p className="px-6 py-16 text-center text-sm text-[var(--ink-muted)]">
          Select an action item to benchmark its property.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <SectionHeader
        act="Compare"
        title="Benchmarking"
        description={`How ${property.name} sits against the rest of your portfolio and the local market.`}
      />

      <div className="space-y-5 px-6 py-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <InternalBenchmark internalDelta={internalDelta} portfolioAverage={portfolioAverage} />
          <ExternalBenchmark
            percentile={benchmark.externalPercentile}
            competitorDescriptor={benchmark.competitorDescriptor}
          />
        </div>

        <CompetitiveGap benchmark={benchmark} />
      </div>
    </Card>
  );
}
