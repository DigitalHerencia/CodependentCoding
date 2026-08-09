# LV-108 — Stateless web configurator

## Outcome

Give users a visual way to build the same recipe used by the CLI.

## Scope

- build `apps/web` with Next.js/React/Tailwind/shadcn-compatible UI;
- consume the shared recipe schema/core;
- implement product-shape, capability, identity, and design steps;
- use local/client state and shareable serialization where useful;
- add review summary;
- do not add auth/database/backend generation infrastructure.

## Acceptance

- web choices produce the same normalized recipe semantics as the CLI;
- the flow works without a Loaded Vibes account;
- review makes generated inclusions/exclusions understandable;
- responsive UX remains usable outside desktop.
