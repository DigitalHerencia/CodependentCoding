---
title: Security Baseline
slug: security
order: 10
summary: The threat model, defense in depth, headers and CSP, secrets, uploads, logging, and the reviewer's checklist.
rules:
  [
    CC-SEC-001,
    CC-SEC-002,
    CC-SEC-003,
    CC-SEC-004,
    CC-SEC-005,
    CC-SEC-006,
    CC-SEC-007,
    CC-SEC-008,
  ]
---

# Security Baseline

## Threat model

| Threat                         | Primary control                                                    | Backstop                                      |
| ------------------------------ | ------------------------------------------------------------------ | --------------------------------------------- |
| Cross-tenant read/write (IDOR) | organization in every predicate; IDs validated                     | RLS as `app_runtime`; cross-tenant suite      |
| Privilege escalation           | role from DB membership, never input; insert-only audit            | step-up auth on admin actions                 |
| Unauthenticated action call    | `requireIdentity()` first in every action                          | Clerk proxy gate (UX)                         |
| CSRF on actions                | Next Origin/Host check; POST only                                  | `SameSite=Lax` cookies                        |
| XSS                            | React escaping; no raw HTML; nonce CSP                             | `frame-ancestors 'none'`, `object-src 'none'` |
| Webhook forgery/replay         | raw-body signature; inbox dedupe                                   | lease + provider re-fetch                     |
| Supply-chain worm              | 7-day release age; script allowlist; frozen lockfile; trust policy | Dependabot on a readable lockfile             |
| Secret exposure                | `lib/env` server-only; no `NEXT_PUBLIC_` secrets                   | separate keys per environment                 |
| Data leak via cache            | no `'use cache'` in protected code; SW never caches HTML           | DTO allowlists                                |
| Abuse/cost blowup              | Upstash limits on expensive actions                                | provider spend caps                           |

Each control is written assuming the one beside it has failed.

## Content Security Policy

Two policies, chosen by path in `proxy.ts`, because a nonce exists only on pages rendered at request time:

| Paths                                                                  | Rendering               | Policy                                                                     |
| ---------------------------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------- |
| `(public)` — `/`, `/pricing`, `/faq`, `/terms`, `/privacy`, `/offline` | static (`ensureStatic`) | header policy, `script-src 'self' 'unsafe-inline'`, everything else strict |
| everything else — `(auth)`, `(tenant)`, `(admin)`, `/api`              | dynamic                 | per-request nonce with `'strict-dynamic'`                                  |

```ts
// proxy.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

const isPublic = createRouteMatcher([
  "/",
  "/pricing",
  "/faq",
  "/terms",
  "/privacy",
  "/offline",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);
const isStaticPage = createRouteMatcher([
  "/",
  "/pricing",
  "/faq",
  "/terms",
  "/privacy",
  "/offline",
]);
const clerkFrontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API_URL; // e.g. https://clerk.acme.com

const shared = [
  "default-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "font-src 'self'",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
];

function staticPolicy() {
  return [
    ...shared,
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "connect-src 'self'",
  ].join("; ");
}

function noncePolicy(nonce: string) {
  const dev = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";
  return [
    ...shared,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev}`,
    "style-src 'self' 'unsafe-inline'", // Clerk injects runtime CSS
    "img-src 'self' data: blob: https://img.clerk.com",
    `connect-src 'self' ${clerkFrontendApi} https://*.protect.clerk.com:*`,
    "frame-src https://challenges.cloudflare.com https://*.protect.clerk.com",
  ].join("; ");
}

function withCsp(request: NextRequest) {
  if (isStaticPage(request)) {
    const response = NextResponse.next();
    response.headers.set("Content-Security-Policy", staticPolicy());
    return response;
  }
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const policy = noncePolicy(nonce);
  const headers = new Headers(request.headers);
  headers.set("x-nonce", nonce);
  headers.set("Content-Security-Policy", policy); // Next stamps its own scripts with the nonce it finds here
  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Content-Security-Policy", policy);
  return response;
}

