# Technical Requirements

# 1. Runtime and Framework

| **Area**        | **Requirement**                                                                                                     |
|-----------------|---------------------------------------------------------------------------------------------------------------------|
| Framework       | Next.js App Router.                                                                                                 |
| Language        | TypeScript with strict typing appropriate to the existing project.                                                  |
| Rendering       | React Server Components by default; Client Components only where browser state/interactivity requires them.         |
| Package manager | pnpm, using the repository-owned lockfile and workspace configuration where still applicable.                       |
| Deployment      | Vercel-compatible Next.js deployment.                                                                               |
| Content         | Repository-owned Markdown and structured TypeScript/JSON data.                                                      |
| Styling         | Existing CSS/token system and shadcn/ui-compatible primitives.                                                      |
| Testing         | Vitest plus focused architecture/contract checks; browser/E2E coverage for critical interactive flows when present. |

# 2. Repository Shape

The current working topology places the Next.js application at repository root. The implementation MUST treat root app/, components/, features/, lib/, content/, public/, and tests/configuration as the primary web application structure. Existing packages or agent/plugin material may remain during migration, but the web app MUST NOT depend on accidental duplicate copies as competing authorities.

```text
/
├─ app/ # routes and route shells
├─ components/
│ ├─ ui/ # UI primitives
│ ├─ blocks/ # PureUI Blocks
│ └─ templates/ # presentation templates where retained
├─ features/ # route/domain orchestration
├─ lib/ # shared server/client-safe utilities and domain access
├─ content/ # canonical rendered documentation/content
├─ public/ # logos, wordmarks, banners, backgrounds, static assets
├─ context/ # implementation context/specification inputs
├─ tests/ # verification
└─ configuration files
```

# 3. Route Requirements

| **Route family**               | **Purpose**                                             |
|--------------------------------|---------------------------------------------------------|
| /                              | Umbrella landing page.                                  |
| /ontologies                    | Normalized Ontology catalog.                            |
| /ontologies/\[slug\]           | Ontology detail.                                        |
| /simples                       | Simples catalog.                                        |
| /simples/\[slug\]              | Simple detail.                                          |
| /anthimeria                    | Visual configuration workbench.                         |
| /maximal-template              | Maximal Template/domain library surface.                |
| /typescripture/\[\[...slug\]\] | Canonical doctrine/documentation.                       |
| presentation/demo routes       | Real PureUI and template demonstrations where retained. |

# 4. Layering Contract

```text
Route
↓
Feature
├─ PureUI Blocks / UI Primitives
└─ BusinessLogic Workflow
├─ Fetchers / reads
├─ Actions / writes
├─ Authorization
├─ Schemas / types
├─ Integrations
└─ Transaction / invariant helpers
```
- Routes adapt URL/request state and remain thin.
- Features orchestrate user-facing use cases and bind presentation to business behavior.
- PureUI Blocks remain presentation-focused.
- BusinessLogic Workflows own application/business orchestration.
- Server-only behavior must remain server-only.
- Database access, authorization, secrets, and provider credentials must not leak into Client Components.

# 5. Data and Definition Requirements

- Ontology definitions, Simples metadata, and configuration contracts must have a single repository-owned authority per concept.
- Application definitions must be schema-validatable before generation or download.
- Configuration normalization must be deterministic.
- Unsupported combinations must fail explicitly rather than silently falling back.
- Generated definitions must be dependency-closed for the selected supported capability graph.
- Public examples must be safe to expose and contain no credentials or private operational data.

# 6. Content Requirements

- TypeScripture and architecture documentation are rendered from repository-owned content.
- Documentation navigation must derive from stable content metadata or an explicit manifest.
- Code examples preserve formatting and horizontal scrolling.
- External links open safely and are visibly distinguishable from internal navigation.
- Deprecated names may remain temporarily in source material but rendered canonical terminology should prefer current authority.

# 7. Asset Requirements

- All supplied logos, wordmarks, banners, and background artwork are served from public/.
- Do not duplicate public assets into component source directories.
- Use Next.js image handling where it preserves the intended composition; CSS backgrounds are acceptable for bottom-anchored decorative landscapes.
- Decorative images use empty alt text; meaningful logos/identity graphics receive useful accessible labels.
- No implementation should depend on a developer-local absolute path.

# 8. Performance Requirements

- RSC by default to minimize shipped JavaScript.
- Lazy-load heavy interactive/code-viewer surfaces when practical.
- Avoid layout shift from known brand imagery by reserving dimensions/aspect ratio.
- Do not load the entire documentation corpus or all code examples into every route.
- Static or cacheable catalog/detail content should be prerendered when compatible with the source model.

# 9. Accessibility Requirements

- WCAG-oriented semantic structure and keyboard operability.
- Visible focus states.
- Sufficient contrast against \#05030b/black backgrounds.
- Controls expose accessible names and state.
- Tabs, dialogs, sidebars, code viewers, copy buttons, and form fields remain keyboard usable.
- Motion/glow effects must not obscure text or become the only state indicator.

# 10. Validation

- TypeScript typecheck.
- Lint.
- Focused unit tests for normalization/configuration/domain utilities.
- Architecture validation for layer boundaries where repository validators exist.
- Production build.
- Focused browser tests for navigation, workbench state, copy/download behavior, responsive layout, and critical error states.
- No check may be reported as passing unless actually executed.
