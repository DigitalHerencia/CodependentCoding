---
title: Describing a Software Engineering Practice
type: reference
scope: reference
project:
domain: engineering-practice
artifact: descriptive-model
kind: reference
namespace: software-development.engineering-practice.descriptive-model.reference
status: active
authority: reference
parent: "[[tech-stack.map]]"
depends_on:
  - "[[web-development.knowledge-modeling.ontology-taxonomy.reference]]"
supersedes: []
tags:
  - software-development
  - engineering-practice
  - engineering-philosophy
  - knowledge-modeling
  - reference
  - status/active
created: 2026-08-05
updated: 2026-08-05
---

# Describing a Software Engineering Practice

## Purpose

This note defines a mental model for accurately, thoroughly, and coherently describing the distinctive way a person, company, team, community, or school of thought develops software.

The subject could be an individual such as Robert C. Martin, an organization such as Google, a public technical educator, a framework community, or any other identifiable engineering tradition.

The goal is not automatically to create governance, agent instructions, coding standards, or repository documentation. The primary goal may instead be explanatory: reconstruct the subject's complete way of understanding, designing, writing, testing, shipping, operating, and changing software.

A successful description should allow a technically capable reader to:

- understand the internal logic of the approach;
- recognize work produced in that tradition;
- explain why its characteristic choices are made;
- predict likely decisions in unfamiliar situations;
- distinguish core principles from incidental habits;
- identify where the approach works well or poorly;
- reproduce the approach without merely copying surface conventions.

## The First Distinction: Description Versus Governance

A description of an engineering practice and a system for governing engineering work are related but different artifacts.

A descriptive artifact asks:

- How does this entity actually think and work?
- What does it consider important?
- How does it interpret a software problem?
- What patterns recur in its code and decisions?
- Why does its work take this particular form?

A governance artifact asks:

- What must contributors do?
- What is prohibited?
- What evidence is required?
- How are violations detected?
- How are exceptions approved?

Governance converts an understood practice into enforceable expectations. It should therefore be derived from a descriptive model rather than confused with it.

## Four Artifact Modes

Engineering literature can be understood through two independent axes:

1. **Descriptive versus normative** — whether the artifact reports how software is developed or argues how it should be developed.
2. **Explanatory versus operational** — whether the artifact explains ideas and reasoning or specifies procedures and execution.

| Mode | Primary question | Typical artifact |
|---|---|---|
| Descriptive and explanatory | What is this way of developing software? | Monograph, technical biography, intellectual history, engineering ethnography |
| Normative and explanatory | How should software be developed, and why? | Philosophy or principles book, architectural argument, programming guide |
| Descriptive and operational | How does this entity actually build and ship software? | Case study, process study, lifecycle map, organizational account |
| Normative and operational | How must software be developed here? | Standard, governance system, contributor contract, agent instructions |

A comprehensive book about an engineering tradition may contain all four modes, but it should label them clearly. It should not silently transform observations into requirements or opinions into facts.

## Appropriate Names for the Deliverable

Depending on tone and scope, a purely explanatory deliverable could be called:

- **How [Entity] Develops Software**
- **A Comprehensive Exposition of [Entity]'s Engineering Practice**
- **A Descriptive Monograph on Software Development Practice**
- **A Study of an Engineering Tradition**
- **An Engineering Philosophy and Practice Reference**
- **A Software Development Practice Model**

If the same body of knowledge is converted into enforceable standards, stronger names become appropriate:

- **Software Engineering Doctrine and Reference System**
- **Engineering Operating Model**
- **Opinionated Application Engineering System**
- **Engineering Governance System**

The name should reveal whether the artifact primarily explains, recommends, or governs.

## The Core Mental Model

A coherent account should show a causal chain rather than present an inventory of disconnected rules.

The central chain is:

**Context and constraints → values → conception of software → reasoning habits → decomposition → architecture → code organization → implementation method → validation → delivery and operation → feedback and evolution**

The strongest description answers not only what the entity does, but why one layer produces the next.

For example:

- The entity operates at enormous scale.
- It therefore values uniformity, automation, reliability, and local reasoning.
- Those values produce centralized tooling and strongly defined interfaces.
- Those interfaces influence module boundaries and review practices.
- Those practices shape the appearance and behavior of the code.

A directory tree, stack list, or style guide cannot supply this causal explanation by itself.

