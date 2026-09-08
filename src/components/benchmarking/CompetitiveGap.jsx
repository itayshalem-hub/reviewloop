import { formatRating } from '../../utils/formatters';

/**
 * Compare — where anonymised local top performers beat this property, and what
 * they appear to be doing about it.
 *
 * Form note: the score comparison is drawn as a dot plot, not bars. Bars must
 * start at zero, and a 0–5 bar makes 4.4 and 4.9 look identical; a dot plot
 * legitimately uses a zoomed domain, so the gap that matters stays visible
 * without exaggerating it. The domain endpoints are labelled so the zoom is
 * declared rather than hidden.
 */

/** Position a value on the plot's domain as a percentage of its width. */
function positionOnScale(value, domainMin, domainMax) {
  return ((value - domainMin) / (domainMax - domainMin)) * 100;
}

/** Two points on one scale, with the gap between them shaded. */
function ScoreGapPlot({ yourScore, competitorScore, category }) {
  // A zoomed but declared domain: padded below the lower score, capped at 5.
  const domainMin = Math.min(4, Math.floor((Math.min(yourScore, competitorScore) - 0.2) * 10) / 10);
  const domainMax = 5;

  const yourPosition = positionOnScale(yourScore, domainMin, domainMax);
  const competitorPosition = positionOnScale(competitorScore, domainMin, domainMax);

  return (
    <figure className="m-0">
      <figcaption className="mb-4 text-xs text-[var(--ink-secondary)]">
        {category} score · you vs anonymised local top decile
      </figcaption>

      <div className="relative h-10">
        {/* Track */}
        <div className="absolute top-4 h-0.5 w-full rounded-full bg-[var(--grid)]" />

        {/* The gap itself — the only part of the track that is coloured. */}
        <div
          className="absolute top-4 h-0.5 rounded-full bg-[var(--accent)] opacity-40"
          style={{
            left: `${Math.min(yourPosition, competitorPosition)}%`,
            width: `${Math.abs(competitorPosition - yourPosition)}%`,
          }}
        />

        {/* Your score — recessive neutral. */}
        <div
          className="absolute top-4 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{ left: `${yourPosition}%` }}
        >
          <span className="h-3 w-3 rounded-full border-2 border-[var(--surface)] bg-[var(--ink-muted)]" />
        </div>

        {/* Market score — the accent, because it is the target. */}
        <div
          className="absolute top-4 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{ left: `${competitorPosition}%` }}
        >
          <span className="h-3 w-3 rounded-full border-2 border-[var(--surface)] bg-[var(--accent)]" />
        </div>

        {/* Domain endpoints, so the zoomed scale is explicit. */}
        <span className="absolute top-7 left-0 text-[10px] tabular-nums text-[var(--ink-muted)]">
          {domainMin.toFixed(1)}
        </span>
        <span className="absolute top-7 right-0 text-[10px] tabular-nums text-[var(--ink-muted)]">
          {domainMax.toFixed(1)}
        </span>
      </div>

      {/* Direct labels — identity never rests on colour alone. */}
      <ul className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
        <li className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--ink-muted)]" aria-hidden="true" />
          <span className="text-xs text-[var(--ink-secondary)]">
            You <span className="font-semibold text-[var(--ink-primary)]">{formatRating(yourScore)}</span>
          </span>
        </li>
        <li className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />
          <span className="text-xs text-[var(--ink-secondary)]">
            Local top decile{' '}
            <span className="font-semibold text-[var(--ink-primary)]">
              {formatRating(competitorScore)}
            </span>
          </span>
        </li>
      </ul>
    </figure>
  );
}

/**
 * What the top performers' guests actually praise, by mention count.
 * Bars are zero-based here because frequency is a true magnitude.
 */
function PositiveKeywords({ keywords }) {
  const highestFrequency = Math.max(...keywords.map((entry) => entry.frequency));

  return (
    <div>
      <h4 className="eyebrow text-xs font-semibold tracking-widest text-[var(--ink-muted)] uppercase">
        Recurring praise nearby
      </h4>

      <ul className="mt-3 space-y-2">
        {keywords.map((entry) => (
          <li key={entry.keyword} className="flex items-center gap-3">
            <span className="w-36 shrink-0 truncate text-xs text-[var(--ink-secondary)]">
              {entry.keyword}
            </span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-sunken)]">
              <span
                className="block h-full rounded-full bg-[var(--accent)] opacity-70"
                style={{ width: `${(entry.frequency / highestFrequency) * 100}%` }}
              />
            </span>
            <span className="w-6 shrink-0 text-right text-xs tabular-nums text-[var(--ink-muted)]">
              {entry.frequency}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CompetitiveGap({ benchmark }) {
  return (
    <div className="space-y-6 rounded-lg border border-[var(--border)] p-5">
      <div>
        <h3 className="text-sm font-semibold text-[var(--ink-primary)]">Competitive gap</h3>
        <p className="mt-1 text-xs leading-relaxed text-[var(--ink-secondary)]">
          Compared against {benchmark.competitorDescriptor}. Competitors are anonymised by type and
          distance only — the pattern is the product, not the neighbour's identity.
        </p>
      </div>

      <ScoreGapPlot
        yourScore={benchmark.yourCategoryScore}
        competitorScore={benchmark.competitorCategoryScore}
        category={benchmark.weakestCategory}
      />

      <PositiveKeywords keywords={benchmark.positiveKeywords} />

      {/* The takeaway: one thing to do, not a list of observations. */}
      <div className="rounded-lg bg-[var(--accent-wash)] p-4">
        <h4 className="eyebrow text-xs font-semibold tracking-widest text-[var(--accent-strong)] uppercase">
          Suggested best practice
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ink-primary)]">
          {benchmark.suggestedBestPractice}
        </p>
      </div>
    </div>
  );
}
