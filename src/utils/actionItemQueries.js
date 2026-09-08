/**
 * Queries and view-state merging for action items.
 *
 * These are pure list transforms, kept out of the components so the panel stays
 * a rendering concern and the filtering rules can be reasoned about (or tested)
 * on their own.
 */

/** Sentinel meaning "do not narrow on this dimension". */
export const ALL_FILTER_VALUE = 'all';

/**
 * Fold the user's in-session edits over the source data.
 *
 * Marking an item implemented sets both the date and the status together — they
 * are one fact, and letting them drift apart is how a queue ends up showing
 * "New" next to an implementation date.
 */
export function applyImplementationOverrides(actionItems, implementationOverrides) {
  return actionItems.map((actionItem) => {
    const overriddenDate = implementationOverrides[actionItem.id];
    if (!overriddenDate) return actionItem;

    return { ...actionItem, status: 'Implemented', implementedDate: overriddenDate };
  });
}

/** Narrow the queue by property, category and status independently. */
export function filterActionItems(actionItems, filters) {
  return actionItems.filter((actionItem) => {
    const matchesProperty =
      filters.propertyId === ALL_FILTER_VALUE || actionItem.propertyId === filters.propertyId;
    const matchesCategory =
      filters.category === ALL_FILTER_VALUE || actionItem.category === filters.category;
    const matchesStatus =
      filters.status === ALL_FILTER_VALUE || actionItem.status === filters.status;

    return matchesProperty && matchesCategory && matchesStatus;
  });
}