## The Unit of Study

Before describing the practice, define the subject precisely.

An individual, organization, and movement require different treatment.

### Individual

Include:

- technical background;
- major influences;
- important projects;
- technologies and eras in which the person worked;
- intended audience;
- changes in the person's thinking over time;
- differences between stated advice and observed implementation.

### Organization

Include:

- product types;
- business and operational constraints;
- scale;
- risk profile;
- team structure;
- release environment;
- expected system lifetime;
- formal standards;
- informal cultural practices;
- differences among teams.

### Community or school of thought

Include:

- founding figures and influences;
- shared concepts;
- areas of agreement;
- internal disagreements;
- canonical texts and examples;
- boundaries separating the movement from adjacent traditions;
- historical development.

The work should never imply that a large organization or broad community has one perfectly uniform mind.

## Evidence and Source Discipline

A rigorous descriptive account distinguishes three categories of evidence:

1. **What the entity says it does** — books, talks, interviews, articles, and public statements.
2. **What its formal materials prescribe** — style guides, standards, design documents, review policies, and tooling rules.
3. **What its work demonstrates** — repositories, code changes, tests, architecture, incidents, and shipped systems.

These categories may disagree.

A credible account should preserve the disagreement instead of silently harmonizing the sources. It should identify:

- direct claims;
- observed practices;
- inferred principles;
- historical practices;
- current practices;
- unresolved ambiguity;
- contradictions and exceptions.

Useful source classes include:

- books and essays;
- conference talks and lectures;
- interviews and recorded development sessions;
- source repositories and commit history;
- code review discussions;
- style guides and engineering handbooks;
- architecture documents;
- issue trackers and postmortems;
- tools, generators, linters, and build systems;
- representative production systems.

A source bibliography alone is insufficient. The account must explain what each source supports and how reliable it is for the claim being made.

## Recommended Book-Length Structure

## Part I — Subject and Context

### 1. Identity and boundaries

Define exactly whose practice is being described, during what period, and for what kinds of systems.

State:

- the unit of study;
- the relevant time period;
- included and excluded work;
- variation inside the subject;
- the difference between public teaching and actual practice.

### 2. Historical and technical context

Explain the conditions that shaped the approach:

- available languages and platforms;
- organizational scale;
- product and business constraints;
- reliability requirements;
- team composition;
- prevailing industry ideas;
- important failures or successes;
- technological changes.

Practices must be understood as responses to conditions. A method developed for global distributed infrastructure cannot be evaluated as though it were designed for a small marketing site.

### 3. Sources and method

Explain how the account was reconstructed and how conflicting evidence is handled.

## Part II — Worldview and First Principles

### 4. Conception of software

Determine what software fundamentally appears to be within this tradition.

Possible conceptions include:

- a model of a business domain;
- a machine for transforming data;
- a network of messages and state transitions;
- a collection of independently deployable services;
- a set of user experiences;
- an executable specification;
- a socio-technical system;
- a set of policies separated from mechanisms;
- a continuously evolving product shaped by feedback.

This conception is deeper than any specific framework or coding rule. It explains why the rest of the method exists.

### 5. Values and optimization priorities

Identify what the subject optimizes for:

- correctness;
- simplicity;
- development speed;
- maintainability;
- replaceability;
- performance;
- reliability;
- uniformity;
- autonomy;
- backward compatibility;
- operational control;
- developer experience;
- minimal dependencies;
- rapid experimentation.

Then identify the tensions it must resolve:

- uniformity versus team autonomy;
- abstraction versus directness;
- correctness versus delivery speed;
- flexibility versus comprehensibility;
- performance versus simplicity;
- framework leverage versus framework independence;
- present needs versus anticipated change.

A distinctive engineering style is often defined by how it resolves these tensions.

### 6. Epistemology and decision-making

Describe how the subject determines that an engineering choice is correct.

Questions include:

- Does it trust empirical measurement, formal reasoning, precedent, convention, or expert judgment?
- Does it begin with the domain, interface, database, API, or prototype?
- Are tests primarily proof, design feedback, regression protection, or documentation?
- How much evidence is required before adding complexity?
- Are current requirements favored over anticipated change?
- Are production observations allowed to overrule architectural theory?
- How are disagreements resolved?

This section explains why competent engineers using different traditions can reach different conclusions from the same requirements.

