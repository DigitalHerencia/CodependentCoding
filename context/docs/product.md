---
title: Hipster Stack Product Definition
artifact: product
status: active
product: Hipster Stack
authority: source-of-truth
---

# Hipster Stack Product Definition

## Product

Hipster Stack™ is an opinionated developer tool that turns a bounded application definition into a standalone white-label application derived from one repository-owned maximal template.

> Generate the golden prototype. Start building the product.

It is not a generic stack marketplace, startup-feature wizard, or hosted control plane.

## Primary user

The primary user is a developer who already understands the underlying technologies and wants to stop rebuilding the same architecture, boundaries, routes, integrations, and project structure.

## Product surfaces

1. maximal standalone template;
2. shared configuration/application-definition contract;
3. deterministic composition/generation engine;
4. CLI;
5. Product web page at `/`;
6. interactive Docs at `/docs/*` combining canonical documentation with browsable building-block/configuration views;
7. stateless Builder at `/configure`;
8. portable configuration handoff, targeted by HS-302 as `hipsterstack.json`;
9. generated application.

## Opinionated foundation

Hipster Stack fixes the engineering method and supported architectural grammar rather than forcing users to rediscover them:

- server-owned business truth and explicit trust boundaries;
- route → feature → presentation layering;
- protected read/mutation boundaries;
- runtime validation at trust boundaries;
- explicit authorization, persistence, transaction, provider, and webhook responsibilities;
- strong separation of concerns and narrow typed interfaces;
- generated repositories that remain understandable to humans and agents.

Concrete providers, route surfaces, authorization models, integrations, capabilities, and product configuration are selectable only when the shared schema and generator have deterministic support for that choice. Current implementation limitations remain authoritative until changed by an implementation Issue.

## Template payoff

The template is a maximal runnable application, not generator source code. Generator ownership/pruning metadata lives outside the template. Application-local tests, docs, CI, and agent contracts may remain when they govern the application itself.

## Ecosystem

```text
Codependent Coding™ Knowledge System
  canonical reusable engineering knowledge
        ↓
Hipster Stack™
  deterministic golden-prototype generation
        ↓
Generated application
        ↓
Loaded Vibes™
  adaptive specification-driven implementation
        ↓
Product-specific MVP
```

## Non-goals

Hipster Stack is not an arbitrary framework selector, provider/plugin marketplace, hosted build service, account-based configurator SaaS, autonomous upgrade/merge engine, or replacement for product-specific implementation after generation.
