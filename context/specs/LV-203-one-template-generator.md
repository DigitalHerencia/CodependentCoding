---
id: LV-203
title: Convert generation to one-template retain/remove ownership
status: completed
type: implementation-spec
order: 3
depends_on: [LV-201, LV-202]
issue_title: 'Generate from one template with explicit retain/remove ownership'
---

# LV-203 — Convert generation to one-template retain/remove ownership

## Outcome

Make the generator create projects from `template/` using explicit ownership and pruning rather than composing duplicated application source trees.

## Starting state

Current generation supports a golden base plus module overlays and `add` operations. The final model starts from one maximal template.

## Read

- `context/docs/architecture.md`
- `context/docs/template.md`
- `context/docs/configuration.md`
- `context/docs/generator-cli.md`
- `.agents/contracts/architecture.yaml`
- `.agents/contracts/transition.yaml`

## Scope

- define the smallest explicit ownership catalog needed by currently supported optional surfaces;
- copy/materialize `template/` as the generation source;
- resolve configuration into retain/remove decisions;
- remove excluded owned files/configuration without knowingly leaving broken imports or routes;
- preserve structured identity/design transforms;
- update generated provenance to describe the one-template model;
- adapt supported `add` behavior only where a safe generator-owned change remains possible without duplicated module source.

## Non-goals

- do not build a third-party plugin architecture;
- do not build an arbitrary upgrade/merge engine;
- do not invent optional surfaces lacking real template implementation;
- do not add new tests or validation systems.

## Likely affected areas

```text
packages/core/src/generator/**
packages/core/src/catalog/**
packages/core/src/modules* or replacement ownership code
packages/core/src/manifest*
packages/core/src/commands/add*
package template inclusion
```

## Acceptance

- `create` derives application source from `template/`;
- generated output reflects normalized configuration through real retain/remove or structured-transform behavior;
- duplicated `templates/modules` source is no longer required for normal creation;
- provenance accurately describes the current template/configuration;
- unsupported `add` behavior is reduced honestly rather than simulated;
- no live external application template is fetched.

## Verification

Use the existing generation/materialization checks that exercise behavior changed by this Issue. Do not create new tests or validators.