## Part III — From Problem to Design

### 7. Problem discovery and framing

Describe how work begins:

- how requirements are discovered;
- how ambiguous requests are clarified;
- how users and stakeholders are represented;
- how risks are identified;
- how business rules are separated from interface requests;
- what must be known before implementation starts;
- how prototypes, specifications, or experiments are used.

### 8. Decomposition

Explain what units the subject sees when breaking down a problem:

- domains;
- bounded contexts;
- features;
- use cases;
- workflows;
- services;
- components;
- state machines;
- commands and queries;
- data pipelines;
- packages;
- deployment units.

The central question is:

> When this entity looks at an undifferentiated product requirement, what parts does it see, and why?

### 9. Architecture formation

Describe how the broad system shape emerges:

- layers and responsibility boundaries;
- dependency direction;
- runtime boundaries;
- state ownership;
- communication styles;
- synchronous and asynchronous execution;
- framework placement;
- service boundaries;
- integration boundaries;
- trust boundaries;
- failure domains.

The account should connect these choices to the values and constraints already established.

## Part IV — Anatomy of the Code

### 10. Repository and module organization

Describe:

- directory structure;
- package boundaries;
- colocation rules;
- public and private interfaces;
- dependency patterns;
- naming conventions;
- file granularity;
- export style;
- generated code;
- test placement.

Explain the rationale behind each pattern. Organizing by technical layer, domain, feature, or deployment unit reveals different beliefs about ownership and change.

### 11. Coding idiom

Examine what the code characteristically looks like:

- function and module size;
- class usage;
- functional versus object-oriented style;
- mutation versus immutability;
- control flow;
- error representation;
- type usage;
- null handling;
- naming density;
- comments;
- dependency injection;
- declarative versus imperative structure;
- use of generic programming or metaprogramming.

Representative code should be annotated to explain why it is divided, named, typed, and tested in that particular way.

### 12. Abstraction philosophy

Treat abstraction as a distinct topic.

Explain:

- when duplication is tolerated;
- what justifies extraction;
- whether abstractions follow domain meaning or technical behavior;
- when general frameworks are preferred over concrete implementations;
- how stable an idea must be before abstraction;
- how leaky abstractions are recognized;
- how obsolete abstractions are removed.

Many engineering traditions that appear similar at the architectural level differ sharply in abstraction philosophy.

### 13. State and data

Describe the approach to:

- data modeling;
- domain objects;
- schemas;
- identity;
- state machines;
- transactions;
- consistency;
- concurrency;
- time;
- money;
- caching;
- derived state;
- event history;
- provider state;
- serialization;
- migrations.

The central question is:

> What does this entity believe state is, where should it live, who owns it, and who may change it?

### 14. Interfaces and boundaries

Cover:

- function contracts;
- module interfaces;
- public APIs;
- database boundaries;
- UI boundaries;
- provider adapters;
- serialization boundaries;
- trust boundaries;
- internal versus external representations.

This section explains how coupling and authority are controlled.

## Part V — Construction Practice

### 15. The implementation loop

Reconstruct the actual sequence through which code is created.

Common sequences include:

- test → implementation → refactor;
- prototype → observe → restructure → harden;
- schema → contracts → application logic → interface;
- interface → component model → API → persistence;
- use case → policy → workflow → adapters.

The account should identify the subject's real sequence rather than impose a fashionable methodology on it.

### 16. Tools and frameworks

Explain the subject's relationship to tooling:

- whether frameworks are treated as architecture or implementation detail;
- whether dependencies are embraced or minimized;
- whether code generation is accepted;
- whether tools are centrally standardized;
- how build systems, editors, linters, and formatters shape behavior;
- how much work is automated;
- which decisions remain deliberately manual;
- what role AI-assisted development plays.

A tool inventory is not enough. The important subject is how tools participate in the engineering method.

### 17. Testing philosophy

Explain:

- what tests are for;
- when they are written;
- what constitutes a unit;
- what is mocked;
- what must be real;
- how integration is defined;
- whether tests guide design;
- how coverage is interpreted;
- which failures tests are expected to catch;
- how brittle tests are avoided;
- how the test strategy shapes architecture.

### 18. Refactoring and change

Describe how existing systems evolve:

- incremental change versus rewriting;
- characterization tests;
- compatibility strategy;
- migrations;
- feature flags;
- deprecation;
- strangler approaches;
- technical debt;
- cleanup timing;
- code ownership.

