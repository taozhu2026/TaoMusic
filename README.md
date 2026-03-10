# TaoMusic v0.2

TaoMusic is a lightweight AI-assisted web app for contextual music discovery and creative inspiration. Users provide a few human signals such as activity, mood, color, country, genre, or lyrical theme, and the app returns a small set of music suggestions plus a compact serendipity line.

v0.2 is a productization pass on top of the first MVP. It does not rewrite the app. It strengthens identity, shareability, and external music realism while preserving the explicit recommendation pipeline and zero-config fallback behavior.

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

## What Changed in v0.2

- Added a lightweight brand identity MVP with a chosen logo direction and favicon
- Added documented brand explorations in [`docs/brand-directions.md`](docs/brand-directions.md)
- Upgraded Spotify integration from a basic optional search hook to a safer candidate-enrichment path
- Preserved the seed library as a guaranteed fallback path
- Added a screenshot-friendly share-card panel in addition to text copy
- Improved loading, reroll, and surprise feedback
- Kept the app deployable with no auth and no database

## Current Features

### Fully implemented

- Single-page web experience with editorial UI
- Context form for `activity`, `mood`, `color`, `country`, `genre`, and `lyrical theme`
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

- The selected v0.2 identity direction is documented in [`docs/brand-directions.md`](docs/brand-directions.md)
- The original ideation brief is archived in [`docs/planning-brief.md`](docs/planning-brief.md)
- The repository includes an MIT [`LICENSE`](LICENSE)
