---
title: Hipster Stack End-User Documentation
artifact: documentation
status: active
product: Hipster Stack
authority: source-of-truth
---

# Hipster Stack End-User Documentation

## Canonical source

End-user documentation lives in root `docs/` and is rendered under `/docs/*`. Do not maintain a second technical documentation copy in web code.

## Relationship to Simples

Simples™ remains the browsable `/libraries/*` product surface for supported building blocks, relationships, fixed/configurable status, and focused examples. It may link into canonical Docs and the Constituter, but it is not a second documentation source and does not own configuration semantics.

Web-owned Simples metadata may organize categories, relationships, and presentation. Shared schema/core remains configuration authority.

## Audience and rules

Docs are for developers using Hipster Stack, not Codex maintaining it. Maintainer context remains under `context/`. Application architectural context belongs in the standalone template/generated repository.

Document only providers, commands, routes, configuration fields, and behavior the current release actually supports. Provider account setup remains user-owned.
