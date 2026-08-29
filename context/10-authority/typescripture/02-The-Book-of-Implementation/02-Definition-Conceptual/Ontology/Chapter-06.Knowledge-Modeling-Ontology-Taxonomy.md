---
title: Ontologies, Taxonomies, and Related Knowledge Models in Web Development
type: reference
scope: reference
project:
domain: knowledge-modeling
artifact: ontology-taxonomy
kind: reference
namespace: web-development.knowledge-modeling.ontology-taxonomy.reference
status: active
authority: reference
parent: "[[devnotes.tech-stack.map]]"
depends_on: []
supersedes: []
tags:
  - web-development
  - software-architecture
  - domain-modeling
  - information-architecture
  - knowledge-modeling
  - status/active
created: 2026-08-04
updated: 2026-08-04
---

# Ontologies, Taxonomies, and Related Knowledge Models in Web Development

## Core distinction

A **taxonomy** classifies things into categories.

An **ontology** defines what things exist in a domain, what they mean, and how they relate.

> [!summary]
> **Taxonomy asks:** How should these things be classified?
>
> **Ontology asks:** What exists here, what does it mean, and how is it related?

A taxonomy may be part of an ontology, but the terms are not interchangeable.

## Taxonomy

A taxonomy is a controlled classification system. It usually establishes:

- categories
- classification criteria
- parent-child relationships
- category boundaries
- naming conventions
- assignment rules

Example page taxonomy:

```text
Page
├── Marketing Page
│   ├── Landing Page
│   ├── Pricing Page
│   └── FAQ Page
├── Application Page
│   ├── Dashboard
│   ├── Settings
│   └── Admin Page
└── System Page
    ├── Sign In
    ├── Error Page
    └── Maintenance Page
```

Common web-development taxonomies include:

- page taxonomies
- component taxonomies
- content taxonomies
- permission taxonomies
- event taxonomies
- error taxonomies
- documentation taxonomies

A list is not automatically a taxonomy. A useful taxonomy explains why its categories exist and how an item is assigned to them.

## Ontology

An ontology is an explicit conceptual model of a domain. It may define:

- entities
- concepts
- properties
- relationships
- constraints
- equivalences
- distinctions
- lifecycle rules

Example SaaS ontology:

```text
User
Organization
Membership
Role
Permission
Subscription
Plan
Entitlement
Feature
Workspace
Project
```

Example relationships:

```text
User → holds → Membership
Membership → belongs to → Organization
Membership → receives → Role
Role → grants → Permission
Organization → owns → Subscription
Subscription → references → Plan
Plan → includes → Entitlement
Entitlement → enables → Feature
```

The ontology prevents implementation details from accidentally defining the domain.

## Ontology versus database schema

A database schema describes how data is stored. An ontology describes how the domain is understood.

| Concern | Ontology | Database schema |
|---|---:|---:|
| Defines domain concepts | Yes | Indirectly |
| Defines conceptual meaning | Yes | Usually weakly |
| Defines tables and columns | No | Yes |
| Defines storage types | No | Yes |
| Can include non-persisted concepts | Yes | Usually no |
| Defines relationships | Conceptually | Structurally |
| Optimized for human understanding | Yes | Not necessarily |
| Optimized for query execution | No | Yes |

A database representation may compress several domain concepts into one structure. The ontology should preserve distinctions that matter to product behavior, authorization, ownership, or policy.

## Ontology versus type system

A type system describes valid shapes and operations in code. An ontology explains what those shapes represent.

```ts
type Membership = {
  userId: string;
  organizationId: string;
  roleId: string;
};
```

The type does not explain:

- whether a user may hold multiple memberships
- whether memberships can be suspended
- whether roles are tenant-specific
- whether permissions are inherited
- whether an organization must retain an owner
- whether billing authority differs from application authority

Those are domain and ontological questions.

## Where these models appear in web development

### Domain modeling

Domain models are often practical, implementation-oriented ontologies. They define entities, value objects, aggregates, relationships, invariants, lifecycle states, domain events, and business terminology.

In Domain-Driven Design, the ubiquitous language is closely related to ontology work. The goal is for the same words to carry the same meaning across product discussions, documentation, interfaces, code, database models, analytics, and operations.

### API design

An API encodes assumptions about the domain.

```text
POST /users/:userId/make-admin
POST /organizations/:organizationId/memberships/:membershipId/roles
```

The first route implies that administrator is a global property of a user. The second implies that authority is assigned through a membership within an organization. Those represent different ontologies, not merely different URL styles.

### Authorization

RBAC, ABAC, ReBAC, and entitlement systems depend on clear definitions of:

- subject
- actor
- principal
- resource
- action
- role
- permission
- policy
- scope
- tenant
- ownership
- delegation
- entitlement

Weak ontology produces authorization defects because the application cannot reliably determine who is acting, within which tenant, through which relationship, against which resource, and under which policy.

### Search and content discovery

Taxonomies and ontologies improve:

- faceted filtering
- query expansion
- synonym handling
- related-content discovery
- semantic retrieval
- result ranking
- metadata consistency

