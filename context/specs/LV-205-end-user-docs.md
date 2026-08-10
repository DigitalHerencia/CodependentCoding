---
id: LV-205
title: Add canonical end-user documentation
status: ready
type: implementation-spec
order: 5
depends_on: [LV-202, LV-203]
issue_title: 'Add canonical Loaded Vibes end-user docs and /docs'
---

# LV-205 — Add canonical end-user documentation

## Outcome

Create one end-user documentation source at `docs/` and render it from the website at `/docs/*`.

## Starting state

Current durable documentation is primarily README/maintainer context. The target product needs user docs that are separate from `context/`.

## Read

- `context/docs/documentation.md`
- `context/docs/product.md`
- `context/docs/generator-cli.md`

## Scope

- add the initial `docs/` structure described by the documentation contract;
- document the one-template model;
- document configuration categories actually supported after LV-202/LV-203;
- document CLI commands actually supported;
- document generated-project handoff and user-owned provider setup;
- add a small website docs renderer/navigation under `/docs/*`;
- link the README and website to the same canonical docs.

## Non-goals

- do not duplicate all Hipster Stack architecture into end-user docs;
- do not create docs for unsupported providers or commands;
- do not create a documentation CMS;
- do not add tests or validators.

## Acceptance

- `docs/` is the canonical end-user source;
- `/docs/*` renders that source;
- maintainer context remains in `context/`;
- docs match real release behavior and do not promise unimplemented configuration;
- provider setup responsibilities are clear.

## Verification

Use only the existing web/build checks required by the docs renderer changes. No new documentation validation system.
