/**
 * ReviewLoop — mock dataset.
 *
 * This module is the single source of truth for the demo. It is deliberately
 * isolated from every component so the UI can later be pointed at a real API
 * without touching a single view file.
 *
 * Shape of the story the data tells:
 *   Act     — guest reviews produce specific operational tasks (actionItems)
 *   Prove   — implementing a task moves a category rating (ratingHistory)
 *   Compare — the local market shows where the remaining gap is (benchmarks)
 *
 * Note on derived values: anything computable from data already here
 * (portfolio averages, before/after deltas, internal benchmark deltas) is NOT
 * stored. It is calculated in `src/utils/portfolioMetrics.js` so the numbers on
 * screen can never drift out of sync with the underlying records.
 */

/** The five review categories a guest scores. Used for tagging and filtering. */
export const REVIEW_CATEGORIES = [
  'Cleanliness',
  'Communication',
  'Comfort',
  'Location',
  'Amenities',
];

/** Lifecycle of an AI-generated recommendation. */
export const ACTION_STATUSES = ['New', 'In Progress', 'Implemented'];

/**
 * Assumptions behind the portfolio revenue estimate.
 *
 * Kept as data (not buried in a component) because the hero metric must always
 * be able to show the reader exactly how its dollar figure was produced.
 */
export const revenueModel = {
  // A sustained rating lift is assumed to convert into +3 percentage points of
  // occupancy. Applied only to properties that actually hold a post-change lift.
  occupancyUpliftPoints: 0.03,
  // Average nights in a month, used to turn an occupancy delta into room-nights.
  nightsPerMonth: 30.4,
  // Minimum post-implementation reviews before a lift counts as "sustained".
  sustainedReviewThreshold: 5,
  caption:
    'Model: +3 pts occupancy uplift × ADR × 30.4 room-nights/mo, applied only to properties holding a sustained post-change lift. Directional estimate — not booked revenue.',
};

/**
 * Plot honestly or not at all: a category needs at least this many monthly data
 * points AND this many total reviews before the tracker will draw a trend line.
 */
export const CHART_CONFIDENCE_THRESHOLDS = {
  minimumDataPoints: 4,
  minimumTotalReviews: 12,
};

/**
 * The managed portfolio.
 *
 * `ratingHistory` holds monthly category snapshots. Each entry carries its own
 * `reviewCount` so the UI can always show the sample size (`n=`) behind a point
 * — a 4.8 built on 2 reviews is not the same claim as a 4.8 built on 20.
 */
