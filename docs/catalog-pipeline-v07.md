# TaoMusic Catalog Pipeline v07

v07 moves TaoMusic's local catalog from hand-maintained runtime records to a source-driven offline build pipeline.

## Goals

- keep recommendation requests fully local and fast at runtime
- make MusicBrainz the metadata backbone
- make Last.fm the primary tag-enrichment source
- leave a clean integration point for Spotify enrichment
- improve Chinese-language and East Asian coverage through deliberate seeds rather than ad hoc record editing

## Current architecture

The source of truth now lives under [data/catalog/source](/home/zhutao/projects/TaoMusic/data/catalog/source):

- `seed-groups.ts`: deliberate ingestion seeds grouped by region, language, and TaoMusic vibe targets
- `snapshots.ts`: local offline snapshots for MusicBrainz / Last.fm / Spotify-backed fields
- `taxonomy.ts`: raw-source-tag mapping into TaoMusic taxonomy
- `pipeline.ts`: ingestion, normalization, enrichment, and runtime-catalog mapping

Connector implementations live under [src/services/catalog-source](/home/zhutao/projects/TaoMusic/src/services/catalog-source):

- `musicbrainz.ts`
- `lastfm.ts`
- `spotify.ts`

These connectors support two modes:

- `snapshot`: default build mode, fully offline and deterministic
- `live`: optional future expansion path for real API enrichment

## Build flow

The offline build flow is:

1. seed groups expand into seed tracks
2. MusicBrainz resolves normalized metadata
3. Last.fm contributes enrichment tags
4. Spotify optionally contributes extra identifiers / audio hints
5. TaoMusic taxonomy mapping converts raw tags into structured catalog fields
6. the build script writes generated output into `data/catalog/generated/unified-catalog.ts`

Commands:

```bash
npm run catalog:build
npm run catalog:check
```

`catalog:check` rebuilds the generated output and validates:

- total catalog size
- Chinese / Japanese / Korean coverage minimums
- East Asian coverage minimum
- duplicate ids
- required structured tags
- required source references
- metadata/runtime consistency

## Runtime contract

Runtime recommendation requests still read from `LOCAL_CATALOG` through [data/catalog/index.ts](/home/zhutao/projects/TaoMusic/data/catalog/index.ts). The difference is that `LOCAL_CATALOG` is now generated output, not hand-authored primary data.

## Extending the catalog

To grow TaoMusic's coverage:

1. add or refine seed groups in `seed-groups.ts`
2. expand raw-tag mappings in `taxonomy.ts`
3. extend snapshot indexes or add live connector behavior
4. run `npm run catalog:build`
5. run `npm run catalog:check`

## Coverage strategy

v07 intentionally biases seed design toward Chinese-language and East Asian coverage:

- Chinese-language groups cover Mandopop, Chinese indie, urban healing, nocturnal city-pop, heartbreak ballad, and cinematic post-rock
- Japanese and Korean groups remain strong but secondary
- global groups stay broad enough to preserve mixed recommendation behavior

This keeps the catalog aligned with TaoMusic's actual product direction instead of drifting back toward Western-heavy filler coverage.
