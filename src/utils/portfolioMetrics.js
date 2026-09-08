/**
 * Derived portfolio metrics.
 *
 * Every figure the dashboard claims is calculated here from the raw records in
 * `mockData.js`. Nothing on screen is a hardcoded headline number, so the demo
 * stays internally consistent even when the underlying mock data is edited.
 *
 * All functions are pure: same input, same output, no React, no side effects.
 */

import { CHART_CONFIDENCE_THRESHOLDS, revenueModel } from '../data/mockData';

/** Mean overall rating across the managed portfolio. */
export function calculatePortfolioAverageRating(properties) {
  const total = properties.reduce((sum, property) => sum + property.overallRating, 0);
  return total / properties.length;
}

/**
 * How far a property sits above or below its own portfolio's average.
 * This is the "internal benchmark" — a manager's first question is always
 * "is this one dragging the rest down?".
 */
export function calculateInternalDelta(property, properties) {
  return property.overallRating - calculatePortfolioAverageRating(properties);
}

/** All monthly snapshots for one category, oldest first. */
export function getCategoryHistory(property, category) {
  return property.ratingHistory
    .filter((entry) => entry.category === category)
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Would a trend line drawn from this history be honest?
 *
 * Too few months or too few underlying reviews and the answer is no — the UI
 * shows a "Gathering data" state instead of a chart that implies certainty the
 * sample cannot support.
 */
export function hasEnoughDataToPlot(history) {
  const totalReviews = history.reduce((sum, entry) => sum + entry.reviewCount, 0);
  return (
    history.length >= CHART_CONFIDENCE_THRESHOLDS.minimumDataPoints &&
    totalReviews >= CHART_CONFIDENCE_THRESHOLDS.minimumTotalReviews
  );
}

/**
 * Split a category history at the date the fix went live.
 *
 * ISO date strings compare correctly as plain strings, so no Date parsing is
 * needed. A snapshot dated *after* the implementation counts as "after".
 */
export function splitHistoryAtImplementation(history, implementedDate) {
  return {
    before: history.filter((entry) => entry.date <= implementedDate),
    after: history.filter((entry) => entry.date > implementedDate),
  };
}

/** Mean of a `rating` collection, or null when there is nothing to average. */
function averageRating(entries) {
  if (entries.length === 0) return null;
  const total = entries.reduce((sum, entry) => sum + entry.rating, 0);
  return total / entries.length;
}

/** Total reviews backing a set of snapshots — the `n=` behind a claim. */
function totalReviews(entries) {
  return entries.reduce((sum, entry) => sum + entry.reviewCount, 0);
}

/**
 * The core ROI calculation: what did the rating do before the change, and what
 * has it done since? Returns null when either side of the split is empty, so a
 * caller can never accidentally render a one-sided "lift".
 */
export function calculateRatingLift(history, implementedDate) {
  const { before, after } = splitHistoryAtImplementation(history, implementedDate);
  const beforeAverage = averageRating(before);
  const afterAverage = averageRating(after);

  if (beforeAverage === null || afterAverage === null) return null;

  return {
    beforeAverage,
    afterAverage,
    delta: afterAverage - beforeAverage,
    beforeReviews: totalReviews(before),
    afterReviews: totalReviews(after),
    // A lift is only "sustained" once enough reviews have landed since the fix.
    // Below the threshold the number is directional, and the UI must say so.
    isSustained: totalReviews(after) >= revenueModel.sustainedReviewThreshold,
  };
}

/**
 * Reshape a category history into rows Recharts can draw as two coloured
 * segments meeting at the implementation boundary.
 *
 * The final "before" point deliberately carries *both* keys so the two lines
 * join without a visual gap. Without this the chart would show a break that
 * looks like missing data rather than a change of state.
 */
export function buildBeforeAfterSeries(history, implementedDate) {
  const lastBeforeIndex = implementedDate
    ? history.reduce(
        (lastIndex, entry, index) => (entry.date <= implementedDate ? index : lastIndex),
        -1,
      )
    : -1;

  return history.map((entry, index) => {
    const isBefore = lastBeforeIndex >= 0 && index <= lastBeforeIndex;
    const isJoiningPoint = index === lastBeforeIndex;

    return {
      date: entry.date,
      reviewCount: entry.reviewCount,
      rating: entry.rating,
      // When there is no implementation date at all, everything renders as a
      // single "current trend" line via the `after` key.
      ratingBefore: lastBeforeIndex >= 0 && isBefore ? entry.rating : null,
      ratingAfter: lastBeforeIndex < 0 || !isBefore || isJoiningPoint ? entry.rating : null,
    };
  });
}

/** The x-axis tick the implementation marker sits on: the last "before" point. */
export function findImplementationBoundaryDate(history, implementedDate) {
  const beforeEntries = history.filter((entry) => entry.date <= implementedDate);
  if (beforeEntries.length === 0) return null;
  return beforeEntries[beforeEntries.length - 1].date;
}

/**
 * Portfolio-level realised impact — the hero metric.
 *
 * Deliberately conservative, because the headline number is the product's
 * credibility:
 *   • only Implemented actions count;
 *   • the category must have a real before *and* after sample;
 *   • revenue is credited once per property, never once per action, so a
 *     property with three fixes is not counted three times.
 */
export function calculatePortfolioImpact(properties, actionItems) {
  const propertiesById = new Map(properties.map((property) => [property.id, property]));
  const ratingLifts = [];
  const propertyIdsWithSustainedLift = new Set();

  actionItems
    .filter((item) => item.status === 'Implemented' && item.implementedDate)
    .forEach((item) => {
      const property = propertiesById.get(item.propertyId);
      if (!property) return;

      const history = getCategoryHistory(property, item.category);
      const lift = calculateRatingLift(history, item.implementedDate);
      if (!lift) return;

      ratingLifts.push(lift.delta);
      if (lift.isSustained) propertyIdsWithSustainedLift.add(property.id);
    });

  // Revenue model: a sustained lift is assumed to buy +3 pts of occupancy,
  // which is then priced at that property's own nightly rate.
  const estimatedMonthlyRevenue = [...propertyIdsWithSustainedLift].reduce((sum, propertyId) => {
    const property = propertiesById.get(propertyId);
    const addedRoomNights = revenueModel.occupancyUpliftPoints * revenueModel.nightsPerMonth;
    return sum + addedRoomNights * property.adr;
  }, 0);

  const averageRatingLift =
    ratingLifts.length > 0
      ? ratingLifts.reduce((sum, delta) => sum + delta, 0) / ratingLifts.length
      : 0;

  return {
    averageRatingLift,
    // Rounded to the nearest $10 — false precision on a modelled figure would
    // imply an accuracy the assumptions do not have.
    estimatedMonthlyRevenue: Math.round(estimatedMonthlyRevenue / 10) * 10,
    implementedActionCount: ratingLifts.length,
    propertiesImprovedCount: propertyIdsWithSustainedLift.size,
  };
}
