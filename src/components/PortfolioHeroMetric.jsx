import InfoTooltip from './ui/InfoTooltip';
import { revenueModel } from '../data/mockData';
import { formatCurrency, formatRatingDelta } from '../utils/formatters';

/**
 * One stat, in three parts, answering the only question a PMC owner asks of a
 * review tool: what did this earn me?
 *
 * Rule enforced here: no figure appears without its basis. The revenue number
 * carries a visible model caption plus an expandable assumption, because a
 * dollar amount with no stated method is the fastest way to lose a buyer's
 * trust in a QBR.
 */

/** A single figure in the hero row. Proportional figures — never tabular at display size. */
function HeroStat({ value, label, tone = 'primary', children }) {
  const valueColor = tone === 'accent' ? 'text-[var(--accent-strong)]' : 'text-[var(--ink-primary)]';

  return (
    <div className="min-w-0">
      <div className={`text-3xl font-semibold tracking-tight ${valueColor}`}>{value}</div>
      <div className="mt-1 flex items-center gap-1.5">
        <span className="text-sm text-[var(--ink-secondary)]">{label}</span>
        {children}
      </div>
    </div>
  );
}

export default function PortfolioHeroMetric({ impact, propertyCount }) {
  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-5">
      <div className="flex items-center gap-2">
        <h2 className="eyebrow text-xs font-semibold tracking-widest text-[var(--ink-muted)] uppercase">
          Portfolio impact
        </h2>
        <span className="text-xs text-[var(--ink-muted)]">
          · {propertyCount} properties · last 8 months
        </span>
      </div>

      {/* The three parts of the headline claim: the lift, its value, its volume. */}
      <div className="mt-4 flex flex-wrap items-start gap-x-12 gap-y-6">
        <HeroStat
          value={formatRatingDelta(impact.averageRatingLift)}
          label="average rating lift"
          tone="accent"
        />

        <HeroStat
          value={`~${formatCurrency(impact.estimatedMonthlyRevenue)}/mo`}
          label="estimated added revenue"
        >
          <InfoTooltip label="How estimated added revenue is calculated">
            {revenueModel.caption}
          </InfoTooltip>
        </HeroStat>

        <HeroStat
          value={impact.implementedActionCount}
          label={`implemented actions across ${impact.propertiesImprovedCount} properties`}
        />
      </div>

      {/* The assumption stays on screen, not only inside the tooltip. */}
      <p className="mt-5 border-t border-[var(--border)] pt-4 text-xs leading-relaxed text-[var(--ink-muted)]">
        {revenueModel.caption}
      </p>
    </section>
  );
}