A philosophy that explains only greenfield design is not a complete development practice.

## Part VI — Collective Development

### 19. Collaboration and team structure

For organizations and groups, include:

- team topology;
- ownership;
- planning;
- design review;
- code review;
- pairing;
- documentation;
- decision escalation;
- cross-team interfaces;
- mentoring;
- onboarding.

For an individual, describe the collaboration practices they advocate or demonstrate.

Software is created inside a social system, not merely typed by isolated programmers.

### 20. Formal standards and informal culture

Distinguish:

- formally written rules;
- culturally understood conventions;
- automatically enforced constraints;
- reviewer-dependent judgment;
- tolerated deviations;
- exception processes;
- behavior that receives praise or criticism.

The gap between formal rules and lived practice is part of the subject, not noise to be removed.

## Part VII — Delivery and Production

### 21. Integration and release

Describe how unfinished work becomes trusted production software:

- branching and integration;
- code review;
- continuous integration;
- build systems;
- artifact production;
- database migrations;
- deployment;
- staged rollout;
- feature flags;
- rollback;
- release frequency.

### 22. Operations and feedback

Cover:

- observability;
- logs, metrics, and traces;
- alerting;
- incident response;
- postmortems;
- production debugging;
- reliability;
- capacity planning;
- cost management;
- user feedback;
- how production evidence changes design.

A complete account follows software beyond the merge and deployment boundary.

## Part VIII — Limits, Contradictions, and Evolution

### 23. Failure modes and applicability

Explain:

- what kinds of systems the approach suits;
- where it introduces unnecessary complexity;
- what it systematically underemphasizes;
- which assumptions must remain true;
- what breaks at different scales;
- what happens when practitioners copy visible conventions without understanding the underlying reasoning.

Without this section, the artifact becomes advocacy rather than analysis.

### 24. Internal contradictions and disagreements

Real engineering traditions are rarely perfectly coherent.

Examples of productive tensions include:

- simplicity claimed alongside elaborate abstraction;
- framework independence claimed alongside deep framework dependence;
- preference for small modules producing excessive indirection;
- published standards differing from mature production systems;
- individual teachers changing their advice without formally retracting earlier work.

A descriptive account should preserve these contradictions rather than editing the subject into artificial consistency.

### 25. Historical evolution

Describe:

- earlier forms of the approach;
- turning points;
- abandoned ideas;
- changes caused by scale or technology;
- lessons learned from failures;
- unresolved current debates.

Advice from different decades should not be treated as one timeless and internally uniform doctrine.

## Part IX — Demonstration

### 26. Complete worked examples

Principles alone cannot remove practical ambiguity.

Follow representative work through the full lifecycle:

**Requirement → clarification → model → architectural decisions → decomposition → implementation → tests → review → deployment → production feedback → later change**

Useful examples include:

- a small feature;
- a complex workflow;
- a data-intensive operation;
- an external integration;
- a security-sensitive feature;
- a legacy refactor;
- a production failure and recovery.

### 27. Comparative cases

Contrast the subject with another engineering tradition solving the same problem.

For each comparison, identify:

- the two solutions;
- the reasoning behind each;
- what each optimizes;
- what each sacrifices;
- which assumptions produce the difference.

Comparison makes the distinctive character of the subject visible.

## Part X — Synthesis

### 28. The complete practice model

Conclude by restating the causal chain:

**Given these conditions and values, the entity perceives problems this way, divides them this way, constructs systems this way, evaluates them this way, operates them this way, and changes them this way.**

The synthesis should enable prediction, not merely recollection.

A reader should be able to encounter an unfamiliar problem and make a defensible inference about how the subject would approach it.

## Five Dimensions for Every Major Topic

Each major topic should be examined through five dimensions.

| Dimension | Question |
|---|---|
| Descriptive | What does the entity actually do? |
| Normative | What does it argue should be done? |
| Rational | Why does it make that choice? |
| Operational | How is the choice carried out in practice? |
| Evidentiary | What evidence supports the claim? |

These dimensions prevent several common errors:

- mistaking an observation for a requirement;
- reporting a rule without its rationale;
- presenting philosophy without showing implementation;
- treating public claims as sufficient evidence of actual behavior;
- listing tools without explaining their role.

