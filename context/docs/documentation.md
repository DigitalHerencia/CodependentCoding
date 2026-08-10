---
title: Loaded Vibes End-User Documentation
artifact: documentation
status: active
product: Loaded Vibes
authority: source-of-truth
---

# Loaded Vibes End-User Documentation

## Canonical source

End-user documentation lives at repository root:

```text
docs/
```

The website renders that content under:

```text
/docs/*
```

Do not maintain one documentation copy for GitHub and another copy for the website.

## Audience

The docs are for someone using Loaded Vibes, not for Codex maintaining Loaded Vibes.

Maintainer context stays in `context/`.

Generated-application architectural context stays inside `template/` and the generated repository.

## Initial documentation set

```text
docs/
├── index.md
├── getting-started.md
├── concepts/
│   ├── one-template.md
│   ├── configuration.md
│   └── generated-project.md
├── configuration/
│   ├── project.md
│   ├── optional-surfaces.md
│   ├── integrations.md
│   ├── identity.md
│   └── design.md
├── cli/
│   ├── index.md
│   ├── create.md
│   ├── add.md
│   ├── explain.md
│   └── doctor.md
└── troubleshooting.md
```

Add provider-specific pages only for integrations the released generator actually supports.

## Documentation principles

- Start from what the user is trying to accomplish.
- Explain fixed architecture only to the degree needed to use the generated project.
- Do not paste maintainer governance into user docs.
- Do not claim a provider, route, command, or configuration option works unless the release supports it.
- Keep setup instructions local and actionable.
- Keep provider account setup explicitly user-owned.
