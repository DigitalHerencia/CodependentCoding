---
title: Codependent Coding Source Provenance Ledger
type: reference
scope: domain
project: CodependentCoding
domain: provenance
artifact: source-provenance-ledger
kind: reference
namespace: codependentcoding.provenance.source-provenance-ledger.reference
status: active
authority: reference
parent: "[[codependentcoding.provenance.readme.reference]]"
depends_on:
  - "[[codependentcoding.provenance.synthesis-decisions.reference]]"
  - "[[codependentcoding.provenance.conflict-resolution.reference]]"
supersedes: []
tags:
  - codependentcoding/provenance
  - codependentcoding/sources
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: provenance/source-provenance-ledger.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: a0a5a703f9d9983123ad14cd73d3001d52ef883c
source_format: markdown
---
# Source Provenance Ledger

## Controlling source

| Source | Role | Major contributions | Destinations | Disposition |
|---|---|---|---|---|
| Canonical synthesis instruction dated 2026-08-06 | controlling normative | names, hierarchy, source precedence, required domains/artifacts, reconciliation and output rules | entire repository | Adopted |

## Mandatory attached sources processed completely

The remediation pass for `DEF-CRIT-002` re-opened and processed every mandatory attached source available in the session. Processing evidence is the exact filename, newline-counted line total, and full SHA-256 of the bytes read. The 19 files total **38,511 lines** and **798,496 bytes**.

