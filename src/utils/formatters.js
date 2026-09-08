/**
 * Display formatters.
 *
 * Kept separate from calculation logic: these functions only turn numbers into
 * strings for the UI, never derive new values.
 */

/** "4.8★" — a rating always renders to one decimal so 4.8 and 4.80 never mix. */
export function formatRating(rating) {
  return `${rating.toFixed(1)}★`;
}

/**
 * "+0.4★" / "−0.2★" — a signed delta.
 * Uses a true minus sign (−) rather than a hyphen so figures align optically.
 */
export function formatRatingDelta(delta) {
  const rounded = Math.abs(delta).toFixed(1);
  if (Number(rounded) === 0) return '0.0★';
  return `${delta > 0 ? '+' : '−'}${rounded}★`;
}

/** "+7%" / "−3%" — a signed percentage, already expressed in whole points. */
export function formatSignedPercent(percent) {
  return `${percent > 0 ? '+' : '−'}${Math.abs(percent)}%`;
}

/** "72%" — a 0–1 ratio rendered as a whole percentage. */
export function formatRatio(ratio) {
  return `${Math.round(ratio * 100)}%`;
}

/** "$985" — whole dollars with thousands separators. */
export function formatCurrency(amount) {
  return `$${Math.round(amount).toLocaleString('en-US')}`;
}

/** "Top 25%" — turns a percentile rank into the phrase a manager actually uses. */
export function formatPercentileRank(percentile) {
  return `Top ${100 - percentile}%`;
}

/** "May" — short month label for chart axes. */
export function formatMonthLabel(isoDate) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-US', { month: 'short' });
}

/** "15 May 2026" — long form for timestamps the user typed or confirmed. */
export function formatLongDate(isoDate) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
