# TaoMusic v0.1

TaoMusic is a lightweight AI-assisted web app for contextual music discovery and creative inspiration. A user gives a few human signals such as activity, mood, color, country, genre, or lyrical theme, and the app returns a small set of music suggestions plus a short serendipity line.

This repository is the first usable MVP: a single-page Next.js app with a deterministic recommendation pipeline, curated fallback data, and optional external adapters for richer metadata and text generation.

## Product Description

TaoMusic is intentionally narrow:

- not a streaming service
- not a full recommendation platform
- not a chat product

It is an `AI music muse`:

- fast
- session-only
- aesthetically driven
- explainable in how it matches context to music
- resilient when external APIs are unavailable

## Current Features

### Fully implemented

- Single-page web experience with a styled editorial UI
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
- Session-style reroll behavior through recent-result exclusion
- Surprise mode that injects an extra signal when the user wants drift
- Clipboard share action for the current result
- Health endpoint at `GET /api/health`
- Production build verified with `npm run build`
- Type safety verified with `npm run typecheck`

### Implemented with fallback behavior

- Music retrieval always works through the curated local seed library in [`data/seed-candidates.ts`](data/seed-candidates.ts)
- Serendipity line generation falls back to local templates if no LLM key is configured or the LLM call fails
- Recommendation quality remains usable even with no third-party credentials

### Optional integrations already wired

- Spotify search adapter for expanding candidate retrieval
- OpenAI-compatible chat completion adapter for serendipity line generation
- Configurable OpenAI-compatible base URL for alternative providers

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

### Run the full local release check

```bash
npm run check
```

### Start the production server locally

```bash
npm run start
```

## Environment Variables

Copy `.env.example` to `.env.local` and add only what you need.

### Required for the base MVP

None. The app works with the curated fallback dataset and template serendipity lines.

### Optional

- `SPOTIFY_CLIENT_ID`
  - Enables Spotify candidate retrieval
- `SPOTIFY_CLIENT_SECRET`
  - Enables Spotify OAuth token acquisition
- `OPENAI_API_KEY`
  - Enables LLM-generated serendipity lines
- `OPENAI_MODEL`
  - Defaults to `gpt-4.1-mini`
- `OPENAI_BASE_URL`
  - Defaults to `https://api.openai.com/v1`
  - Useful for OpenAI-compatible providers

## Current Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| UI shell and layout | Complete | MVP-ready single-page experience |
| Recommendation scoring pipeline | Complete | Rule-based plus weighted scoring |
| Seed music catalog | Complete | Main zero-config fallback path |
| Surprise and reroll interactions | Complete | Session-local only |
| Share action | Complete | Clipboard-based |
| Spotify retrieval | Optional | Works only when credentials are configured |
| LLM serendipity generation | Optional with fallback | Template fallback is always available |
| Persistence / user accounts | Not implemented | Intentionally out of scope for v0.1 |
| Database | Not implemented | Not needed for current MVP |
| Audio previews / playback | Not implemented | No playback integration in v0.1 |
| Recommendation learning / personalization | Not implemented | No saved history or user model |

## Project Structure

```text
app/
  api/
    health/
    recommend/
  globals.css
  layout.tsx
  page.tsx
data/
  seed-candidates.ts
docs/
  planning-brief.md
src/
  components/ui/
  config/
  features/recommendations/
  lib/
  services/
```

## Known Limitations

- The curated seed dataset is intentionally small, so some combinations will feel repetitive over time.
- Spotify search results are only lightly enriched; they do not yet include deep genre, lyrical theme, or artwork-color analysis.
- The LLM prompt layer is intentionally narrow and only generates one short line, not explanations or full prose.
- There is no persistence, no session storage restore, and no user account system.
- Share output is plain text only; there is no image card export yet.
- There is no automated test suite yet beyond typecheck and production build verification.
- Public release housekeeping is still incomplete until a project license is chosen.

## Next-Step Roadmap

### Near-term stabilization

- Add a small automated test layer around the recommendation pipeline
- Add a GitHub Actions workflow for `npm run check`
- Improve adapter error logging and request observability
- Expand the curated seed catalog with better tag coverage

### Product improvements

- Better Spotify enrichment and candidate blending
- More deliberate reroll diversification rules
- Share-card export or image snapshot
- Lightweight session persistence in browser storage

### Longer-term ideas

- Multi-provider music retrieval
- Better metadata enrichment for lyrical themes and artwork color
- Personalization without full account complexity
- Embedding-based similarity experiments

## Notes for GitHub v0.1

- The repository is ready for an initial GitHub push as `v0.1.0`
- The MVP works without external credentials
- The planning brief used during ideation is archived in [`docs/planning-brief.md`](docs/planning-brief.md)
- Before making the repository public, choose and add a license
