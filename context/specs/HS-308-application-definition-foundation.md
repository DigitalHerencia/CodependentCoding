---
id: HS-308
title: Establish the canonical Application Definition and resolver
status: active
type: implementation-spec
order: 308
depends_on: [HS-302, HS-306]
issue: 154
---

# HS-308 — Application Definition foundation

## Outcome

Establish the canonical typed Application Definition and deterministic resolution
engine required by the owner-approved redesign of **The Constituter™**.

This is the dependency root of the redesign, not a claim that the later provider,
authorization, artifact-control, property-editor, and Output Explorer phases are
already complete.

## Authority

The owner-supplied `The Constituter: Functional Design and Implementation
Specification` dated 2026-08-13 controls functionality and overrides older
governance where they conflict. Existing architectural grammar and the standalone
`template/` boundary remain fixed.

Read this spec, Issue #154, `context/docs/{configuration,architecture}.md`,
`.agents/contracts/{product,architecture}.yaml`, and only the shared schema/core,
CLI adapter, web Constituter adapter, ownership catalog, generation plan, and
directly affected tests.

## Scope

- define Application Definition, Property, Provider, Capability, Dependency,
  Constraint, Resource, Authorization Model, Role, Route Surface, Artifact Set,
  Artifact, and Generation Plan as shared domain concepts;
- define machine-readable property mechanisms, states, relations, visibility,
  requirements, conflicts, effects, and validation metadata;
- make presets seed one definition, preserve explicit overrides, resolve
  transitive dependencies, and record why required values were selected;
- derive provider, resource, permission, route, module, artifact-set,
  environment, and setup consequences rather than serializing them as intent;
- reject unsupported combinations and unsafe output exclusions explicitly;
- keep the current recipe surface as a temporary compatibility adapter over the
  canonical resolver so existing CLI, web, config, and generator paths do not
  gain a second semantics engine;
- expose a deterministic browser-safe resolved definition and generation-plan
  preview for later The Constituter™ UI phases;
- update only active governance that contradicts this approved direction.

## Non-goals

- no broad Constituter UI rewrite;
- no decorative provider or ABAC controls;
- no provider-removal implementation yet;
- no arbitrary file checkboxes or independently removable artifact controls yet;
- no second template, template metadata leakage, backend, deployment, or provider
  configuration;
- no unrelated identifier cleanup.

## Acceptance

- shared runtime/types export the canonical entities and typed property metadata;
- identical definitions resolve to equivalent deterministic plans;
- preset, explicit, required, and derived provenance is inspectable;
- dependency explanations identify the selecting capability;
- unsupported conflicts and unsafe artifact-set exclusions fail clearly;
- the existing recipe/CLI/web adapters delegate to the canonical resolver;
- the generator plan exposes the same resolved consequences used by previews;
- focused schema/resolver/config/Constituter tests pass, followed once by the
  coherent relevant type/build gate.
