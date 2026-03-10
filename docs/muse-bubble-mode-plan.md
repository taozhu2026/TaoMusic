# Muse Bubble Mode Plan

## Purpose

Muse Bubble Mode should add a second, more playful way to start a recommendation session without removing the current structured form.

The goal is not to replace the recommendation engine. The goal is to give users a softer, inspiration-first entry point that still lands on the same explicit pipeline.

## Current Structured Flow

The current app flow is compact and explicit:

1. `RecommendationExperience` keeps local form state and sends a `POST /api/recommend` request.
2. `app/api/recommend/route.ts` validates payloads with `recommendationInputSchema`.
3. `mapContextToProfile()` converts structured inputs into normalized tags, tone, energy/focus hints, and optional surprise injections.
4. `createRecommendation()` builds a query plan, asks the local seed provider and optional Spotify provider for candidates, deduplicates them, scores them, selects a diverse top 3, and generates a serendipity line.
5. The UI renders the result, reroll state, provider status, and share card.

This architecture is already the right foundation for Bubble Mode because the pipeline is modular and the front half is the only part that needs to become more expressive.

## Product Fit

Muse Bubble Mode should live beside the current form mode, not instead of it.

The safest shape is:

- a small mode switch in the left panel
- `Structured Mode` as the current explicit form
- `Muse Bubble Mode` as an alternative vibe-first panel
- shared request and result handling in `RecommendationExperience`

This keeps:

- the current recommendation API
- the current seed fallback path
- the current result view
- the current reroll and surprise mechanics

## Technical Representation

The core unit should be a curated bubble descriptor.

```ts
type BubbleFacet =
  | 'scene'
  | 'time'
  | 'texture'
  | 'temperature'
  | 'motion'
  | 'emotion'
  | 'genre'
  | 'region';

type BubbleFocus = 'balanced' | 'warmer' | 'nocturnal' | 'surprising' | 'focused';

interface MuseBubble {
  id: string;
  label: string;
  facet: BubbleFacet;
  tone?: string;
  vibeTags: string[];
  mapsTo?: Partial<RecommendationInput>;
  weight?: number;
  conflictsWith?: string[];
}
```

Selection state should stay separate from the form state:

```ts
interface MuseBubbleState {
  focus: BubbleFocus;
  refreshSeed: string;
  selectedIds: string[];
  dismissedIds: string[];
}
```

## Recommended MVP Approach

The best first implementation is a curated bubble token library plus a deterministic bubble selection engine.

Recommended:

- curated bubble library as the source of truth
- deterministic bundle generation using seed + focus bias
- lightweight mapping from bubbles into existing recommendation inputs
- optional `vibeTags` extension for extra soft signals

Not recommended for the MVP:

- embedding-based grouping as a required dependency
- LLM-generated bubbles as the main source of truth
- training infrastructure or learned preference models

Why:

- the app must work without API keys
- the current system is small and understandable
- curated bubbles are easier to tune and debug
- deterministic refresh behavior matches the current reroll philosophy

The practical long-term direction is a hybrid:

- curated library in v0.4
- embeddings later for clustering and expansion
- optional LLM assistance later for editorial variation, not core semantics

## How Bubble Selection Should Update Recommendation State

Bubble selection should not bypass the current signal model. It should feed it.

Recommended mapping behavior:

1. Each selected bubble contributes zero or more `mapsTo` fields such as `mood`, `color`, `genre`, or `country`.
2. Each selected bubble also contributes `vibeTags`.
3. A small aggregation step produces a normalized request payload.
4. The payload is sent through the same API route used by the structured form.

Example:

- `amber` -> `{ color: 'gold' }` + `['glow', 'warmth']`
- `midnight drive` -> `{ activity: 'walking' }` or a new scene mapping + `['nocturnal', 'motion', 'after-hours']`
- `paper moon` -> no direct form field, only `vibeTags`

This implies one safe backend extension:

- add optional `vibeTags?: string[]` to `RecommendationInput`

Then:

- `schema.ts` validates it
- `context-mapper.ts` merges it into the profile
- `orchestrator.ts` adds it to query secondary terms
- `scorer.ts` applies a modest overlap weight against candidate mood and instrumentation tags

This keeps the recommendation core explicit while allowing more poetic input.

## Conflict Resolution

Bubble mode needs deterministic conflict rules.

For the MVP:

- one dominant mapping per structured facet
- latest selected bubble wins within the same facet
- non-structured `vibeTags` always accumulate uniquely
- dismissed bubbles stay excluded until refresh

This is simpler and more predictable than weighted voting in the first version.

## Safest MVP Implementation Path

### 1. Add the data layer

- `src/features/recommendations/bubbles/types.ts`
- `src/features/recommendations/bubbles/library.ts`
- `src/features/recommendations/bubbles/engine.ts`
- `src/features/recommendations/bubbles/mappers.ts`

### 2. Extend recommendation input carefully

- add optional `vibeTags` to shared types
- extend `schema.ts`
- merge `vibeTags` in `context-mapper.ts`
- add them to `buildQueryPlan()` and scoring with conservative weight

### 3. Add the UI mode shell

- add a small mode switch in `RecommendationExperience`
- keep request/result state shared
- render either `ContextForm` or a new `MuseBubblePanel`

### 4. Build the bubble interaction panel

- `MuseBubblePanel`
- `BubbleCloud`
- `BubbleFocusStrip`
- `SelectedBubbleTray`

### 5. Preserve interoperability

- allow a bubble selection to prefill or synthesize structured state for request submission
- keep reroll and surprise available in both modes
- keep result rendering identical after submission

### 6. Verify stability

- typecheck and production build
- snapshot the data contract in documentation

## Components and Modules to Modify

Modify:

- `src/features/recommendations/components/recommendation-experience.tsx`
- `src/features/recommendations/types.ts`
- `src/features/recommendations/schema.ts`
- `src/features/recommendations/context-mapper.ts`
- `src/features/recommendations/orchestrator.ts`
- `src/features/recommendations/scorer.ts`

Add:

- `src/features/recommendations/bubbles/types.ts`
- `src/features/recommendations/bubbles/library.ts`
- `src/features/recommendations/bubbles/engine.ts`
- `src/features/recommendations/bubbles/mappers.ts`
- `src/features/recommendations/components/mode-switch.tsx`
- `src/features/recommendations/components/muse-bubble-panel.tsx`
- `src/features/recommendations/components/bubble-cloud.tsx`
- `src/features/recommendations/components/bubble-focus-strip.tsx`
- `src/features/recommendations/components/selected-bubble-tray.tsx`

Likely style touchpoints:

- `app/globals.css`

## Risks

- Bubble labels that feel poetic but map weakly to the current structured fields can create disappointing results.
- If `vibeTags` are weighted too heavily, the explainable structure becomes muddy.
- If the bubble library is too small, refresh interactions will feel repetitive quickly.
- If the mode switch is visually too strong, it will fragment the left panel instead of enriching it.

## Recommendation

For v0.4, implement Bubble Mode as a curated, deterministic second input mode that feeds the same recommendation pipeline.

That is the highest-leverage path because it improves the product feel immediately without sacrificing fallback behavior, explainability, or deployment simplicity.
