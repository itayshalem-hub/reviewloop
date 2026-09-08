import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import ActionItemFilters from './ActionItemFilters';
import ActionItemRow from './ActionItemRow';

/**
 * Act — the cross-property work queue.
 *
 * The product claim this panel exists to prove: a review tool is only useful if
 * its output is a task someone can be assigned. Every row here is specific
 * enough to hand to a cleaner or a handyman without a follow-up conversation.
 */
export default function ActionItemsPanel({
  properties,
  visibleActionItems,
  totalActionCount,
  filters,
  onFilterChange,
  selectedActionId,
  onSelectAction,
}) {
  return (
    <Card>
      <SectionHeader
        act="Act"
        title="Cross-property action items"
        description="Specific operational tasks generated from guest review text — not category summaries. Select one to trace its impact below."
      />

      <ActionItemFilters
        properties={properties}
        filters={filters}
        onFilterChange={onFilterChange}
        matchCount={visibleActionItems.length}
        totalCount={totalActionCount}
      />

      {visibleActionItems.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-[var(--ink-muted)]">
          No action items match these filters.
        </p>
      ) : (
        // Capped height keeps the three-act story visible on one screen; the
        // queue itself scrolls independently.
        <div className="max-h-[30rem] overflow-y-auto">
          {visibleActionItems.map((actionItem) => (
            <ActionItemRow
              key={actionItem.id}
              actionItem={actionItem}
              isSelected={actionItem.id === selectedActionId}
              onSelect={onSelectAction}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