export const properties = [
  {
    id: 'apt-3-old-city',
    name: 'Apt 3 — Old City',
    district: 'Old City',
    bedrooms: 2,
    adr: 185,
    occupancyRate: 0.72,
    overallRating: 4.5,
    // Position in the portfolio map's 760×420 illustrative coordinate space,
    // and which side of the pin its label should be anchored to so labels
    // don't collide. See src/components/map/PortfolioMap.jsx.
    mapPosition: { x: 430, y: 195 },
    mapLabelAnchor: 'bottom',
    ratingHistory: [
      { date: '2026-01-31', category: 'Cleanliness', rating: 4.1, reviewCount: 6 },
      { date: '2026-02-28', category: 'Cleanliness', rating: 4.0, reviewCount: 5 },
      { date: '2026-03-31', category: 'Cleanliness', rating: 4.2, reviewCount: 7 },
      { date: '2026-04-30', category: 'Cleanliness', rating: 4.0, reviewCount: 6 },
      { date: '2026-05-31', category: 'Cleanliness', rating: 4.4, reviewCount: 4 },
      { date: '2026-06-30', category: 'Cleanliness', rating: 4.6, reviewCount: 7 },
      { date: '2026-07-31', category: 'Cleanliness', rating: 4.8, reviewCount: 8 },
      { date: '2026-08-31', category: 'Cleanliness', rating: 4.8, reviewCount: 6 },
      { date: '2026-05-31', category: 'Communication', rating: 4.3, reviewCount: 4 },
      { date: '2026-06-30', category: 'Communication', rating: 4.4, reviewCount: 7 },
      { date: '2026-07-31', category: 'Communication', rating: 4.4, reviewCount: 8 },
      { date: '2026-08-31', category: 'Communication', rating: 4.4, reviewCount: 6 },
    ],
  },
  {
    id: 'loft-12-harbor-view',
    name: 'Loft 12 — Harbor View',
    district: 'Harbor District',
    bedrooms: 1,
    adr: 210,
    occupancyRate: 0.81,
    overallRating: 4.8,
    mapPosition: { x: 610, y: 300 },
    mapLabelAnchor: 'right',
    ratingHistory: [
      { date: '2026-01-31', category: 'Communication', rating: 4.5, reviewCount: 5 },
      { date: '2026-02-28', category: 'Communication', rating: 4.6, reviewCount: 6 },
      { date: '2026-03-31', category: 'Communication', rating: 4.5, reviewCount: 4 },
      { date: '2026-04-30', category: 'Communication', rating: 4.6, reviewCount: 7 },
      { date: '2026-05-31', category: 'Communication', rating: 4.5, reviewCount: 5 },
      { date: '2026-06-30', category: 'Communication', rating: 4.7, reviewCount: 6 },
      { date: '2026-07-31', category: 'Communication', rating: 4.9, reviewCount: 7 },
      { date: '2026-08-31', category: 'Communication', rating: 4.9, reviewCount: 5 },
      { date: '2026-01-31', category: 'Cleanliness', rating: 4.4, reviewCount: 5 },
      { date: '2026-02-28', category: 'Cleanliness', rating: 4.5, reviewCount: 6 },
      { date: '2026-03-31', category: 'Cleanliness', rating: 4.6, reviewCount: 4 },
      { date: '2026-04-30', category: 'Cleanliness', rating: 4.8, reviewCount: 7 },
      { date: '2026-05-31', category: 'Cleanliness', rating: 4.8, reviewCount: 5 },
      { date: '2026-06-30', category: 'Cleanliness', rating: 4.9, reviewCount: 6 },
      { date: '2026-07-31', category: 'Cleanliness', rating: 4.8, reviewCount: 7 },
      { date: '2026-08-31', category: 'Cleanliness', rating: 4.9, reviewCount: 5 },
    ],
  },
  {
    id: 'garden-house-north',
    name: 'Garden House — North Quarter',
    district: 'North Quarter',
    bedrooms: 3,
    adr: 265,
    occupancyRate: 0.64,
    overallRating: 4.6,
    mapPosition: { x: 330, y: 70 },
    mapLabelAnchor: 'bottom',
    ratingHistory: [
      { date: '2026-01-31', category: 'Communication', rating: 4.2, reviewCount: 4 },
      { date: '2026-02-28', category: 'Communication', rating: 4.1, reviewCount: 5 },
      { date: '2026-03-31', category: 'Communication', rating: 4.3, reviewCount: 6 },
      { date: '2026-04-30', category: 'Communication', rating: 4.4, reviewCount: 5 },
      { date: '2026-05-31', category: 'Communication', rating: 4.6, reviewCount: 6 },
      { date: '2026-06-30', category: 'Communication', rating: 4.7, reviewCount: 8 },
      { date: '2026-07-31', category: 'Communication', rating: 4.8, reviewCount: 7 },
      { date: '2026-08-31', category: 'Communication', rating: 4.7, reviewCount: 6 },
      { date: '2026-04-30', category: 'Amenities', rating: 4.4, reviewCount: 5 },
      { date: '2026-05-31', category: 'Amenities', rating: 4.5, reviewCount: 6 },
      { date: '2026-06-30', category: 'Amenities', rating: 4.4, reviewCount: 8 },
      { date: '2026-07-31', category: 'Amenities', rating: 4.5, reviewCount: 7 },
      { date: '2026-08-31', category: 'Amenities', rating: 4.5, reviewCount: 6 },
    ],
  },
  {
    id: 'studio-5-market-lane',
    name: 'Studio 5 — Market Lane',
    district: 'Market Lane',
    bedrooms: 1,
    adr: 130,
    occupancyRate: 0.88,
    overallRating: 4.3,
    mapPosition: { x: 155, y: 200 },
    mapLabelAnchor: 'left',
    ratingHistory: [
      // Deliberately sparse: this property is the "Gathering data" case. Three
      // points and seven reviews is not enough to draw an honest trend.
      { date: '2026-06-30', category: 'Comfort', rating: 4.0, reviewCount: 2 },
      { date: '2026-07-31', category: 'Comfort', rating: 4.1, reviewCount: 3 },
      { date: '2026-08-31', category: 'Comfort', rating: 4.0, reviewCount: 2 },
      { date: '2026-01-31', category: 'Communication', rating: 4.2, reviewCount: 6 },
      { date: '2026-02-28', category: 'Communication', rating: 4.1, reviewCount: 7 },
      { date: '2026-03-31', category: 'Communication', rating: 4.2, reviewCount: 5 },
      { date: '2026-04-30', category: 'Communication', rating: 4.3, reviewCount: 8 },
      { date: '2026-05-31', category: 'Communication', rating: 4.2, reviewCount: 6 },
      { date: '2026-06-30', category: 'Communication', rating: 4.3, reviewCount: 7 },
      { date: '2026-07-31', category: 'Communication', rating: 4.5, reviewCount: 6 },
      { date: '2026-08-31', category: 'Communication', rating: 4.6, reviewCount: 5 },
    ],
  },
  {
    id: 'townhouse-7-riverside',
    name: 'Townhouse 7 — Riverside',
    district: 'Riverside',
    bedrooms: 3,
    adr: 290,
    occupancyRate: 0.69,
    overallRating: 4.7,
    mapPosition: { x: 250, y: 335 },
    mapLabelAnchor: 'bottom',
    ratingHistory: [
      // Amenities is flat — the matching action is still In Progress, so there
      // is no implementation date and therefore no before/after split to claim.
      { date: '2026-01-31', category: 'Amenities', rating: 4.4, reviewCount: 5 },
      { date: '2026-02-28', category: 'Amenities', rating: 4.3, reviewCount: 6 },
      { date: '2026-03-31', category: 'Amenities', rating: 4.4, reviewCount: 5 },
      { date: '2026-04-30', category: 'Amenities', rating: 4.2, reviewCount: 7 },
      { date: '2026-05-31', category: 'Amenities', rating: 4.3, reviewCount: 6 },
      { date: '2026-06-30', category: 'Amenities', rating: 4.3, reviewCount: 5 },
      { date: '2026-07-31', category: 'Amenities', rating: 4.2, reviewCount: 6 },
      { date: '2026-08-31', category: 'Amenities', rating: 4.3, reviewCount: 7 },
      { date: '2026-01-31', category: 'Cleanliness', rating: 4.3, reviewCount: 5 },
      { date: '2026-02-28', category: 'Cleanliness', rating: 4.4, reviewCount: 6 },
      { date: '2026-03-31', category: 'Cleanliness', rating: 4.6, reviewCount: 5 },
      { date: '2026-04-30', category: 'Cleanliness', rating: 4.7, reviewCount: 7 },
      { date: '2026-05-31', category: 'Cleanliness', rating: 4.7, reviewCount: 6 },
      { date: '2026-06-30', category: 'Cleanliness', rating: 4.8, reviewCount: 5 },
      { date: '2026-07-31', category: 'Cleanliness', rating: 4.7, reviewCount: 6 },
      { date: '2026-08-31', category: 'Cleanliness', rating: 4.8, reviewCount: 7 },
    ],
  },
];