## Explanatory Completeness

Absolute elimination of every possible question is not achievable through prose alone.

Software development includes:

- tacit judgment;
- context-sensitive exceptions;
- undocumented habits;
- contradictions;
- novel situations;
- historical change;
- differences among practitioners;
- decisions the subject has never faced.

The practical target is **explanatory sufficiency**.

A complete knowledge corpus may require:

- explanatory narrative;
- formal definitions;
- decision tables;
- complete examples;
- source code;
- recorded development sessions;
- design discussions;
- review comments;
- historical decisions;
- counterexamples;
- tests;
- production evidence.

The prose supplies the mental model. The supporting corpus resolves behavior where prose becomes insufficient.

## From Description to Reproduction

There are three increasing levels of fidelity:

### Recognition

The reader can identify characteristic vocabulary, code structure, and recurring conventions.

### Prediction

The reader can infer how the subject is likely to approach an unfamiliar problem and explain the reasoning.

### Reproduction

The reader can build software in the same tradition while preserving its values, decision process, boundaries, implementation habits, and validation practices.

Surface imitation reaches recognition. A coherent causal model is required for prediction. Reproduction additionally requires worked examples, source artifacts, and evidence of real execution.

## From Description to Governance

Once the descriptive model is stable, it can be transformed into governance by extracting:

- doctrine — durable beliefs;
- architecture — system boundaries and dependency direction;
- conventions — normal implementation practices;
- patterns — repeatable solutions;
- standards — mandatory requirements;
- decision records — reasons for consequential choices;
- reference implementations — concrete demonstrations;
- enforcement contracts — automated or reviewed constraints;
- checklists and runbooks — repeatable execution procedures;
- conformance criteria — methods for evaluating adherence.

This transformation should be explicit.

A descriptive statement such as “the entity normally places protected reads behind a dedicated boundary” does not become “contributors must use this boundary” until the governance system deliberately adopts it as a standard.

## Relationship to Influential Programming Literature

Several well-known books occupy parts of this territory without attempting to describe every aspect of one complete engineering tradition.

- **Clean Code** emphasizes coding practices, heuristics, readability, and craftsmanship.
- **Clean Architecture** emphasizes policy, boundaries, dependency direction, and architectural independence.
- **The Pragmatic Programmer** presents broad professional habits and framework-independent heuristics.
- **Refactoring** explains systematic behavior-preserving change through principles and a catalog of transformations.
- **Designing Data-Intensive Applications** compares architectural choices and tradeoffs in data systems.

These works are primarily normative and explanatory. They argue for useful ways of thinking and working. A comprehensive descriptive study of a specific entity would be broader because it would combine:

- intellectual biography;
- engineering philosophy;
- architecture;
- programming-style analysis;
- process ethnography;
- code commentary;
- operational case studies;
- historical analysis;
- comparative criticism.

## Compact Evaluation Rubric

A description of an engineering practice is coherent and comprehensive when it can answer all of the following:

### Identity

- Whose practice is being described?
- During what period?
- For which systems and constraints?

### Evidence

- What does the subject claim?
- What do formal materials prescribe?
- What does actual work demonstrate?
- Where do these conflict?

### Worldview

- What does software mean within this tradition?
- What values and tradeoffs dominate?
- How is correctness established?

### Design

- How are problems framed and decomposed?
- How does architecture emerge?
- How are state, authority, and dependencies controlled?

### Code

- What does the code characteristically look like?
- How are modules, abstractions, types, errors, and interfaces handled?

### Practice

- What is the implementation loop?
- How are testing, review, refactoring, and collaboration performed?

### Production

- How is software integrated, deployed, observed, recovered, and improved?

### Criticism

- Where does the approach fail?
- What assumptions does it depend on?
- What contradictions or disagreements exist?
- How has it evolved?

### Demonstration

- Are there complete worked examples?
- Can the reader predict decisions in unfamiliar cases?
- Can the reader distinguish core principles from incidental conventions?

## Final Principle

A comprehensive description of a software engineering practice should not be a pile of rules, technologies, quotations, or code samples.

It should reconstruct a unified system of causation:

> Under these conditions, this entity formed these values; those values shaped its understanding of software; that understanding shaped its decisions, architecture, code, working method, validation, delivery, operation, and evolution.

That causal model is what turns information about an engineering style into genuine understanding.