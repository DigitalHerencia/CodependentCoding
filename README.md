# Loaded Vibes

Loaded Vibes turns a few product choices into a recognizable SaaS starting point. It combines an enjoyable CLI, a stateless visual configurator, reproducible `loadedvibes.json` recipes, and one packaged maximal white-label application template—without asking you to redesign the stack.

## Create a project

Node.js 24 is required. Run the package without installing it globally:

```powershell
pnpm dlx create-loaded-vibes@latest create my-product
```

The `create-loaded-vibes my-product` form remains supported for compatibility. If you install the package, the product-oriented executable is also available:

```powershell
loaded-vibes create my-product
```

The interactive flow asks what you are building, which supported capabilities it needs, and how it should look. For a reproducible non-interactive build:

```powershell
loaded-vibes create my-product --config loadedvibes.json --yes
```

Useful create options include `--dry-run`, `--no-git`, `--skip-install`, and `--name <package-name>`.

## Choose a product shape

Presets are strong defaults over one generator—not separate application forks.

| Preset                 | Best starting point for                                                             |
| ---------------------- | ----------------------------------------------------------------------------------- |
| `b2b-saas`             | Team products with onboarding, subscriptions, admin, marketing, and a sample domain |
| `client-portal`        | Secure client workspaces with invitations, onboarding, and administration           |
| `platform-marketplace` | Multi-sided products with subscriptions and Stripe Connect payments                 |
| `bare-golden-app`      | The smallest auth, tenancy, RBAC, and governance foundation                         |

Capability prerequisites resolve automatically. Fixed architecture choices—TypeScript, Next.js, Clerk identity, local row-backed authorization, Prisma, server workflows, provider adapters, and validation boundaries—come from the repository-local Hipster Stack master template rather than configuration questions.

## Visual configurator

The responsive configurator in `apps/web` uses the same recipe core as the CLI. It previews representative dashboard, onboarding, settings, billing, detail/workflow, and marketing surfaces, then downloads `loadedvibes.json` or copies the matching CLI command.

It is intentionally stateless: no Loaded Vibes account, database, remote build worker, or hosted project infrastructure is involved. To run it locally:

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm --dir apps/web dev
```

## What gets generated

Every project starts from a self-contained Loaded Vibes-owned Next.js application and includes:

- Clerk identity with local organization, membership, and RBAC truth;
- Prisma and Neon-ready tenant data boundaries;
- server-first reads, validated Server Actions, workflows, and transactions;
- recipe-gated subscription billing, Stripe Connect, onboarding, admin, marketing, and sample-project surfaces;
- Cloudinary media, Hugging Face inference, and Mapbox location adapters with server-side credential boundaries;
- semantic identity/design personalization;
- `.loadedvibes/manifest.json` provenance for explanation and safe supported additions;
- focused project documentation, environment examples, and validation commands.

Identical supported recipes and template revisions produce equivalent source output.

## After generation

Run these commands inside a generated project with an installed Loaded Vibes CLI:

```powershell
loaded-vibes explain
loaded-vibes doctor
loaded-vibes add marketing
loaded-vibes add sample-domain
loaded-vibes add stripe-connect
```

`explain` summarizes what was generated and what remains. `doctor` diagnoses actionable local/provider readiness without running the entire validation suite. `add` only composes explicitly packaged capability modules; it is not an arbitrary source upgrade or merge engine.

## Provider handoff

Loaded Vibes creates provider-ready integration boundaries and `.env.example`; it does not create accounts, collect secrets, provision infrastructure, migrate production data, or deploy the application.

| Loaded Vibes creates                                   | You still configure                                                                               |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| Clerk routes, session helpers, webhook boundary        | Clerk instance, production keys, and webhook destination                                          |
| Prisma schema, migrations, and tenant-safe data access | Neon/database project, pooled runtime URL, direct migration URL, and approved migration execution |
| Stripe billing and optional Connect adapters           | Stripe account, prices, secrets, webhooks, and commercial policy                                  |
| Cloudinary upload, delivery, and webhook adapters      | Cloudinary account, signed-upload credentials, and notification destination                       |
| Hugging Face and Mapbox server adapters                | Provider tokens, model/style choices, quotas, and production usage policy                          |
| Vercel-ready Next.js project                           | Deployment project, environment variables, domains, and production promotion                      |

Start with the generated `.env.example`, run `loaded-vibes doctor`, and follow the generated README. Provider-backed journeys and production deployment remain owner-controlled verification gates.

## Package and repository development

The npm package contains the compiled CLI, the canonical master template, and local compatibility overlays. Generation never fetches an application template from another repository or the network.

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm validate
corepack pnpm release:check
```

`release:check` builds and inspects the tarball, installs that tarball in a clean temporary consumer, and generates a representative B2B SaaS through the packaged `loaded-vibes create` executable. It does not publish the package or contact providers.

The canonical product and architecture sources live in [`context/`](context/README.md). Machine contracts and execution evidence live in [`.agents/`](.agents/AGENTS.md).