### AI and retrieval-augmented generation

Ontologies can provide AI systems with:

- canonical entity definitions
- known relationships
- domain constraints
- retrieval metadata
- disambiguation rules
- validation targets
- knowledge-graph edges

This helps distinguish concepts that are superficially similar but operationally different, such as a commercial plan, a Stripe Price, a feature, an entitlement, a role, and a permission.

## Related “-ies” and adjacent concepts

### Terminology

Terminology is the controlled set of words used to describe a domain.

It answers: **What words do we use?**

Ontology answers: **What do those words represent?**

A glossary is a common implementation of controlled terminology.

### Typology

A typology groups things into recurring types based on shared characteristics. It is often less strictly hierarchical than a taxonomy.

Example page typology:

| Page type | Primary purpose |
|---|---|
| Landing | Persuasion |
| Listing | Discovery |
| Detail | Evaluation |
| Dashboard | Monitoring |
| Workflow | Task completion |
| Settings | Configuration |
| Checkout | Transaction completion |

### Topology

Topology describes how parts of a system are arranged and connected.

Common uses include:

- network topology
- deployment topology
- service topology
- application topology
- repository topology
- tenant topology

```text
Browser
   ↓
Vercel Edge Network
   ↓
Next.js Application
   ├── Clerk
   ├── Stripe
   ├── Neon Postgres
   └── Observability Provider
```

Typology asks what types exist. Topology asks how the parts connect.

### Epistemology

Epistemology concerns how knowledge is obtained, justified, and trusted.

In a software system, it appears as source-of-truth decisions:

```text
Clerk is authoritative for identity.
The application database is authoritative for tenant membership.
Stripe is authoritative for payment settlement.
The application is authoritative for entitlement interpretation.
```

Many apparent data-consistency problems are unresolved questions of authority and provenance.

### Mereology

Mereology concerns part-whole relationships.

It applies to:

- component composition
- product bundles
- organizations and workspaces
- documents and sections
- orders and line items
- projects and tasks
- features and subfeatures

These distinctions affect ownership, aggregate boundaries, cascading deletion, normalization, and lifecycle management.

### Nomenclature

Nomenclature is a formal naming system for concrete artifacts such as routes, files, components, events, tables, permissions, feature flags, environment variables, and error codes.

Terminology defines the concepts and approved words. Nomenclature defines how implementations are named.

### Semantics

Semantics concerns meaning encoded in a structure.

For example:

```html
<button>Save</button>
```

is semantically different from:

```html
<div onclick="save()">Save</div>
```

They may appear similar, but only one accurately communicates the element's role to browsers, assistive technology, testing tools, and maintainers.

### Information architecture

Information architecture concerns how information is organized, labeled, navigated, searched, and discovered. It commonly uses taxonomies, navigation systems, labeling systems, metadata, and user mental models.

A taxonomy supports an information architecture but is not the entire architecture.

### Content model

A content model defines structured content types and their fields.

```text
Article
├── Title
├── Slug
├── Summary
├── Body
├── Author
├── Topics
├── Publication Status
└── Published At
```

The content model defines structure. The ontology defines what Article, Author, Topic, and Publication Status mean and how they relate.

### Domain model

A domain model represents business concepts and rules in software. For application engineering, it is usually the most practical form of ontology work.

### Schema

A schema defines the permitted structure of information.

Examples include:

- database schema
- JSON Schema
- GraphQL schema
- Zod schema
- Prisma schema
- event schema

A schema asks what shape is valid. An ontology asks what that shape means. A taxonomy asks which category it belongs to.

### Metadata

Metadata is data that describes other data, such as title, category, tags, author, status, visibility, locale, version, and timestamps.

Taxonomies are often represented through metadata fields.

### Folksonomy

A folksonomy is an organic classification system created by users through free-form tags or labels.

A taxonomy is controlled. A folksonomy emerges. Folksonomies are flexible but tend to produce synonyms, misspellings, duplicates, ambiguity, and inconsistent granularity.

### Faceted classification

Faceted classification organizes an item across multiple independent dimensions rather than forcing it into one hierarchy.

```yaml
name: SubscriptionManagementPanel
layer: feature
domain: billing
surface: settings
interaction: form
scope: organization
authorization: billing.manage
```

Facets are often more useful than a single tree because a software artifact can legitimately belong to several dimensions at once.

### Controlled vocabulary

A controlled vocabulary is an approved set of values for a field or concept.

```yaml
subscriptionStatus:
  - trialing
  - active
  - past_due
  - canceled
  - unpaid
```

Controlled vocabularies often become enums, validation schemas, database constraints, CMS options, or configuration.

### Knowledge graph

A knowledge graph stores entities and relationships as graph data.

```text
[User] --member_of--> [Organization]
[Organization] --subscribes_to--> [Plan]
[Plan] --includes--> [Entitlement]
[Entitlement] --enables--> [Feature]
```

An ontology defines the conceptual rules. A knowledge graph is one possible representation of instances and relationships governed by those rules.

