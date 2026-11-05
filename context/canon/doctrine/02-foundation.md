---
title: Foundation
slug: foundation
order: 2
summary: Toolchain pins, supply-chain controls, repository topology, environments and configuration.
rules:
  [
    CC-CFG-001,
    CC-DEP-001,
    CC-DEP-002,
    CC-DEP-003,
    CC-DEP-004,
    CC-ENV-001,
    CC-ENV-002,
    CC-ENV-003,
    CC-TS-001,
    CC-TS-002,
  ]
---

# Foundation

## Toolchain

| Tool       | Pin                                                                                   | Rule                                                                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node.js    | `24.x`                                                                                | `engines.node`, `.node-version` and the Vercel project setting MUST agree. Vercel supports 24.x (default) and 22.x.                                                  |
| pnpm       | exact, e.g. `pnpm@12.3.4` in `packageManager`                                         | Installed through Corepack (`corepack pnpm install --frozen-lockfile`). Node 24 ships Corepack; Node 26 does not, so revisit at the Node 26 move.                    |
| TypeScript | `typescript@6.0.x`                                                                    | The compiler the editor and typescript-eslint load. TS 7 MAY run beside it as a CI-only fast `tsc`, never as the lint compiler, until typescript-eslint supports it. |
| Next.js    | exact minor, e.g. `16.4.x`                                                            | App Router only.                                                                                                                                                     |
| React      | the version Next pins (19.3)                                                          | React Compiler on (`reactCompiler: true`).                                                                                                                           |
| Tailwind   | `4.x` via `@tailwindcss/postcss`                                                      | No `tailwind.config.js`; tokens live in CSS.                                                                                                                         |
| Prisma     | `7.x` + `@prisma/adapter-neon`                                                        | Generated client in `generated/prisma` (git-ignored).                                                                                                                |
| ESLint     | flat config, `eslint-config-next`, the doctrine plugin, `eslint-config-prettier` last | `--max-warnings=0`.                                                                                                                                                  |
| Prettier   | with `prettier-plugin-tailwindcss`                                                    | Format on save.                                                                                                                                                      |

Every dependency is pinned exactly (no `^`, no `~`). Upgrades are issues, not side effects.

> **CC-TS-001** · `now` · `tsconfig`
> `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `isolatedModules`, `verbatimModuleSyntax` are on.

> **CC-TS-002** · `now` · `@typescript-eslint/no-explicit-any`, `codependent/unknown-at-boundary`
> No `any`. Values that cross a trust boundary are `unknown` until a Zod schema parses them.

## Supply chain

Package-install time is the most exploited moment in the JavaScript ecosystem: a worm needs one compromised maintainer, one fresh publish, and one `postinstall`. Four controls close that path, and they cost nothing.

```yaml
# pnpm-workspace.yaml  (root and template)
minimumReleaseAge: 10080 # 7 days, in minutes. pnpm's default is 1440 (1 day).
minimumReleaseAgeStrict: true # no silent fallback to a younger version
trustPolicy: no-downgrade # refuse a version whose publish trust level dropped
blockExoticSubdeps: true # transitive deps from git/tarball URLs are refused (default)
pmOnFail: ignore # keeps pnpm-lock.yaml single-document (see CC-DEP-004)
allowBuilds: # the only packages allowed to run install scripts
  "@prisma/engines": true
  esbuild: true
  prisma: true
  sharp: true
  unrs-resolver: true
