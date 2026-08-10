---
title: Loaded Vibes Generator and CLI
artifact: generator-cli
status: active
product: Loaded Vibes
authority: source-of-truth
---

# Loaded Vibes Generator and CLI

## Role

The generator turns a normalized configuration into a local white-label project. The CLI is its primary user-facing execution adapter.

## Create lifecycle

```text
collect or load configuration
→ normalize
→ resolve dependencies
→ present concise review
→ ensure safe destination
→ copy maximal template
→ retain/remove configured ownership
→ apply structured personalization
→ write loadedvibes.json and provenance
→ install dependencies when requested
→ initialize Git when requested
→ show concise provider/user next steps
```

Do not make ordinary generation depend on live GitHub, provider credentials, or a hosted Loaded Vibes service.

## CLI vocabulary

Prefer developer-tool language:
- Configure project
- Fixed foundation
- Optional surfaces
- Integrations
- Product identity
- Visual direction
- Generated output

Avoid:
- Choose your stack
- Choose your architecture
- startup-builder marketing language
- internal generator jargon in normal output

## Command direction

The canonical binary is:

```text
loaded-vibes
```

Target commands remain small:

```text
loaded-vibes create [directory]
loaded-vibes add <supported-surface>
loaded-vibes explain
loaded-vibes doctor
loaded-vibes version
```

Keep compatibility aliases only while they materially reduce migration breakage. The release cleanup spec decides what still needs to ship.

## `create`

Interactive mode should ask only supported high-leverage configuration.

Config-file mode should use the exact same normalized contract:

```text
loaded-vibes create my-app --config loadedvibes.json
```

## `add`

`add` is allowed only for a generator-owned optional surface that has a safe ownership contract for modifying an already generated repository.

The one-template model does not require `add` to disappear, but it does require `add` to stop depending on duplicated module source trees once retain/remove ownership becomes canonical.

Do not promise arbitrary upgrades or merges into user-modified code.

## `explain`

Explain should answer:
- what Loaded Vibes generated;
- which optional surfaces are present;
- which integrations are wired;
- which setup remains user-owned;
- what fixed architecture the project inherits.

## `doctor`

Doctor remains a small diagnostic helper for local setup and metadata. It should not grow into a conformance framework.

## Output

Terminal output should be compact, legible, and useful. Show implementation details only when they help the user act.