export default clerkMiddleware(async (auth, request) => {
  if (!isPublic(request)) await auth.protect();
  return withCsp(request);
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|avif|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
```

The Clerk hosts are the ones Clerk's CSP guide lists: the Frontend API host, `*.protect.clerk.com` (with `:*` — those hosts use non-443 ports), `img.clerk.com`, and Cloudflare's challenge frame. Provider modules append their hosts (`js.stripe.com`, `res.cloudinary.com`) through the module registry, never by hand-editing this file.

`<ClerkProvider dynamic>` wraps the `(auth)`, `(tenant)` and `(admin)` layouts, not the root layout. The root layout stays static so `(public)` pages can be prerendered, and marketing pages ship no Clerk JavaScript at all; their "Sign in" button is a plain link.

The `'unsafe-inline'` on static pages is the framework's documented requirement for prerendered HTML. Its compensating controls: static pages render no user content and no raw HTML (CC-SEC-002), load no third-party origin, and carry `object-src 'none'`, `base-uri 'none'` and `frame-ancestors 'none'`. When Next's hash-based SRI CSP leaves experimental, static pages move to it (tracked, tier `scale`).

> **CC-SEC-001** · `now` · `scripts/check-headers.mjs` (e2e)
> Every response carries HSTS, `nosniff`, `Referrer-Policy`, `X-Frame-Options: DENY`, `Cross-Origin-Opener-Policy`, `Permissions-Policy` and a CSP with `object-src 'none'`, `base-uri`, `frame-ancestors 'none'`. `X-XSS-Protection` is never sent.

> **CC-SEC-002** · `now` · `codependent/no-dangerous-html`
> No `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`, or `javascript:` URLs. Rich text is rendered from an AST by components (MDX at build, or a sanitizing renderer with an allowlist for user content).

## Secrets

> **CC-SEC-003** · `now` · `codependent/no-process-env`, `scripts/check-env.mjs`
> Secrets are read only through `lib/env`. `.env.example` lists names and descriptions, never values. No secret is logged, returned, or placed in an error message, URL or `NEXT_PUBLIC_` variable.

## Uploads

> **CC-SEC-004** · `now` (when uploads installed) · review
> Uploads go client → signed provider URL directly (Vercel Blob client upload or Cloudinary signed upload); the server issues the token only after authenticate → authorize → validate declared type and size against `lib/constants/limits`. The stored object key includes the organization ID. Served files use `Content-Disposition: attachment` unless they are images rendered through `next/image`.

## Logging and observability

> **CC-SEC-005** · `now` · review
> Logs carry a correlation ID, the boundary, and coded facts. Never tokens, secrets, raw webhook payloads, or full PII (emails masked, no bodies).

`lib/observability/report.ts` is the single hook for error reporting; it returns the correlation ID the user sees as `ref`. The provider (Vercel Observability, Sentry or similar) is a module choice; the function signature does not change.

## Dependency and platform hygiene

> **CC-SEC-006** · `now` · CI
> Dependabot (security updates on, version updates grouped monthly) against a single-document lockfile; `pnpm audit --prod` in CI on lockfile changes.

> **CC-SEC-007** · `now` · Vercel settings
> Deployment Protection on previews; production domain only on `main`; Vercel firewall bot protection on.

> **CC-SEC-008** · `users` · review
> A `SECURITY.md` with a private reporting channel (GitHub private vulnerability reporting) and a response target.

## Reviewer checklist

Run on every PR that touches `lib/`, `app/api`, `prisma/`, `proxy.ts` or env:

- [ ] Every new action authenticates first, parses with a shared schema, asserts a permission inside the tenant transaction.
- [ ] Every tenant query has `organizationId` in its predicate and a `select` from `lib/db/selects`.
- [ ] No organization, user or role arrives from input on a non-admin path.
- [ ] Cross-tenant and missing records return `NOT_FOUND`.
- [ ] New tables have RLS enabled + forced, an indexed policy column, and cross-tenant tests.
- [ ] No provider call inside a transaction; provider writes carry idempotency keys.
- [ ] Webhooks verify the raw body and dedupe by event ID.
- [ ] No `'use cache'` in protected code; no HTML cached by the service worker.
- [ ] No secret in client code, logs, or errors.
- [ ] Client components receive DTOs only.