| Source | Lines | SHA-256 | Classified role | Material contributions / destination | Disposition |
|---|---:|---|---|---|---|
| `hipsterstack.patterns.application-workflow.reference.md` | 614 | `a0040bb4b999cfb2ffc52254c3d25b589d66bd42f0d46b58d3aa6585d96de121` | canonical-pattern working note | use-case sequencing, provider/database recovery, idempotency → workflow/lifecycle canon | Adopted/refined; framework effects remain outside workflows |
| `hipsterstack.patterns.fetcher.reference.md` | 866 | `4b8df5988fa2f8adb22811fae7f7234e8dbcdcd81cd2668a6eba07063717c74b` | canonical-pattern working note | self-securing reads, authorization scopes, selects, DTOs, pagination/cache → fetcher/layer canon | Adopted/refined with mandatory RLS transaction helper |
| `hipsterstack.patterns.auth-authz-boundary.reference.md` | 706 | `ab1144bfe7de94ec5acfe486555e1d36d0e04b37aae2812540a53a242ab9f46d` | canonical-pattern working note | Actor, membership, capabilities, resource policy, readiness, RLS → auth/security canon | Adopted; Organization remains the reference tenant noun |
| `hipsterstack.patterns.governance-system.reference.md` | 1157 | `b5b6ecd1e41ec402e84fc8affd6f3dd2d3c8cb6052565b03329b95c44303e075` | canonical-pattern working note | context/contracts/spec/execution separation, source precedence, validation levels → governance | Adopted/refined; synthesis resolves precedence conflicts while execution escalates unresolved authority conflicts |
| `hipsterstack.patterns.catalog.map.md` | 191 | `f80789ac5b3a815d1b8d22e847d05113ad1708491f179c290bd8f60cc83bfdaf` | coverage map | ten core patterns, request paths, ownership → pattern catalog | Expanded to the repository pattern inventory |
| `hipsterstack.patterns.server-action.reference.md` | 473 | `1e36a7857f963b5248f46c332682ae30bf537b7274f80edf0017aeb7d44647af` | canonical-pattern working note | thin action, typed result/error, framework invalidation → action/layer canon | Adopted |
| `hipsterstack.patterns.route-feature-orchestration.reference.md` | 883 | `32996e0933497ded3996f92f9eb838c5ecc4ffb45055a508e9bf58a1322f7d86` | canonical-pattern working note | route/loader/feature/component ownership, Suspense → route/feature canon | Adopted/refined to the repository route/feature contract |
| `hipsterstack.patterns.transaction-helper.reference.md` | 559 | `95c968dd76b5a69fbbd549f1096e1a516019fcb77d7a6b68bb07f3e7079a471c` | canonical-pattern working note | transaction-client-only mechanics, concurrency, audit/outbox → transaction/security canon | Adopted; tenant context is mandatory for protected tenant operations |
| `hipsterstack.patterns.layer-contract.reference.md` | 900 | `4120b707edf84b45416c5a47d16bb97ab537e89a5b9f2240a3d25ea4a56a0937` | canonical-pattern working note | trust progression, inputs/outputs, side-effect and import contracts → layer specification | Adopted into enforceable matrix |
| `software-development.engineering-practice.descriptive-model.reference(1).md` | 858 | `4bae4d48972182d6a37d3c349ac07986de521cf54c846c9869e8049317d2a257` | active explanatory reference | descriptive/normative distinction, causal practice model, evidence discipline → knowledge definition/doctrine/epistemology | Consolidated |
| `tech-stack.map.md` | 39 | `65cc190f9e076b823cd9c9d6eb4375b85b6ee52af717f83128e08b46c79118fb` | reference index | identifies the `40 TECH STACK` source corpus → source discovery | Reclassified as source-discovery evidence |
| `software-development.system-architecture.terminology.reference(1).md` | 123 | `93c416ab8dc05bcefe5e9038c0b62d0181480b899ea49f17254f37f6b31bd878` | active terminology reference | system/data/behavior/security/governance vocabulary → terminology | Adopted and expanded/deconflicted |
| `hipsterstack.patterns.webhook-processor.reference.md` | 909 | `1eeaa764056dc7b9c140549e681f38777a3e045d55d9df3833701fee9f6da8b2` | canonical-pattern working note | durable inbox, lease claiming, token finalization, provider reconciliation → webhook/security canon | Adopted; unrestricted raw-payload retention tightened |
| `hipsterstack.engineering-system.definition.source-document(1).md` | 467 | `86e0eac2bc4f3e2b7310b00328e218de1f1cfa21275646db7d7b0d7fb55c5a0c` | integrative working source | stack, topology, layers, authz, providers, validation, governance → architecture/tech/security | Consolidated; identity/order superseded by controlling hierarchy |
| `web-development.knowledge-modeling.ontology-taxonomy.reference(1).md` | 602 | `32fa8d2ea98fab05352e5b81358d8fac2a76a35bb506d33b36d50b015913f7db` | active explanatory reference | ontology/taxonomy and adjacent knowledge-model concepts → knowledge modeling/terminology | Adopted/refined for repository roles |
| `hipsterstack.patterns.system-lifecycle.reference.md` | 1008 | `3f91b5eb5e58bc96cb0b7510160608ee96721e97695b2cedd2af8a7b0610be30` | canonical-pattern working note | lifecycle grammar, transitions, concurrency/recovery/audit/release → lifecycle canon | Adopted; runtime lifecycle completeness remains tracked by #10 |
| `vouch.complete-system-documentation.md` | 24851 | `feb8ba9daf822ae81fe092cd5c97bb1a405cca14db53876f4e325c1f69f4bac1` | high-authority Vouch consolidated reference / implementation evidence | §§0–0.12 authority/truth ownership/runtime architecture/layer/security/validation plus product, lifecycle, persistence, provider and test evidence → architecture/security/lifecycle/reference evidence | Processed in full. Generic boundary evidence adopted where consistent; Vouch-only routes, merchant/customer roles, confirmation protocol and settlement rules remain product-specific and do not redefine generic canon |
| `Codependent-Coding-Knowledge-System.txt` | 1486 | `87a50d1f5678bfcc084c98751ee24e61988bb3b151c3603e513ba4c63e44d13d` | high-authority knowledge-system specification | §§0–14 require ontology, epistemology, terminology, taxonomy, typology, nomenclature, semantics, mereology, topology, axiology, methodology, schemas/constraints/validation, pattern contracts, provenance/completeness → corresponding canonical owners | Processed in full. Coverage requirements adopted. Its formal-completeness requirements substantiate open defects #9–#13 and are not falsely marked complete by this reconciliation |
| `How-I-Build-Opinionated-SaaS-Applications.txt` | 1819 | `562b7f59e35b9b30cdef852b3fc813b9349e99742489abc1ca73a7ed5500cd1d` | high-authority first-person doctrine | architecture overview; route/feature orchestration; Clerk/local identity; RBAC/RLS; fetchers/actions/workflows; schemas/selects/DTOs/transactions/integrations/webhooks; data/components/config/testing/CI/governance/security → doctrine/architecture/security/pattern owners | Processed in full. Core doctrine adopted; places where the older narrative lets workflows own framework effects or treats RLS more conditionally are refined by the later canonical pattern and controlling repository contracts |

## Reconciliation decisions for the three formerly unavailable sources

### `How-I-Build-Opinionated-SaaS-Applications.txt`

