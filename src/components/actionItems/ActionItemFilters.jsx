import FilterSelect from '../ui/FilterSelect';
import { ACTION_STATUSES, REVIEW_CATEGORIES } from '../../data/mockData';
import { ALL_FILTER_VALUE } from '../../utils/actionItemQueries';

/**
 * One filter row, sitting above the list it scopes.
 *
 * A PMC's daily question is rarely "show me everything" — it is "what is
 * outstanding for Studio 5?" or "what Cleanliness work is still open across the
 * portfolio?". These three dimensions answer both.
 */
export default function ActionItemFilters({
  properties,
  filters,
  onFilterChange,
  matchCount,
  totalCount,
}) {
  const propertyOptions = [
    { value: ALL_FILTER_VALUE, label: 'All properties' },
    ...properties.map((property) => ({ value: property.id, label: property.name })),
  ];

  const categoryOptions = [
    { value: ALL_FILTER_VALUE, label: 'All categories' },
    ...REVIEW_CATEGORIES.map((category) => ({ value: category, label: category })),
  ];

  const statusOptions = [
    { value: ALL_FILTER_VALUE, label: 'All statuses' },
    ...ACTION_STATUSES.map((status) => ({ value: status, label: status })),
  ];

  return (
    <div className="flex flex-wrap items-end gap-3 border-b border-[var(--border)] bg-[var(--surface-subtle)] px-6 py-4">
      <FilterSelect
        label="Property"
        value={filters.propertyId}
        options={propertyOptions}
        onChange={(value) => onFilterChange('propertyId', value)}
      />
      <FilterSelect
        label="Category"
        value={filters.category}
        options={categoryOptions}
        onChange={(value) => onFilterChange('category', value)}
      />
      <FilterSelect
        label="Status"
        value={filters.status}
        options={statusOptions}
        onChange={(value) => onFilterChange('status', value)}
      />

      <p className="ml-auto pb-1.5 text-xs text-[var(--ink-muted)]">
        Showing {matchCount} of {totalCount} actions
      </p>
    </div>
  );
}
