/**
 * The dashboard's primary navigation.
 *
 * Follows the standard ARIA tabs pattern (`role="tablist"` /
 * `role="tab"` / `aria-selected`) so the active section is announced to
 * assistive tech, not just implied by colour. Each tab keeps the same "act"
 * chip language used inside its panel's SectionHeader, so the label a reader
 * clicks and the label they land on are the same word.
 */
export default function TabNav({ tabs, activeTabId, onSelectTab }) {
  return (
    <div role="tablist" aria-label="Dashboard sections" className="flex gap-6 px-6">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectTab(tab.id)}
            className={`relative py-3.5 text-sm font-medium transition-colors ${
              isActive
                ? 'text-[var(--ink-primary)]'
                : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
            }`}
          >
            {tab.label}
            {/* Active indicator drawn as its own element rather than a border,
                so it doesn't nudge the tab's height by a pixel when toggled. */}
            <span
              aria-hidden="true"
              className={`absolute right-0 bottom-0 left-0 h-0.5 rounded-full transition-colors ${
                isActive ? 'bg-[var(--accent)]' : 'bg-transparent'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