Material claims are consistent with the repository's central grammar: domain systems with explicit trust boundaries; Clerk identity separated from local application identity; capability/resource/workflow authorization; protected reads through fetchers; thin Server Actions; transaction helpers; provider adapters; durable idempotent webhooks; DTO isolation; layered validation; and agent governance.

Two material wording differences were resolved by authority and recency rather than copied literally:

1. The older workflow narrative includes `revalidate or redirect` inside the workflow sequence. The later Golden Server Action, Golden Application Workflow, Golden Layer Contract, and current repository architecture explicitly keep `next/cache`, `next/navigation`, redirects, and framework invalidation at the action/route boundary. The later narrower contract controls.
2. The first-person source describes RLS as used where tenant isolation requires defense in depth. The controlling tenant/database contract requires RLS for protected tenant tables in the Loaded Vibes™ reference implementation. The stronger controlling reference rule controls without converting RLS into product authorization.

### `Codependent-Coding-Knowledge-System.txt`

The source does not merely request topic presence. It requires formal entities, relationships, cardinalities, states, constraints, enforcement mapping, evidence classes, controlled terminology, classification criteria, recurring types, naming, semantics, part-whole and dependency topology, values/methodology, machine validation, complete pattern fields, and claim-level provenance/completeness.

Those requirements were adopted as normative coverage requirements. They also prove that existing broad summaries are insufficient in several areas. This source reconciliation therefore **unblocks** the source-dependent work in #9, #10, #11, #12, and #13; it does not pre-close those defects.

### `vouch.complete-system-documentation.md`

The source's own authority model makes the Vouch Source of Truth authoritative for Vouch product behavior and keeps taxonomies/matrices/prompts subordinate. Its generic evidence strongly supports the current separation of provider truth, workflow truth, authentication truth, read/write/webhook paths, immutable lifecycle semantics, idempotency, provider retrieval/reconciliation, minimal selects/DTOs, and validation gates.

Vouch-specific product rules are deliberately not generalized. Merchant/customer participant roles, bilateral confirmation codes, Vouch lifecycle values, settlement rules, exact Vouch routes, and payment behavior remain reference-implementation evidence only. Where older Vouch diagrams place authorization or framework effects directly in Server Actions/domain services, the later Hipster Stack canonical patterns and current controlling architecture define the generic owner split.

## Connected GitHub sources

| Source | Role | Contributions | Destination/disposition |
|---|---|---|---|
| `DigitalHerencia/DevNotes:10 PROJECTS/CodependentCoding/codependentcoding.project.source-document.md` | active project source of truth | prior spec-driven agent system and `.agents` model | Agent/governance model; project ordering superseded by current identity |
| `…/codependentcoding.project.map.md` | project map | supporting-material inventory and relationship | Provenance/reference relationship |
| `…/LoadedVibes/loadedvibes.project.source-document.md` | active project source of truth | deterministic generator baseline and Codependent Coding relationship | Architecture/reference relation; generator framing separated from architecture identity |
| `…/LoadedVibes/loadedvibes.project.map.md` | project map | upstream/downstream relationships | System map; consolidated |
| `…/LoadedVibes/loadedvibes.generator-roadmap.execution.md` | operational working note | generation variability, validation and support-envelope concerns | Governance/reference evidence only |
| `…/LoadedVibes/loadedvibes.vibes-template.audit.research.md` | implementation research | template status, risk and evolution evidence | Reference implementation evidence |
| `…/Vouch/vouch.source-of-truth.legacy.md` | legacy complete product source | route/layer/provider/lifecycle/validation evidence | Treated as implementation evidence; Vouch-specific doctrine rejected from generic canon |
| `…/Vouch/00 PROJECT MAP/vouch.project.map.md` | active map | Vouch artifact topology | Source discovery evidence |
| `DigitalHerencia/CodependentCoding:README.md` at legacy `main` | historical implementation | prior transcript application identity and stack | Superseded historical implementation evidence |

## Source availability disposition

The prior statement that `vouch.complete-system-documentation.md`, `Codependent-Coding-Knowledge-System.txt`, and `How-I-Build-Opinionated-SaaS-Applications.txt` were unavailable is historical evidence only. During `DEF-CRIT-002` remediation on 2026-08-07, all three became available as session attachments, were read from beginning to end, fingerprinted above, reconciled, and traced to their canonical destinations.

No mandatory attached source remains unprocessed in this remediation corpus. Separate completeness, provenance-granularity, contract, lifecycle, pattern, validation, and independent-verification defects remain governed by their own open Issues and must not be inferred closed from source availability alone.
