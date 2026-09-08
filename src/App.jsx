import { useState } from 'react';
import DashboardHeader from './components/DashboardHeader';
import PortfolioHeroMetric from './components/PortfolioHeroMetric';
import ActionItemsPanel from './components/actionItems/ActionItemsPanel';
import BenchmarkingPanel from './components/benchmarking/BenchmarkingPanel';
import EffectivenessTracker from './components/tracker/EffectivenessTracker';
import { actionItems, benchmarks, pricingRecommendations, properties } from './data/mockData';
import {
  ALL_FILTER_VALUE,
  applyImplementationOverrides,
  filterActionItems,
} from './utils/actionItemQueries';
import {
  calculateInternalDelta,
  calculatePortfolioAverageRating,
  calculatePortfolioImpact,
} from './utils/portfolioMetrics';

/**
 * ReviewLoop dashboard.
 *
 * All state lives here and flows down; every panel below is presentational.
 * With a dataset this size there is no need for reducers, context or memoisation
 * — derived values are recomputed on each render from the same pure helpers,
 * which keeps the data flow readable end to end.
 *
 * The dashboard is one continuous argument in three acts:
 *   Act     — a specific task, traced to a guest's words
 *   Prove   — did that task move the rating, and is the sample big enough to say so
 *   Compare — where the local market is still ahead, and what it does differently
 *
 * Selecting an action item in Act re-scopes both Prove and Compare, so the three
 * panels always describe the same decision rather than three unrelated views.
 */

/** The action the demo opens on — the clearest end-to-end ROI story in the data. */
const DEFAULT_SELECTED_ACTION_ID = 'ai-001';

export default function App() {
  const [filters, setFilters] = useState({
    propertyId: ALL_FILTER_VALUE,
    category: ALL_FILTER_VALUE,
    status: ALL_FILTER_VALUE,
  });
  const [selectedActionId, setSelectedActionId] = useState(DEFAULT_SELECTED_ACTION_ID);

  // In-session edits, keyed by action id: { [actionId]: 'YYYY-MM-DD' }.
  const [implementationOverrides, setImplementationOverrides] = useState({});

  // Pricing prompts a manager has waved away, keyed by property id.
  const [dismissedPricingPropertyIds, setDismissedPricingPropertyIds] = useState([]);

  // --- Derived data -------------------------------------------------------
  // Source records first, then the user's edits, then the active filters.
  const resolvedActionItems = applyImplementationOverrides(actionItems, implementationOverrides);
  const visibleActionItems = filterActionItems(resolvedActionItems, filters);

  const selectedAction =
    resolvedActionItems.find((actionItem) => actionItem.id === selectedActionId) ?? null;
  const selectedProperty = selectedAction
    ? (properties.find((property) => property.id === selectedAction.propertyId) ?? null)
    : null;

  const portfolioImpact = calculatePortfolioImpact(properties, resolvedActionItems);
  const portfolioAverageRating = calculatePortfolioAverageRating(properties);

  const selectedBenchmark = selectedProperty ? benchmarks[selectedProperty.id] : null;
  const selectedPricingRecommendation = selectedProperty
    ? pricingRecommendations[selectedProperty.id]
    : null;

  // --- Handlers -----------------------------------------------------------

  /** Narrow one filter dimension while leaving the others untouched. */
  function handleFilterChange(dimension, value) {
    setFilters((previousFilters) => ({ ...previousFilters, [dimension]: value }));
  }

  /** Record the date a fix went live — the pivot the ROI chart splits on. */
  function handleMarkImplemented(actionId, implementedDate) {
    setImplementationOverrides((previousOverrides) => ({
      ...previousOverrides,
      [actionId]: implementedDate,
    }));
  }

  /** Hide a pricing prompt for one property for the rest of the session. */
  function handleDismissPricing(propertyId) {
    setDismissedPricingPropertyIds((previousIds) =>
      previousIds.includes(propertyId) ? previousIds : [...previousIds, propertyId],
    );
  }

  return (
    <div className="min-h-full bg-[var(--page)]">
      <DashboardHeader propertyCount={properties.length} />

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <PortfolioHeroMetric impact={portfolioImpact} propertyCount={properties.length} />

        <ActionItemsPanel
          properties={properties}
          visibleActionItems={visibleActionItems}
          totalActionCount={resolvedActionItems.length}
          filters={filters}
          onFilterChange={handleFilterChange}
          selectedActionId={selectedActionId}
          onSelectAction={setSelectedActionId}
        />

        <EffectivenessTracker
          selectedAction={selectedAction}
          property={selectedProperty}
          pricingRecommendation={selectedPricingRecommendation}
          isPricingDismissed={
            selectedProperty ? dismissedPricingPropertyIds.includes(selectedProperty.id) : false
          }
          onMarkImplemented={handleMarkImplemented}
          onDismissPricing={handleDismissPricing}
        />

        <BenchmarkingPanel
          property={selectedProperty}
          benchmark={selectedBenchmark}
          internalDelta={
            selectedProperty ? calculateInternalDelta(selectedProperty, properties) : 0
          }
          portfolioAverage={portfolioAverageRating}
        />

        <footer className="pt-2 pb-6 text-center text-xs text-[var(--ink-muted)]">
          Frontend mockup · all data is fictional · competitor properties are anonymised by type
          and distance only
        </footer>
      </main>
    </div>
  );
}
