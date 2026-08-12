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

## Interactive presentation

The website may augment canonical docs with browsable building-block categories, related concepts, truthful configuration/status examples, and `Open in Builder` handoffs. Those UI additions are navigation/presentation metadata; shared schema/core remains configuration authority.

The previous `/libraries` catalog/detail experience is folded into Docs by HS-305. Preserve old URLs only through the smallest useful redirect/compatibility path.

## Audience and rules

Docs are for developers using Hipster Stack, not Codex maintaining it. Maintainer context remains under `context/`. Application architectural context belongs in the standalone template/generated repository.

Document only providers, commands, routes, configuration fields, and behavior the current release actually supports. Provider account setup remains user-owned.
