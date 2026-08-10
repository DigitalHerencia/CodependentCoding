---
title: Loaded Vibes Website and Configurator
artifact: web
status: active
product: Loaded Vibes
authority: source-of-truth
---

# Loaded Vibes Website and Configurator

## Product role

The website is a developer tool with enough explanation to establish what Loaded Vibes does.

It is not a marketing site with a configurator buried at the bottom.

Target balance:

```text
roughly 20% explanation
roughly 80% tool
```

## Routes

```text
/             developer-oriented landing page
/configure    visual configuration workbench
/docs/*       end-user Loaded Vibes documentation
```

No Loaded Vibes account system, hosted project database, billing system, or remote build backend is required.

## Landing page

The landing page should communicate:
- Loaded Vibes is a software factory / deterministic project generator;
- one template, not many architectures;
- DevNotes supplies doctrine and Loaded Vibes supplies deterministic production;
- the generated white-label repo is the payoff;
- the CLI is the execution surface;
- the configurator creates a portable configuration for the CLI.

Keep it concise and developer-facing.

## Visual direction

Use the supplied Loaded Vibes concept imagery as the visual direction, not as a literal layout specification.

Loaded Vibes itself is dark-only.

Preferred characteristics:
- near-black canvas;
- restrained bordered panels;
- electric blue, violet, and magenta accents;
- luminous but controlled gradients;
- script treatment limited to the Loaded Vibes wordmark or selected hero emphasis;
- mono typography for technical labels and commands;
- clean sans typography for dense product information;
- compact developer-tool controls;
- diagrams and code/CLI surfaces that feel operational rather than decorative.

Avoid beige editorial styling, startup-confetti aesthetics, oversized generic SaaS sections, and dashboard-density for its own sake.

## Configurator

The configurator should feel like a project workbench:

```text
┌───────────────────┬──────────────────────────────────────┐
│ PROJECT           │ resolved project / preview           │
│ Optional surfaces │                                      │
│ Integrations      │ fixed foundation                     │
│ Identity          │ retained routes / integrations       │
│ Design            │ output summary                       │
│ Review            │ representative generated-app preview │
├───────────────────┴──────────────────────────────────────┤
│ loaded-vibes create ... --config loadedvibes.json        │
└──────────────────────────────────────────────────────────┘
```

The web UI must consume the browser-safe shared core rather than implementing its own configuration semantics.

## Output

The initial web configurator exports:
- `loadedvibes.json`;
- a copyable CLI command;
- a readable summary of what the CLI will produce.

It does not perform the local generation itself.

## Preview

Preview representative generated-product surfaces. Do not show architecture metadata as fake application content.

The generated dashboard should look like a dashboard, not like:

```text
Runtime: RSC
Writes: Actions
Authz: Rows
```

Architecture explanation belongs in docs, context, `loaded-vibes explain`, or generated repository guidance.