## Practical classification stack

| Layer | Core question |
|---|---|
| Epistemology | How do we know this is true? |
| Ontology | What exists in this domain? |
| Terminology | What do we call it? |
| Taxonomy | How do we classify it? |
| Typology | What recurring types exist? |
| Mereology | What is part of what? |
| Topology | How are the parts connected? |
| Nomenclature | How should artifacts be named? |
| Schema | What structure is valid? |
| Metadata | How is an instance described? |

## Common mistakes

### Calling every list a taxonomy

A list becomes a taxonomy only when it contains meaningful classification rules and category boundaries.

### Treating folder structure as ontology

A directory tree is an implementation topology or organizational convention. It may reflect the ontology, but it does not define the domain by itself.

### Letting providers define the product domain

Stripe, Clerk, Prisma, and other providers expose their own concepts. Those concepts should be translated at system boundaries rather than adopted wholesale as the application's ontology.

### Forcing everything into one hierarchy

Many software concepts are multidimensional. Use facets when categories overlap or represent independent concerns.

### Confusing roles with identities

Administrator is often a contextual role, not a type of person. A user may have different roles in different organizations or scopes.

### Ignoring negative definitions

Good definitions state both what a concept is and what it is not. Negative boundaries are especially useful in architecture documentation.

## Building a useful ontology

Start with domain statements:

```text
A User can belong to multiple Organizations.
A Membership belongs to exactly one User and one Organization.
A Role is assigned to a Membership, not directly to a User.
A Subscription belongs to an Organization.
A Plan describes a commercial offering.
An Entitlement determines whether an Organization may use a Feature.
```

Then identify overloaded words, define relationships, record invariants, and separate conceptual statements from implementation details.

For each important term, ask:

1. Is it an entity, role, state, relationship, or label?
2. Is it global or scoped?
3. Who owns it?
4. What system is authoritative for it?
5. What can it be confused with?
6. What rules must always hold?

## Building a useful taxonomy

For each category, define:

- name
- definition
- inclusion criteria
- exclusion criteria
- examples
- counterexamples
- overlap rules

A category without boundaries will drift over time.

## Application to reusable web architecture

A reusable application architecture may maintain separate but related models:

### Stack ontology

Defines concepts such as Application, Tenant, User, Membership, Role, Permission, Feature, Entitlement, Subscription, Server Operation, Fetcher, Action, Integration Adapter, Presentation Primitive, Feature Component, Page Template, Route, and Validation Gate.

### Architecture taxonomy

Classifies concerns such as Presentation, Application, Domain, Data, Authorization, Integration, Observability, Validation, and Delivery.

### Pattern taxonomy

Classifies Architectural, Data-access, Authorization, Integration, Presentation, Testing, Operational, and Governance patterns.

### Artifact taxonomy

Classifies References, Specifications, Contracts, Templates, Examples, Generator Inputs, Generated Outputs, Validation Rules, and Execution State.

### Repository topology

Describes where those assets live and how they depend on one another.

The distinctions are:

- ontology defines what the artifacts are
- taxonomy classifies them
- topology shows how they connect
- nomenclature determines what they are called
- schemas define their machine-readable structures
- epistemology identifies which artifact is authoritative
- repository structure determines where implementations live

## Fast reference

| Term | Plain-English meaning | Web-development example |
|---|---|---|
| Ontology | What exists and how it relates | User, Membership, Organization, Role |
| Taxonomy | How things are classified | Page types or component layers |
| Typology | Recurring types based on traits | Dashboard, workflow, listing, detail |
| Terminology | Approved domain words | Organization instead of account or team |
| Nomenclature | Formal naming rules | `member.invite`, `billing.manage` |
| Topology | How parts are connected | Browser → Next.js → Neon |
| Epistemology | How truth is established | Stripe owns payment state |
| Mereology | Part-whole relationships | Order and line items |
| Semantics | Meaning encoded in a structure | `<button>` versus clickable `<div>` |
| Schema | Valid data shape | Prisma, Zod, GraphQL, JSON Schema |
| Metadata | Data describing an instance | Type, tags, owner, status |
| Folksonomy | User-created classification | Free-form tags |
| Faceted classification | Multiple classification axes | Layer + domain + surface + scope |
| Information architecture | Organization and discoverability | Navigation, labels, search |
| Domain model | Software representation of business rules | Entities, states, invariants |
| Knowledge graph | Stored entities and relationships | User → member of → Organization |

## Core rule

Do not begin with folders.

Begin by asking:

1. What things exist in this system?
2. What do those things mean?
3. How do they relate?
4. How should they be classified?
5. Where should their implementations live?

```text
Ontology
→ Terminology
→ Taxonomy
→ Architecture
→ Repository topology
→ Implementation
```

Starting with folders reverses the process and allows accidental implementation decisions to define the conceptual model.

## Related notes

- [[devnotes.tech-stack.map]]
- [[obsidian.contracts.naming-standard]]
- [[obsidian.contracts.property-schema]]
- [[obsidian.contracts.note-types]]