/**
 * AI-generated action items.
 *
 * The product bet lives here: every title is a task an operations manager can
 * hand to a cleaner or a handyman today. "Guests mentioned the bathroom" is a
 * summary; "re-caulk the master shower" is a work order.
 */
export const actionItems = [
  {
    id: 'ai-001',
    propertyId: 'apt-3-old-city',
    propertyName: 'Apt 3 — Old City',
    title: 'Re-caulk the master shower and swap the low-flow head for a 2.5 GPM rain fixture',
    category: 'Cleanliness',
    status: 'Implemented',
    sourceReviewQuote:
      'Shower pressure was a trickle and the sealant around the base was going black.',
    estimatedImpact: '+0.5★',
    implementedDate: '2026-05-15',
  },
  {
    id: 'ai-002',
    propertyId: 'garden-house-north',
    propertyName: 'Garden House — North Quarter',
    title: 'Install a smart lock and send door codes 24h before arrival, not on the morning of',
    category: 'Communication',
    status: 'Implemented',
    sourceReviewQuote: 'We landed at 11pm and were still waiting on the entry code by text.',
    estimatedImpact: '+0.4★',
    implementedDate: '2026-04-20',
  },
  {
    id: 'ai-003',
    propertyId: 'loft-12-harbor-view',
    propertyName: 'Loft 12 — Harbor View',
    title: 'Add a printed parking card to the entry table with the garage clearance height (1.9m)',
    category: 'Communication',
    status: 'Implemented',
    sourceReviewQuote: "Our van didn't fit the garage and nobody warned us in advance.",
    estimatedImpact: '+0.3★',
    implementedDate: '2026-06-10',
  },
  {
    id: 'ai-004',
    propertyId: 'townhouse-7-riverside',
    propertyName: 'Townhouse 7 — Riverside',
    title:
      'Move to a 3-hour turnover slot so linens are changed after, not during, the check-in window',
    category: 'Cleanliness',
    status: 'Implemented',
    sourceReviewQuote: 'We arrived at 4pm to beds still being made.',
    estimatedImpact: '+0.3★',
    implementedDate: '2026-02-12',
  },
  {
    id: 'ai-005',
    propertyId: 'studio-5-market-lane',
    propertyName: 'Studio 5 — Market Lane',
    title: 'Auto-send a 48h check-in note with the street door colour and the buzzer number',
    category: 'Communication',
    status: 'Implemented',
    sourceReviewQuote:
      "Spent 20 minutes finding the entrance — the number isn't visible from the street.",
    estimatedImpact: '+0.2★',
    implementedDate: '2026-07-01',
  },
  {
    id: 'ai-006',
    propertyId: 'loft-12-harbor-view',
    propertyName: 'Loft 12 — Harbor View',
    title: 'Switch turnovers to a checklist that photographs the balcony drain and window tracks',
    category: 'Cleanliness',
    status: 'Implemented',
    sourceReviewQuote: 'Balcony had cigarette ends left from the previous guests.',
    estimatedImpact: '+0.2★',
    implementedDate: '2026-03-05',
  },
  {
    id: 'ai-007',
    propertyId: 'townhouse-7-riverside',
    propertyName: 'Townhouse 7 — Riverside',
    title: 'Add a second 65" TV and a streaming stick to the lower-floor lounge',
    category: 'Amenities',
    status: 'In Progress',
    sourceReviewQuote:
      'Three bedrooms but one small TV — the kids and the adults were competing for it.',
    estimatedImpact: '+0.2★',
    implementedDate: null,
  },
  {
    id: 'ai-008',
    propertyId: 'garden-house-north',
    propertyName: 'Garden House — North Quarter',
    title: 'Stock a 6-person cookware and place setting kit — current pans only serve 4',
    category: 'Amenities',
    status: 'In Progress',
    sourceReviewQuote: 'Six of us, four plates, two pans.',
    estimatedImpact: '+0.2★',
    implementedDate: null,
  },
  {
    id: 'ai-009',
    propertyId: 'studio-5-market-lane',
    propertyName: 'Studio 5 — Market Lane',
    title:
      'Replace the sofa-bed mattress with a 15cm memory-foam unit and fit blackout blinds street-side',
    category: 'Comfort',
    status: 'New',
    sourceReviewQuote:
      'Sofa bed had a bar through the middle and the streetlight came straight in.',
    estimatedImpact: '+0.3★',
    implementedDate: null,
  },
  {
    id: 'ai-010',
    propertyId: 'apt-3-old-city',
    propertyName: 'Apt 3 — Old City',
    title: "Pre-write a 'first night' message with the boiler timer setting and recycling day",
    category: 'Communication',
    status: 'New',
    sourceReviewQuote:
      "Hot water ran out on the first evening and we couldn't work out the timer.",
    estimatedImpact: '+0.2★',
    implementedDate: null,
  },
  {
    id: 'ai-011',
    propertyId: 'studio-5-market-lane',
    propertyName: 'Studio 5 — Market Lane',
    title: 'Add a 20-minute extractor-filter degrease to every 4th turnover',
    category: 'Cleanliness',
    status: 'New',
    sourceReviewQuote: 'The extractor above the hob was thick with old grease.',
    estimatedImpact: '+0.2★',
    implementedDate: null,
  },
  {
    id: 'ai-012',
    propertyId: 'townhouse-7-riverside',
    propertyName: 'Townhouse 7 — Riverside',
    title: 'Add a one-page walking map with the 3 nearest bus stops and the late-night pharmacy',
    category: 'Location',
    status: 'New',
    sourceReviewQuote: 'Lovely house but we had no idea what was walkable from the door.',
    estimatedImpact: '+0.1★',
    implementedDate: null,
  },
];

