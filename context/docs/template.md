---
title: Hipster Stack Maximal White-Label Template
artifact: template
status: active
product: Hipster Stack
authority: source-of-truth
---

# Hipster Stack Maximal White-Label Template

## Definition

Hipster Stack owns one maximal standalone white-label application at `template/`.

The template is the best reusable version of the application architecture repeatedly built from the Codependent Coding Knowledge System. It contains application routes, features, presentation, server operations, data/persistence, integrations, tests, deployment setup, and scoped application/agent context when those belong to the application itself.

## Hard boundary

The template is the product source, not generator machinery.

It must not contain generator ownership catalogs, retain/remove instructions, Builder state, CLI implementation, generation planning, or Hipster Stack-only metadata whose only purpose is to tell the generator how to construct it. That information belongs upstream in the generator.

The template should remain runnable and conceptually complete if extracted from this monorepo.

## Maximal means supported

A surface belongs in the maximal template only when a real working implementation exists. Proposed future providers/capabilities do not become configurable merely because governance names them.

## Application grammar

The template preserves the established method and boundaries from DevNotes. Concrete optional modules/providers may become composable only when the generator has an explicit deterministic ownership contract for them.

Generated application UI must look like a product, not documentation about the generator.