minimumReleaseAgeExclude: [] # each entry needs an issue link in a comment
verifyDepsBeforeRun: error
```

> **CC-DEP-001** · `now` · `doctor`, CI
> `minimumReleaseAge` ≥ 10080 and `trustPolicy: no-downgrade` in every workspace.

> **CC-DEP-002** · `now` · `doctor`
> No `preinstall`, `install` or `postinstall` script in any first-party `package.json`. Code generation runs in `build`/`typecheck` scripts.
> A first-party install hook is exactly the hook class `allowBuilds` exists to contain.

> **CC-DEP-003** · `now` · CI
> CI installs with `--frozen-lockfile`.

> **CC-DEP-004** · `now` · CI (`packages/generator/scripts/check-lockfile.mjs`)
> `pnpm-lock.yaml` MUST be a single YAML document.
> pnpm 12 writes a leading environment document when `packageManager` is set. GitHub's dependency graph reads only the first document, reports zero dependencies, and auto-closes Dependabot alerts. A blind dependency graph is a disabled security control.

## Repository topology

Single repository per app, not a monorepo. The factory repo is the one exception (site, template, CLI, plugin), with the template as a separate pnpm project.

```text
<app>/
├── app/                 routes only (route groups, layouts, pages, route handlers, file conventions)
├── components/          ui · blocks · templates · nav · shells · brand · chart · error-boundary.tsx
├── content/             copy, per slice
├── features/<slice>/    feature components, forms, client islands, skeletons
├── lib/                 auth · authz · cache · constants · db · env · fetchers · actions · workflows · integrations · observability · utils · modules
├── schemas/             Zod, per slice
├── types/               compile-time contracts, per slice
├── prisma/              schema/<owner>.prisma · rls/<owner>.sql · migrations/ · seed.ts
├── generated/prisma/    (git-ignored)
├── public/              static assets, sw.js
├── tests/               unit · integration · e2e, per slice
├── scripts/             doctrine and structure checks that CI runs
├── context/             docs/ (5 intent docs) · specs/ · mockups/
├── .claude/             contracts/ · execution/ · hooks/ · settings.json
├── proxy.ts · next.config.ts · prisma.config.ts · eslint.config.mjs · vitest.config.ts · playwright.config.ts
└── CLAUDE.md            router, ≤ 60 lines
```

Generator machinery (composition, `db:init`, `.env.example` generation, module schema) lives in the factory, never in a generated app.

## Environments

| Environment | Branch | Database                              | Clerk                | Stripe    | Secrets                                                   |
| ----------- | ------ | ------------------------------------- | -------------------- | --------- | --------------------------------------------------------- |
| development | local  | Neon `dev` branch or local Postgres   | development instance | test keys | `.env.local` (git-ignored), pulled with `vercel env pull` |
| preview     | PR     | Neon branch per preview (integration) | development instance | test keys | Vercel _Preview_ scope                                    |
| production  | `main` | Neon `main` branch                    | production instance  | live keys | Vercel _Production_ scope only                            |

> **CC-ENV-001** · `now` · review
> Preview never holds a production credential. Production secrets exist only in the Production scope.

> **CC-ENV-002** · `now` · `codependent/no-process-env`
> Only `lib/env/*.ts` reads `process.env`. Each file is `server-only` and validates its concern with Zod at first access. Public values (`NEXT_PUBLIC_*`) live in `lib/env/public.ts` and are the only env imported by client code.

> **CC-ENV-003** · `now` · startup check
> In production, a missing secret for an installed integration fails startup. Outside production, the integration reports _demo_ mode in `lib/integrations/status.ts`.

```ts
// lib/env/base.ts
import "server-only";
import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.url(), // runtime role, pooled
  CLERK_SECRET_KEY: z.string().startsWith("sk_"),
  CLERK_WEBHOOK_SIGNING_SECRET: z.string().startsWith("whsec_"),
});

let cached: z.infer<typeof schema> | undefined;

/** Validated base environment; throws once, at first use, with the missing names. */
export function baseEnv() {
  cached ??= schema.parse(process.env);
  return cached;
}
```

`DATABASE_URL_UNPOOLED` is read only by `prisma.config.ts` (migrations) and never by application code.

## next.config.ts

```ts
import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  typedRoutes: true,
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: { remotePatterns: [/* narrowest hosts only */] },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

> **CC-CFG-001** · `now` · `scripts/check-next-config.mjs`
> `images.remotePatterns` lists exact hosts; never `images.domains`, never a wildcard host. `serverActions.allowedOrigins` stays empty unless the app sits behind a proxy. `poweredByHeader: false`.

`X-XSS-Protection` is never sent; it is deprecated and harmful in the engines that still honor it. The Content-Security-Policy is built per request in `proxy.ts` (Chapter 10).
