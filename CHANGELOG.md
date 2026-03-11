# Changelog

## 0.5.0 - Unreleased

- Refactored the app into a state-driven two-stage flow with `home_input`, `generating`, `result_view`, and `tuning`
- Added result-state compact header behavior, floating controls, and quick tune modifiers
- Implemented Muse Card reveal, minimize, and reopen interactions in the result screen
- Upgraded structured inputs to chip-based controls with Spark support
- Strengthened Muse Bubble Mode with animated bubble interactions, Spark selection, and expanded vocabulary coverage
- Added `scene` as a first-class input signal and expanded region, mood, genre, and scene mappings
- Added Framer Motion for screen transitions, bubble motion, and Muse Card panel animation

## 0.4.0 - 2026-03-11

- Refined the hero hierarchy with calmer typography and a more consistent intro label treatment
- Stabilized the muse/share card density and proportions across common laptop and desktop widths
- Improved overall layout behavior with more controlled breakpoint transitions and column balance
- Added a formal product and engineering plan for Muse Bubble Mode in [`docs/muse-bubble-mode-plan.md`](docs/muse-bubble-mode-plan.md)

## 0.2.0 - 2026-03-10

- Added a lightweight TaoMusic brand identity system with SVG exploration assets
- Integrated the chosen logo direction into the header and favicon
- Improved Spotify integration with safer enrichment behavior and graceful fallback handling
- Added provider-status visibility in recommendation results
- Added a screenshot-friendly share-card panel
- Improved loading, reroll, and surprise feedback without changing the core product shape

## 0.1.0 - 2026-03-10

Initial usable MVP release.

- Added a Next.js single-page TaoMusic experience
- Implemented contextual recommendation flow with validation, mapping, scoring, and diversity
- Added curated seed music fallback data so the app works without third-party credentials
- Added optional Spotify and OpenAI-compatible adapters
- Added release-ready README documentation and local run/build instructions
