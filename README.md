# TaoMusic v0.6

TaoMusic is a lightweight AI-assisted music muse for contextual discovery. You provide a few human signals such as activity, mood, color, region, genre, scene, or lyrical theme, and the app returns a compact three-track constellation plus an editorial interpretation.

v0.6 is the first route-split release. The home page is now input-only, generated results move onto a dedicated `/result?id=...` route, the interface supports theme and language preferences globally, and the local music index has been expanded to a 400+ structured catalog with strong Chinese and East Asian coverage.

## What Changed in v0.6

- Split the app into `/` for input and `/result?id=<resultId>` for result viewing
- Added temporary server-side `resultId` caching plus `GET /api/result`
- Redesigned the result route into a two-column one-screen layout
- Added a flip panel that switches between `Current Constellation` and `Muse Card · 灵感卡片`
- Added full `light / dark / system` theme support with persistence and system-following behavior
- Added full English and Simplified Chinese UI switching with live persistence
- Localized structured taxonomy labels, bubble labels, presets, controls, and result UI
- Replaced the tiny fallback seed list with a modular local catalog of 486 tracks
- Added UI-language-aware ranking bias so Chinese UI leans toward Chinese and East Asian tracks without hard filtering

## Current Product Shape

- `/`
  - structured mode with compact select controls
  - bubble mode with tactile bubble selection
  - global settings access for theme and language
- `/result`
  - dedicated result route backed by temporary cached `resultId`
  - top-right reroll, tune, settings, and back-home controls
  - left flip panel for constellation summary and Muse Card
  - right rail with exactly three recommended tracks

## Local Catalog

The local recommendation baseline is now a modular in-repo catalog:

- total local catalog size: `486`
- Chinese-language tracks: `216`
- Japanese tracks: `80`
- Korean tracks: `70`
- East Asian coverage total: `366`

Catalog records are structured with language, region, genre tags, mood tags, scene tags, lyrical-theme tags, instrumentation tags, and additional scoring metadata. The app still supports optional Spotify enrichment, but core recommendation quality no longer depends on external providers.

## API Endpoints

- `POST /api/recommend`
  - accepts a generation envelope with `input`, `mode`, `structuredDraft`, and `bubbleDraft`
  - returns `{ resultId }`
- `GET /api/result?id=<resultId>`
  - fetches the cached result envelope for the dedicated result route
- `GET /api/health`
  - reports version and provider availability

## Local Run

### Prerequisites

- Node.js `20.20.0` or newer
- npm `10+`

### Install

```bash
npm install
```

### Start development

```bash
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run typecheck
npm run catalog:check
npm run build
```

Or run the combined check:

```bash
npm run check
```

## Environment Variables

Base TaoMusic works without any environment variables.

Optional integrations:

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `OPENAI_BASE_URL`

## Project Structure

```text
app/
  api/
    health/
    recommend/
    result/
  globals.css
  icon.svg
  layout.tsx
  page.tsx
  result/
data/
  catalog/
docs/
  brand-directions.md
  planning-brief.md
  muse-bubble-mode-plan.md
scripts/
  validate-catalog.ts
src/
  brand/
  components/ui/
  config/
  features/recommendations/
  i18n/
  lib/
  providers/
  services/
```

## Limitations

- Result ids are temporary, in-memory, and intended for the current deployment model rather than durable sharing.
- The local catalog is editorial and structured, but it is still not a live streaming index.
- Spotify enrichment remains opportunistic and does not drive the core recommendation flow.
- Serendipity line generation can still fall back to local templates if no LLM provider is configured.

## Notes

- v0.2 brand direction notes are in [`docs/brand-directions.md`](docs/brand-directions.md)
- early product ideation is archived in [`docs/planning-brief.md`](docs/planning-brief.md)
- Muse Bubble Mode planning remains documented in [`docs/muse-bubble-mode-plan.md`](docs/muse-bubble-mode-plan.md)