/**
 * Local-market benchmarking, keyed by property id.
 *
 * Every competitor is anonymised by type and distance only — never a name. That
 * is both a legal posture and a product one: the value is the pattern, not the
 * neighbour's identity.
 *
 * `internalDelta` is intentionally absent — it is derived from the portfolio
 * average at render time (see portfolioMetrics.calculateInternalDelta).
 */
export const benchmarks = {
  'apt-3-old-city': {
    externalPercentile: 68,
    weakestCategory: 'Communication',
    yourCategoryScore: 4.4,
    competitorCategoryScore: 4.9,
    competitorDescriptor: '2-bedroom apartments ~0.4 km away',
    positiveKeywords: [
      { keyword: 'smart lock', frequency: 34 },
      { keyword: 'self check-in', frequency: 28 },
      { keyword: 'clear directions', frequency: 19 },
      { keyword: 'late arrival', frequency: 12 },
    ],
    suggestedBestPractice:
      'Top performers nearby never require a person-to-person handover. Pair a smart lock with a scheduled 24h pre-arrival message so a delayed flight stops being a support ticket.',
  },
  'loft-12-harbor-view': {
    externalPercentile: 92,
    weakestCategory: 'Amenities',
    yourCategoryScore: 4.6,
    competitorCategoryScore: 4.9,
    competitorDescriptor: '1-bedroom apartments ~0.6 km away',
    positiveKeywords: [
      { keyword: 'workspace', frequency: 41 },
      { keyword: 'fast wifi', frequency: 33 },
      { keyword: 'coffee machine', frequency: 22 },
      { keyword: 'blackout blinds', frequency: 15 },
    ],
    suggestedBestPractice:
      'The top decile of 1-bedrooms here sell to remote workers: a dedicated desk, a real chair, and a measured wifi speed published in the listing rather than the word "fast".',
  },
  'garden-house-north': {
    externalPercentile: 74,
    weakestCategory: 'Amenities',
    yourCategoryScore: 4.5,
    competitorCategoryScore: 4.8,
    competitorDescriptor: '3-bedroom houses ~0.9 km away',
    positiveKeywords: [
      { keyword: 'well equipped kitchen', frequency: 37 },
      { keyword: 'dishwasher', frequency: 24 },
      { keyword: 'high chair', frequency: 18 },
      { keyword: 'board games', frequency: 11 },
    ],
    suggestedBestPractice:
      'Group bookings judge a 3-bedroom on its kitchen. Stock cookware and place settings to the maximum sleeps count, not the bedroom count.',
  },
  'studio-5-market-lane': {
    externalPercentile: 41,
    weakestCategory: 'Comfort',
    yourCategoryScore: 4.0,
    competitorCategoryScore: 4.7,
    competitorDescriptor: 'studio apartments ~0.3 km away',
    positiveKeywords: [
      { keyword: 'quiet', frequency: 46 },
      { keyword: 'blackout curtains', frequency: 31 },
      { keyword: 'comfortable bed', frequency: 27 },
      { keyword: 'air conditioning', frequency: 16 },
    ],
    suggestedBestPractice:
      'On this street the differentiator is sleep quality, not square metres. Blackout blinds and a proper mattress move Comfort faster than any decor spend.',
  },
  'townhouse-7-riverside': {
    externalPercentile: 83,
    weakestCategory: 'Amenities',
    yourCategoryScore: 4.3,
    competitorCategoryScore: 4.8,
    competitorDescriptor: '3-bedroom townhouses ~1.2 km away',
    positiveKeywords: [
      { keyword: 'smart tv', frequency: 29 },
      { keyword: 'streaming', frequency: 21 },
      { keyword: 'games console', frequency: 14 },
      { keyword: 'second lounge', frequency: 9 },
    ],
    suggestedBestPractice:
      'Larger groups split across floors. Top performers put a screen on each living floor so one house works as two lounges.',
  },
};

