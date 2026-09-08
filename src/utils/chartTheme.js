/**
 * Chart colours and geometry.
 *
 * These hex values intentionally mirror the CSS custom properties in
 * `index.css`. Charts are the one place literal hex is preferable: SVG
 * presentation attributes resolve more predictably than `var()` across
 * rendering targets, and a mis-resolved variable here means an invisible line
 * rather than a slightly-off background.
 *
 * Roles, not names: "before" is deliberately a recessive neutral and "after"
 * carries the product's single accent, so the eye lands on the outcome.
 */
export const CHART_COLORS = {
  before: '#898781',
  after: '#2a78d6',
  grid: '#e1e0d9',
  axis: '#c3c2b7',
  axisText: '#898781',
  marker: '#fcfcfb',
  surface: '#fcfcfb',
  border: 'rgba(11, 11, 11, 0.1)',
  inkPrimary: '#0b0b0b',
  inkSecondary: '#52514e',
};

/** Thin marks, generous hit targets — see the data-viz mark specs. */
export const CHART_GEOMETRY = {
  strokeWidth: 2,
  dotRadius: 4,
  activeDotRadius: 6,
  markerRingWidth: 2,
};
