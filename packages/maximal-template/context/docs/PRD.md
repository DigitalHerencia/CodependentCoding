# Product Requirements Document

> **Status:** Draft · **Owner:** TODO: · **Last updated:** TODO:

What the product is, who it serves, and what the MVP must do. Written in the user's words; no implementation detail.

Fill every `TODO:`. Write `None` or `N/A — reason` when a section does not apply; never delete a section. Each section lists the specs it feeds, so the build process can be traced back to this document.

## Overview

_The product in one paragraph: the problem, who has it, and how this app solves it._

- **Product name:** TODO:
- **One-line pitch:** TODO:
- **Problem:** TODO:
- **Solution:** TODO:

**Feeds:** `ENG-M3-P3.3-DOCS-T01`, `ENG-M3-P3.3-DOCS-T05`

## Users and personas

_Each kind of user, what they need, and which role they map to in AUTH.md._

| Persona | Goal | Pain today | Role (AUTH.md) |
| ------- | ---- | ---------- | -------------- |
| TODO:   |      |            |                |

**Feeds:** `ENG-M1-P1.1-INIT-T02`, `ENG-M1-P1.3-AUTH-T02`

## Goals and non-goals

_Measurable goals for the MVP, and what is explicitly out of scope._

**Goals**

1. TODO:

**Non-goals**

1. TODO:

**Feeds:** `ENG-M1-P1.1-INIT-T02`, `ENG-M2-P2.1-FEATURES-T05`

## Domain and modules

_The template domain chosen at generation, the modules kept, and the core entities in plain language._

- **Domain (ontology):** TODO: (set by the generator)
- **Modules:** TODO: (set by the generator)

| Entity | Description | Owned by (tenant/user) | Key fields |
| ------ | ----------- | ---------------------- | ---------- |
| TODO:  |             |                        |            |

**Feeds:** `ENG-M1-P1.3-DATA-T01`

## Functional requirements

_Every MVP feature. Each row becomes a sub-issue of `ENG-M2-P2.1-FEATURES-T01`. Priority uses MoSCoW._

| #   | Feature | User story                        | Priority | Acceptance criteria |
| --- | ------- | --------------------------------- | -------- | ------------------- |
| F1  | TODO:   | As a ..., I want ..., so that ... | Must     |                     |

**Feeds:** `ENG-M2-P2.1-FEATURES-T01`, `ENG-M2-P2.1-FEATURES-T05`, `ENG-M2-P2.2-VALIDATE-T01`, `ENG-M3-P3.2-REVIEW-T03`

## Key user journeys

_The end-to-end paths that must work at launch. Each becomes an e2e test._

1. **TODO::** step, step, outcome

**Feeds:** `ENG-M1-P1.3-ALPHA-T01`, `ENG-M1-P1.3-ALPHA-T03`, `ENG-M2-P2.1-TEST-T03`

## Billing and monetization

_Plans, prices, trials, limits per plan, and what happens on failed payment. Write `None` if the app is free._

| Plan  | Price | Interval | Limits / entitlements |
| ----- | ----- | -------- | --------------------- |
| TODO: |       |          |                       |

- **Trial:** TODO:
- **Failed payment behavior:** TODO:

**Feeds:** `ENG-M2-P2.1-MVP-T01`

## Notifications and communications

_Every email and in-app notification: trigger, recipient, and whether users can opt out._

| Notification | Trigger | Recipient | Channel | Opt-out |
| ------------ | ------- | --------- | ------- | ------- |
| TODO:        |         |           |         |         |

**Feeds:** `ENG-M2-P2.1-MVP-T03`

## Success metrics

_How launch success is measured, with targets._

| Metric | Target | Source |
| ------ | ------ | ------ |
| TODO:  |        |        |

**Feeds:** `ENG-M2-P2.2-VALIDATE-T05`, `ENG-M3-P3.2-OBS-T02`

## Release plan

_What ships at each milestone. M1 = internal alpha, M2 = MVP launch, M3 = hardening and growth._

| Milestone                      | Scope | Target date |
| ------------------------------ | ----- | ----------- |
| M1 Foundation & Pre-Production | TODO: |             |
| M2 MVP Launch                  | TODO: |             |
| M3 Expansion & Hardening       | TODO: |             |

**Feeds:** `ENG-M1-P1.1-INIT-T05`, `ENG-M1-P1.3-ALPHA-T05`, `ENG-M2-P2.3-CICD-T05`, `ENG-M3-P3.3-DEPLOY-T05`, `ENG-M3-P3.3-UPDATES-T01`, `ENG-M3-P3.3-UPDATES-T05`

## Assumptions, risks and open questions

_Anything unresolved. Every open question must be answered or deferred before `ENG-M1-P1.1-INIT-T05`._

| Type     | Item  | Owner | Status |
| -------- | ----- | ----- | ------ |
| Question | TODO: |       | open   |

**Feeds:** `ENG-M1-P1.1-INIT-T02`, `ENG-M3-P3.3-UPDATES-T04`
