# Docs

The five documents that capture what the owner wants built. They are the human-readable source of intent; everything else (specs, contracts, issues) is derived from them.

| Document                                     | Captures                                                                              |
| -------------------------------------------- | ------------------------------------------------------------------------------------- |
| [PRD.md](PRD.md)                             | Product: problem, users, features, billing, journeys, release plan                    |
| [tech-requirements.md](tech-requirements.md) | Stack, environments, integrations, performance, security, reliability, testing, CI/CD |
| [Architecture.md](Architecture.md)           | Layers, modules, data model, runtime flows, integration boundaries, decisions         |
| [AUTH.md](AUTH.md)                           | Identity, tenancy, roles and permissions, enforcement, RLS, secrets, PII, audit       |
| [Design.md](Design.md)                       | Brand, tokens, components, pages, states, accessibility, SEO, analytics               |

## How they connect to the build

- Every `##` section ends with a **Feeds:** line listing the spec IDs (`ENG-…`) it informs. Each spec in [`../specs/`](../specs/README.md) lists the same sections under `documentation`. `pnpm governance:validate` fails if the two sides disagree, if a section feeds nothing, or if a spec is fed by nothing.
- Section headings are part of the trace (the link is the heading's slug). Rename a heading only together with the specs that reference it.
- `.agents/contracts/*.yaml` are the machine-readable translation of these docs. Update them whenever a doc changes.

## Filling them in

Replace every `TODO:`. If a section does not apply, write `None` or `N/A — reason`; never delete a section. The generator pre-fills what it knows (domain, modules, tenancy, access model, brand color); the Loaded Vibes plugin asks the owner for the rest. `ENG-M1-P1.1-INIT-T02` checks that no `TODO:` remains before the build starts.
