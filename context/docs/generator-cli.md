---
title: Hipster Stack Generator and CLI
artifact: generator-cli
status: active
product: Hipster Stack
authority: source-of-truth
---

# Hipster Stack Generator and CLI

## Role

The generator converts a resolved application definition into a local standalone white-label project. The CLI is its primary local execution adapter.

## Lifecycle

```text
collect/load configuration
→ runtime validate
→ resolve defaults/dependencies/conflicts
→ review
→ safe destination check
→ materialize maximal template
→ retain/remove/transform owned artifacts
→ write portable configuration + provenance
→ install dependencies when requested
→ initialize Git when requested
→ concise handoff
```

Ordinary generation must not depend on live GitHub, provider credentials, or a hosted Hipster Stack service.

## Naming target

HS-302 owns the runtime rename. Its target public vocabulary is:

```text
hipster-stack create [directory]
hipster-stack add <supported-surface>
hipster-stack explain
hipster-stack doctor
hipsterstack.json
```

Until HS-302 lands, existing runtime identifiers remain implementation evidence, not competing product doctrine.

## CLI responsibility

The CLI owns command parsing, prompts, review, progress, and terminal output. It delegates all configuration meaning and generation behavior to shared code and must not create a second resolver.

Keep output concise. Complex configuration may use the portable config file or Builder rather than an absurd forest of dedicated flags.
