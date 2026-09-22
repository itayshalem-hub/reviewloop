# ReviewLoop

**[Live demo →](https://claude.ai/code/artifact/fae70c4f-f776-429d-8101-a2ed2e6a7639)**

A frontend MVP mockup of a B2B SaaS dashboard for property management companies
running 10–50 vacation rentals.

The product answers one question a PMC owner actually asks of a review tool:
**what did this earn me?** It does that in three acts, organised as three tabs.

| Tab | Act | The claim |
| --- | --- | --- |
| **Map & Action Items** | Act | A portfolio map (click a pin to filter by property) above a queue of AI-generated tasks. A review tool is only useful if its output is a task you can assign — every row is a work order, *"re-caulk the master shower and swap the low-flow head"*, never *"guests mentioned the bathroom"*. |
| **Effectiveness Tracker** | Prove | Mark a fix implemented with a date; the rating chart splits into before/after at that date. Once a lift holds across enough reviews, it becomes a directional pricing suggestion. |
| **Benchmarking** | Compare | Where the property sits inside the portfolio, where it sits in the local market, and the one category where anonymised local top performers still beat it. |

Selecting an action item on the first tab re-scopes the other two and jumps
straight to **Effectiveness Tracker**, so the reader lands on the answer to the
question they just asked. "← Back to action items" and "See how it compares →"
links on the other two tabs keep the same flow reachable in both directions.

---

## Running it

### Option A — open the preview, no install required

```bash
open preview.html
```

A single self-contained file that renders the same components from a CDN. No
Node, no build step.

### Option B — the Vite dev server

Requires Node 18+. If it's not installed, get it via
[nvm](https://github.com/nvm-sh/nvm) (no admin password needed) or
`brew install node`, then:

```bash
npm install
npm run dev
```

### Rebuilding the preview

`preview.html` and `artifact.html` are generated — never edit them directly:

```bash
npm run build:standalone   # or: ./scripts/build-standalone.sh
```

The script strips ES module syntax from the files in `src/` and concatenates
them, so the bundles can never drift from the app they mirror. `src/` is the
only source of truth.

---

## Structure

```
src/
  data/mockData.js            All fictional data — properties, action items,
                              benchmarks, pricing prompts. Zero UI knowledge.
  utils/
    portfolioMetrics.js       Pure derivations: rating lifts, before/after
                              splits, the portfolio revenue model.
    actionItemQueries.js      List filtering and in-session edit merging.
    formatters.js             Numbers → strings. No calculation.
    chartTheme.js             Chart colours and mark geometry.
  components/
    PortfolioHeroMetric.jsx   The headline figure and its stated assumptions.
    map/PortfolioMap.jsx      An illustrative (not geographic) portfolio map —
                              schematic SVG town + real HTML pin buttons.
    actionItems/              Act  — the filterable work queue.
    tracker/                  Prove — timeline, before/after chart, pricing.
    benchmarking/             Compare — internal, external, competitive gap.
    ui/                       Card, Badge, SectionHeader, FilterSelect, tooltip,
                              TabNav, TabLink.
  App.jsx                     All state lives here; every panel is presentational.
```

**State**: `useState` only — no reducers, context, or memoisation. At this data
size, recomputing derived values each render from pure helpers keeps the data
flow readable end to end.

**Colour**: defined once as CSS custom properties in `src/index.css` and
referenced as `bg-[var(--token)]`, so the palette is re-skinnable in one place
and identical across both build paths.

---

## Product decisions worth noting

These are the parts a reviewer should look at — they are where the product takes
a position rather than just rendering data.

**No number without its basis.** The hero revenue figure carries its model on
screen: *+3 pts occupancy uplift × ADR × 30.4 room-nights/mo, applied only to
properties holding a sustained post-change lift.* It is rounded to the nearest
$10, because false precision on a modelled figure implies an accuracy the
assumptions do not have.

**Sample size is never hidden.** Every chart point shows `n=`, and a lift built
on fewer than five post-change reviews is labelled *directional*, not proven. A
4.8 across 3 reviews and a 4.8 across 30 must not look identical.

**"Gathering data" is a feature.** Below 12 reviews across 4 months, the tracker
refuses to draw a trend line and says what is missing and what would unlock it.
Drawing a confident line through four reviews is the fastest way to lose a
buyer's trust in a QBR.

**The pricing prompt is earned.** It only appears once a rating has actually held
at a higher level, is framed as a test to validate rather than a forecast, keeps
`n=` beside the claim, and is dismissible.

**Competitors are anonymous.** Described by type and distance only — *"2-bedroom
apartments ~0.4 km away"*. The pattern is the product; the neighbour's identity
is not.

**The map is illustrative, not geographic.** Real map tiles (Leaflet/OpenStreetMap)
would break on the published Artifact demo, whose content-security policy
blocks image loads from arbitrary hosts — and would need real coordinates for
fictional properties anyway. The schematic SVG town (river, park, plaza,
district labels) works identically everywhere the dashboard runs, and fits the
"mock data, told honestly" register of the rest of the product.

**Charts argue, they don't decorate.** The before segment is a recessive grey and
the after segment carries the single accent, so attention lands on the outcome.
The competitive gap uses a dot plot with a declared domain rather than bars,
because a zero-based bar makes 4.4 and 4.9 look identical while a truncated bar
would be dishonest. Line animation is off deliberately: Recharts draws a line by
animating its `stroke-dasharray` from zero, so an un-run animation renders an
invisible chart for anyone with reduced-motion settings or a static capture.

---

All data is fictional. This is a frontend mockup — there is no backend.
