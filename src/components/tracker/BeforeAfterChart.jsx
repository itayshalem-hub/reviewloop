import { useState } from 'react';
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CHART_COLORS, CHART_GEOMETRY } from '../../utils/chartTheme';
import { formatMonthLabel, formatRating } from '../../utils/formatters';

/**
 * The proof chart: one category rating over time, split into a "before" and an
 * "after" segment at the date the fix went live.
 *
 * Encoding choices worth stating, because they are the difference between a
 * chart that argues and a chart that decorates:
 *   • the before segment is a recessive neutral and the after segment carries
 *     the accent, so attention lands on the outcome rather than the history;
 *   • the sample size (`n=`) sits under every point — a jump built on 3 reviews
 *     and a jump built on 30 must not look identical;
 *   • the reference line is dashed because it marks a threshold in time, which
 *     is the one thing in this chart that legitimately is not data.
 */

/** Horizontal nudge applied to the one label that would sit under the marker. */
const BOUNDARY_LABEL_OFFSET_X = -16;

/**
 * Small muted `n=` beneath each point, so sample size is never hidden in a
 * tooltip.
 *
 * Two legibility details:
 *   • the glyphs are painted over a surface-coloured outline
 *     (`paintOrder="stroke"`), knocking a halo out of any gridline behind them;
 *   • the label on the boundary point is nudged left, because the implementation
 *     marker is drawn above the label layer and would otherwise strike through
 *     it. Left is the correct direction — that point is the last "before"
 *     reading, so the label moves into the region it belongs to.
 */
function ReviewCountLabel({ x, y, value, index, boundaryIndex }) {
  const offsetX = index === boundaryIndex ? BOUNDARY_LABEL_OFFSET_X : 0;

  return (
    <text
      x={x + offsetX}
      y={y + 17}
      textAnchor="middle"
      fontSize={10}
      stroke={CHART_COLORS.surface}
      strokeWidth={3}
      paintOrder="stroke"
      style={{ fill: CHART_COLORS.axisText }}
    >
      n={value}
    </text>
  );
}

/** Hover card: the value, its sample size, and which side of the change it sits on. */
function ChartTooltip({ active, payload, implementedDate }) {
  if (!active || !payload || payload.length === 0) return null;

  const point = payload[0].payload;
  const period = !implementedDate ? 'Current trend' : point.date <= implementedDate ? 'Before' : 'After';

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs shadow-lg">
      <div className="font-semibold text-[var(--ink-primary)]">{formatMonthLabel(point.date)}</div>
      <div className="mt-1 text-[var(--ink-secondary)]">
        {formatRating(point.rating)} · n={point.reviewCount} reviews
      </div>
      <div className="mt-0.5 text-[var(--ink-muted)]">{period}</div>
    </div>
  );
}

/** Always-present legend. Identity is never carried by colour alone. */
function ChartLegend({ hasImplementation }) {
  const entries = hasImplementation
    ? [
        { label: 'Before change', color: CHART_COLORS.before },
        { label: 'After change', color: CHART_COLORS.after },
      ]
    : [{ label: 'Current trend', color: CHART_COLORS.after }];

  return (
    <ul className="flex flex-wrap items-center gap-4">
      {entries.map((entry) => (
        <li key={entry.label} className="flex items-center gap-1.5">
          <span
            className="h-0.5 w-4 rounded-full"
            style={{ backgroundColor: entry.color }}
            aria-hidden="true"
          />
          <span className="text-xs text-[var(--ink-secondary)]">{entry.label}</span>
        </li>
      ))}
    </ul>
  );
}

