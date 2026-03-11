# TaoMusic v0.5

TaoMusic is a lightweight AI-assisted web app for contextual music discovery and creative inspiration. Users provide a few human signals such as activity, mood, color, country, genre, or lyrical theme, and the app returns a small set of music suggestions plus a compact serendipity line.

v0.5 turns the product into a state-driven two-stage experience. The core recommendation system stays intact, but the interface now separates home input from result viewing, adds a compact result screen with floating controls, and fully implements Muse Bubble Mode as a first-class input path.

## Product Description

TaoMusic is intentionally narrow:

- not a streaming service
- not a full recommendation platform
- not a chat product

It is an `AI music muse`:

- fast
- session-only
- aesthetically driven
- explainable in how it maps context to music
- resilient when external APIs are unavailable

## What Changed in v0.5

- Refactored the page into explicit `home_input`, `generating`, `result_view`, and `tuning` states
- Added a compact result-state header with automatic mode-switch regeneration
- Added a floating control panel with `Reroll`, `Tune`, and `Back to home`
- Added quick tune modifiers for warmer, nocturnal, focused, and more surprising variations
- Added Muse Card reveal, minimize, and reopen behavior instead of showing the card fully by default
- Upgraded structured inputs to stronger chip-based controls
- Expanded Muse Bubble Mode with animated tactile bubbles, Spark selection, and stronger selection feedback
- Expanded the vocabulary for regions/cultures, moods, genres, and scenes
- Added `scene` as a new recommendation input signal
- Added Framer Motion transitions across screen states and result interactions

## Current Features

### Fully implemented

- Single-page web experience with editorial UI
- State-driven two-stage flow for input, generation, result view, and tuning
- Context form for `activity`, `mood`, `color`, `country`, `genre`, `scene`, and `lyrical theme`
- Chip-style structured controls with Spark seeding
- Muse Bubble Mode with animated bubble selection, focus presets, Spark, refresh, reroll, and surprise flows
- Automatic mode-switch regeneration while in the result view
- Floating result controls and quick tuning modifiers
- Reveal/minimize/reopen Muse Card flow
- Preset moods for quick exploration
- Recommendation API endpoint at `POST /api/recommend`
- Deterministic recommendation pipeline:
  - input validation
  - context normalization
  - candidate retrieval
  - weighted scoring
  - diversity pass
  - final result shaping
- Reroll flow with recent-result exclusion
- Surprise flow that injects one additional signal
- Clipboard-based text sharing
- Screenshot-friendly share-card panel
- Motion-enhanced, atmospheric responsive UI across home and result surfaces
- Health endpoint at `GET /api/health`
- Production build verified with `npm run build`
- Type safety verified with `npm run typecheck`

### Implemented with fallback behavior

- Music retrieval always works through the curated local seed library in [`data/seed-candidates.ts`](data/seed-candidates.ts)
- External Spotify enrichment is optional and non-blocking
- If Spotify lookup fails, the request still resolves through the local library
- Serendipity line generation falls back to local templates if no LLM key is configured or the LLM call fails

### Optional external integrations currently supported

- Spotify track search plus artist-genre enrichment
- OpenAI-compatible chat completion for serendipity lines

## Local Run Instructions

### Prerequisites

- Node.js `20.20.0` or newer
- npm `10+`

If you use `nvm`, a matching version is provided in `.nvmrc`.

### Install

```bash
npm install
```

### Start the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Build Instructions

### Typecheck

```bash
npm run typecheck
```

### Production build

```bash
npm run build
```

### Run the full local verification pass

```bash
npm run check
```

### Start the production server locally

```bash
npm run start
```

## Environment Variables

Copy `.env.example` to `.env.local` and add only what you need.

### Required for the base product

None. TaoMusic works end to end with the local seed library and template serendipity output.

### Optional

- `SPOTIFY_CLIENT_ID`
  - Enables Spotify metadata and candidate enrichment
- `SPOTIFY_CLIENT_SECRET`
  - Enables Spotify OAuth token acquisition
- `OPENAI_API_KEY`
  - Enables LLM-generated serendipity lines
- `OPENAI_MODEL`
  - Defaults to `gpt-4.1-mini`
- `OPENAI_BASE_URL`
  - Defaults to `https://api.openai.com/v1`
  - Allows OpenAI-compatible providers

## External vs Fallback Behavior

| Area | Status | Notes |
| --- | --- | --- |
| Seed music catalog | Fallback baseline | Always available |
| Spotify retrieval and enrichment | Optional external | Used only when credentials are configured |
| Serendipity LLM generation | Optional external | Falls back to template copy |
| Recommendation scoring and ranking | Local and explicit | Never outsourced |
| Share-card rendering | Local and complete | No external service required |

## Project Structure

```text
app/
  api/
    health/
    recommend/
  globals.css
  icon.svg
  layout.tsx
  page.tsx
data/
  seed-candidates.ts
docs/
  brand-directions.md
  planning-brief.md
public/
  brand/
src/
  brand/
  components/ui/
  config/
  features/recommendations/
  lib/
  services/
```

## Known Limitations

- The curated seed dataset is still intentionally small, so some combinations may repeat over time.
- Spotify enrichment improves realism, but the app still does not have deep lyrical-theme or artwork-color understanding from external data.
- Region handling for external tracks is still lightweight and inferred from the query context rather than verified track geography.
- Share export is screenshot-oriented, not a generated image or downloadable artifact.
- There is still no persistence, no accounts, and no database.
- There is still no automated test suite beyond typecheck and production build verification.

## Deferred for Future Versions

- Last.fm or multi-provider enrichment
- Richer metadata fusion and better region/theme inference
- Export-to-image or downloadable share assets
- Lightweight browser persistence
- Personalization and long-term recommendation memory
- Audio preview or playback integration

## Notes

- The earlier Muse Bubble Mode planning document remains in [`docs/muse-bubble-mode-plan.md`](docs/muse-bubble-mode-plan.md)
- The selected v0.2 identity direction is documented in [`docs/brand-directions.md`](docs/brand-directions.md)
- The original ideation brief is archived in [`docs/planning-brief.md`](docs/planning-brief.md)
- The repository includes an MIT [`LICENSE`](LICENSE)
