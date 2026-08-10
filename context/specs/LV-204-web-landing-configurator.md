---
id: LV-204
title: Build the developer-tool landing page and configurator
status: ready
type: implementation-spec
order: 4
depends_on: [LV-202, LV-203]
issue_title: 'Split and polish the Loaded Vibes website and configurator'
---

# LV-204 — Build the developer-tool landing page and configurator

## Outcome

Turn `apps/web` into a developer-oriented Loaded Vibes website with a concise landing page at `/` and the actual visual configuration workbench at `/configure`.

## Starting state

The current root route renders the configurator directly. The existing UI was built around the previous product/preset model.

## Read

- `context/docs/web.md`
- `context/docs/product.md`
- `context/docs/configuration.md`
- `.agents/contracts/product.yaml`

## Scope

- create a dedicated `/` landing page;
- move the visual configuration experience to `/configure`;
- rework configurator vocabulary around fixed foundation, real optional surfaces/integrations, identity, design, and output;
- consume the shared browser-safe schema/core rather than duplicating semantics;
- preserve stateless operation and the CLI/JSON handoff;
- use the supplied dark Loaded Vibes software-factory visual direction;
- keep the site concise and tool-first;
- keep generated-app preview product-like rather than architecture-documentation-like.

## Visual contract

Loaded Vibes itself is dark-only, with near-black surfaces, restrained borders, electric blue/violet/magenta accents, controlled glow, mono technical labels, a clean sans information face, and limited script treatment for the Loaded Vibes brand.

The supplied concept images are visual references, not a requirement to copy their exact composition.

## Non-goals

- no accounts;
- no hosted build system;
- no project database;
- no Loaded Vibes billing;
- no generic SaaS landing-page expansion;
- no new tests or validation systems.

## Acceptance

- `/` explains the product and gets the user into the tool quickly;
- `/configure` is the primary visual workbench;
- visible options match actual generator capability;
- the configurator can export/copy the same configuration contract consumed by the CLI;
- the website no longer uses the obsolete light/editorial visual direction;
- the preview looks like a generated product surface, not an architecture explainer.

## Verification

Use the existing web build/type checks relevant to changed code. Do not add new browser tests or validators for this Issue.