/** The WCAG-clean twin of the chart — every plotted value, readable as text. */
function ChartTableView({ series, implementedDate }) {
  return (
    <table className="w-full text-left text-xs">
      <thead>
        <tr className="border-b border-[var(--border)] text-[var(--ink-muted)]">
          <th scope="col" className="py-2 font-medium">Month</th>
          <th scope="col" className="py-2 font-medium tabular-nums">Rating</th>
          <th scope="col" className="py-2 font-medium tabular-nums">Reviews</th>
          <th scope="col" className="py-2 font-medium">Period</th>
        </tr>
      </thead>
      <tbody>
        {series.map((point) => (
          <tr key={point.date} className="border-b border-[var(--border)] last:border-0">
            <td className="py-1.5 text-[var(--ink-secondary)]">{formatMonthLabel(point.date)}</td>
            <td className="py-1.5 tabular-nums text-[var(--ink-primary)]">
              {point.rating.toFixed(1)}
            </td>
            <td className="py-1.5 tabular-nums text-[var(--ink-secondary)]">{point.reviewCount}</td>
            <td className="py-1.5 text-[var(--ink-muted)]">
              {!implementedDate ? '—' : point.date <= implementedDate ? 'Before' : 'After'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function BeforeAfterChart({ series, boundaryDate, implementedDate }) {
  const [isTableVisible, setIsTableVisible] = useState(false);

  // Leave clearance beneath the lowest point so the `n=` labels never collide
  // with the axis, and cap the scale at 5 because a rating cannot exceed it.
  const lowestRating = Math.min(...series.map((point) => point.rating));
  const yAxisDomain = [Math.max(3, Math.floor((lowestRating - 0.4) * 10) / 10), 5];

  // The point the implementation marker is drawn on, so its label can dodge it.
  const boundaryIndex = series.findIndex((point) => point.date === boundaryDate);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <ChartLegend hasImplementation={Boolean(implementedDate)} />
        <button
          type="button"
          onClick={() => setIsTableVisible((previous) => !previous)}
          className="text-xs font-medium text-[var(--accent)] underline-offset-2 hover:underline"
        >
          {isTableVisible ? 'Hide table' : 'View as table'}
        </button>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={series} margin={{ top: 12, right: 16, bottom: 8, left: -12 }}>
          <CartesianGrid stroke={CHART_COLORS.grid} strokeWidth={1} vertical={false} />

          <XAxis
            dataKey="date"
            tickFormatter={formatMonthLabel}
            tick={{ fontSize: 11, fill: CHART_COLORS.axisText }}
            axisLine={{ stroke: CHART_COLORS.axis }}
            tickLine={false}
            tickMargin={22}
          />
          <YAxis
            domain={yAxisDomain}
            tickCount={5}
            tickFormatter={(value) => value.toFixed(1)}
            tick={{ fontSize: 11, fill: CHART_COLORS.axisText }}
            axisLine={false}
            tickLine={false}
            width={48}
          />

          <Tooltip
            content={<ChartTooltip implementedDate={implementedDate} />}
            cursor={{ stroke: CHART_COLORS.axis, strokeWidth: 1 }}
          />

          {/* The moment of change. Dashed because it is a threshold, not data. */}
          {boundaryDate && (
            <ReferenceLine
              x={boundaryDate}
              stroke={CHART_COLORS.after}
              strokeDasharray="4 4"
              strokeWidth={1}
              // Render behind the data layer so the marker never strikes
              // through a data point or its sample-size label.
              isFront={false}
              label={{
                value: 'Implemented',
                position: 'top',
                fontSize: 10,
                fill: CHART_COLORS.after,
              }}
            />
          )}

          {/* Animation is off deliberately. Recharts draws a line by animating
              its stroke-dasharray from zero, so an un-run animation renders an
              invisible chart — which is what a reader with reduced-motion
              settings, a print stylesheet, or a static screenshot would get. */}
          <Line
            type="monotone"
            dataKey="ratingBefore"
            stroke={CHART_COLORS.before}
            strokeWidth={CHART_GEOMETRY.strokeWidth}
            isAnimationActive={false}
            dot={{
              r: CHART_GEOMETRY.dotRadius,
              fill: CHART_COLORS.before,
              stroke: CHART_COLORS.marker,
              strokeWidth: CHART_GEOMETRY.markerRingWidth,
            }}
            activeDot={{ r: CHART_GEOMETRY.activeDotRadius }}
          />
          <Line
            type="monotone"
            dataKey="ratingAfter"
            stroke={CHART_COLORS.after}
            strokeWidth={CHART_GEOMETRY.strokeWidth}
            isAnimationActive={false}
            dot={{
              r: CHART_GEOMETRY.dotRadius,
              fill: CHART_COLORS.after,
              stroke: CHART_COLORS.marker,
              strokeWidth: CHART_GEOMETRY.markerRingWidth,
            }}
            activeDot={{ r: CHART_GEOMETRY.activeDotRadius }}
          />

          {/* Invisible carrier line: renders one `n=` label per point, exactly
              once, positioned against the real rating value. */}
          <Line
            dataKey="rating"
            stroke="none"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="reviewCount"
              content={(labelProps) => (
                <ReviewCountLabel {...labelProps} boundaryIndex={boundaryIndex} />
              )}
            />
          </Line>
        </LineChart>
      </ResponsiveContainer>

      {isTableVisible && (
        <div className="mt-4 border-t border-[var(--border)] pt-3">
          <ChartTableView series={series} implementedDate={implementedDate} />
        </div>
      )}
    </div>
  );
}
