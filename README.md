# Hipster Stack

Hipster Stack turns a bounded project configuration into a complete white-label application. It combines the canonical `hipster-stack` CLI, a stateless visual configurator, reproducible `hipsterstack.json` contracts, and one packaged maximal template—without asking you to redesign the stack.

The canonical end-user guide lives in [`docs/`](docs/index.md) and is rendered by the website under `/docs/*`. Start with [Getting started](docs/getting-started.md), then use the [configuration](docs/concepts/configuration.md) and [CLI](docs/cli/index.md) references as needed.

## Create a project

Node.js 24 is required. Package metadata now targets `hipster-stack`; this repository change does not claim npm publication or name reservation. Run it without installing globally:

```powershell
pnpm dlx hipster-stack@latest create my-product
```

`hipster-stack` is the canonical command:

```powershell
hipster-stack create my-product
```

The interactive flow asks for a starting configuration, real optional surfaces, product identity, and visual direction. For a reproducible non-interactive build:

```powershell
hipster-stack create my-product --config hipsterstack.json --yes
```

Useful create options include `--dry-run`, `--no-git`, `--skip-install`, and `--name <package-name>`.

## Configure generated output

Starting configurations are convenience defaults over one template—not separate application forks.

| Preset                 | Best starting point for                                                             |
| ---------------------- | ----------------------------------------------------------------------------------- |
| `b2b-saas`             | Team products with onboarding, subscriptions, admin, marketing, and a sample domain |
| `client-portal`        | Secure client workspaces with invitations, onboarding, and administration           |
| `platform-marketplace` | Multi-sided products with subscriptions and Stripe Connect payments                 |
| `bare-golden-app`      | The smallest auth, tenancy, RBAC, and governance foundation                         |

Capability prerequisites resolve automatically. Fixed architecture choices—TypeScript, Next.js, Clerk identity, local row-backed authorization, Prisma, server workflows, provider adapters, and validation boundaries—come from the repository-local Hipster Stack master template rather than configuration questions.

## Visual configurator

The responsive configurator in `apps/web` uses the same recipe core as the CLI. It previews representative dashboard, onboarding, settings, billing, detail/workflow, and marketing surfaces, then downloads `hipsterstack.json` or copies the matching CLI command.

It is intentionally stateless: no Hipster Stack account, database, remote build worker, or hosted project infrastructure is involved. To run it locally:

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm --dir apps/web dev
```

## What gets generated

Every project starts from a self-contained Hipster Stack-owned Next.js application and includes:

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

Run these commands inside a generated project with an installed Hipster Stack CLI:

```powershell
hipster-stack explain
hipster-stack doctor
hipster-stack add marketing
hipster-stack add sample-domain
hipster-stack add stripe-connect
```

`explain` summarizes what was generated and what remains. `doctor` diagnoses actionable local/provider readiness without running the entire validation suite. `add` enables three explicitly supported generator-owned surfaces; it is not an arbitrary source upgrade or merge engine.

## Provider handoff

Hipster Stack creates provider-ready integration boundaries and `.env.example`; it does not create accounts, collect secrets, provision infrastructure, migrate production data, or deploy the application.

| Hipster Stack creates                                  | You still configure                                                                               |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| Clerk routes, session helpers, webhook boundary        | Clerk instance, production keys, and webhook destination                                          |
| Prisma schema, migrations, and tenant-safe data access | Neon/database project, pooled runtime URL, direct migration URL, and approved migration execution |
| Stripe billing and optional Connect adapters           | Stripe account, prices, secrets, webhooks, and commercial policy                                  |
| Cloudinary upload, delivery, and webhook adapters      | Cloudinary account, signed-upload credentials, and notification destination                       |
| Hugging Face and Mapbox server adapters                | Provider tokens, model/style choices, quotas, and production usage policy                         |
| Vercel-ready Next.js project                           | Deployment project, environment variables, domains, and production promotion                      |

Start with the generated `.env.example`, run `hipster-stack doctor`, and follow the generated README. Provider-backed journeys and production deployment remain owner-controlled verification gates.

## Package and repository development

The npm package contains the compiled CLI, the complete canonical master template, and local compatibility projections used by existing recipe/add behavior. Generation never fetches an application template from another repository or the network.

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm validate
corepack pnpm release:check
```

`release:check` builds and inspects the tarball, installs that tarball in a clean temporary consumer, and generates a representative B2B SaaS through the packaged `hipster-stack create` executable. It does not publish the package or contact providers.

The canonical product and architecture sources live in [`context/`](context/README.md). Machine contracts and execution evidence live in [`.agents/`](.agents/AGENTS.md).
