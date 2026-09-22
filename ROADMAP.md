# Backend Roadmap

This app is a frontend mockup — everything lives in
[`src/data/mockData.js`](src/data/mockData.js). This is a short plan for what
it would take to make it real, organised by the same three acts the dashboard
already tells its story in.

**Why this is a contained change, not a rewrite:** the frontend already
isolates every piece of data access into one file (`mockData.js`) and one
calculation layer (`utils/portfolioMetrics.js`). Swapping mock arrays for API
calls means touching those two places — no component needs to change.

---

## 1. Get reviews in

| | |
|---|---|
| **What** | Pull guest reviews (text, rating, date, property, channel) into a database as they arrive. |
| **How** | Most PMCs already run a channel manager (Guesty, Hostaway, OwnerRez) that aggregates Airbnb/Booking.com/VRBO in one place — integrate with *that* API rather than each OTA separately. Fall back to direct OTA APIs only for PMCs without one. |
| **Trigger** | Webhook where the source supports it; otherwise a polling job (e.g. hourly). |

## 2. Turn reviews into action items (**Act**)

| | |
|---|---|
| **What** | Run new review text through an LLM: classify it into one of the 5 fixed categories, extract a concrete task (not a summary), estimate impact. |
| **Non-trivial part** | De-duplication — five guests flagging the same broken shower head should produce one action item, not five. |
| **Human-in-the-loop** | A generated item is a *draft* until a manager confirms or edits it — never auto-published as a work order. |

## 3. Track effectiveness (**Prove**)

| | |
|---|---|
| **What** | Persist `implementedDate` per action item as a real write (not client state). A scheduled job recomputes before/after averages as new reviews land. |
| **Keep from the mockup** | The honesty rules move server-side too: the same sample-size thresholds (`n≥12` before plotting, `n≥5` before calling a lift "sustained") apply for every viewer, not just this session's `useState`. |
| **Pricing job** | Watches properties with a sustained lift and raises a suggestion once the threshold is crossed — same trigger logic as `pricingRecommendations` in the mock data, just computed continuously. |

## 4. Benchmark against the market (**Compare**) — the hard part

| | |
|---|---|
| **What** | Internal benchmark (vs. your own portfolio) is a simple aggregate query — trivial. External benchmark (vs. local competitors) needs data this product doesn't own. |
| **How** | Buy it from a market-intelligence provider (AirDNA, Key Data, Transparent) that already aggregates anonymised comp-set data, rather than scraping OTAs directly — scraping is a real ToS/legal risk and not recommended. |
| **Positive keywords** | If the provider supplies raw competitor review text, run it through the same NLP pipeline as step 2; if only aggregates, use whatever keyword/theme data they expose. |

## 5. Data model

Properties, Reviews, ActionItems, RatingHistory, Benchmarks,
PricingRecommendations, Accounts (one PMC = one account, many properties). A
relational database (Postgres) fits well — the workload is mostly read-heavy
aggregation over reviews and time, which is exactly what
`portfolioMetrics.js` already does in memory.

## 6. Infra

A queue for ingestion/NLP jobs (SQS or similar), a scheduled worker for the
recompute jobs in steps 3–4, and standard hosting (e.g. a managed Postgres +
a small API service + a worker process). Nothing exotic — the load is bursty
batch work (new reviews, nightly recomputes), not high-throughput real-time.

---

**Rough order to build it in:** 1 → 2 → 5 (need somewhere to put the output)
→ 3 → 6 → 4 (buy the data before building the pipeline around it).