/**
 * Directional pricing prompts, keyed by property id (null where not earned).
 *
 * A prompt only exists once a rating has *held* at a higher level across enough
 * post-implementation reviews. This is the retention loop: the product proves a
 * rating gain, then tells the manager what that gain is worth in nightly rate.
 */
export const pricingRecommendations = {
  'apt-3-old-city': {
    triggeredByActionId: 'ai-001',
    newStableRating: 4.8,
    reviewsSinceImplemented: 8,
    suggestedRateChangePct: 7,
    rationale:
      'Cleanliness has held at 4.8 across the last 8 reviews since the shower refit. Comparable 2-bedroom units nearby in this rating band list 6–9% above your current rate.',
  },
  'garden-house-north': {
    triggeredByActionId: 'ai-002',
    newStableRating: 4.7,
    reviewsSinceImplemented: 6,
    suggestedRateChangePct: 5,
    rationale:
      'Communication has held at 4.7 across 6 reviews since self check-in went live. Local 3-bedroom houses at this score sit roughly 5% above your current rate.',
  },
  // Below the sustained-evidence threshold — the product stays quiet rather than
  // guessing. This absence is a feature, not missing data.
  'loft-12-harbor-view': null,
  'studio-5-market-lane': null,
  'townhouse-7-riverside': null,
};
