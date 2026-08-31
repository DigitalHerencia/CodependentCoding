# Chapter 23: Tech Stack Map

**The Book of Knowledge™**

## Definition

- Hipster Stack™ is the concrete technology substrate used to realize Loaded Vibes™. Technology serves architectural responsibility; it does not define responsibility.

## Technology ownership

- TypeScript: compile-time contracts, not runtime trust.
- Next.js App Router: route/framework boundaries and framework effects, not domain policy.
- React: rendering/composition, not business truth.
- Neon Postgres: durable application state, constraints, transactions, RLS.
- Prisma: typed approved persistence access, not public DTOs or authorization.
- Clerk: authentication/external identity, not tenant membership/RBAC/billing truth.
- Stripe: provider billing/payment truth, not product entitlement policy.
- Zod: runtime shape validation, not authentication/authorization.
- Vitest/Playwright/ESLint/Prettier: evidence/tooling within their actual scope.
- GitHub/GitHub Actions/Vercel: delivery/review/deployment infrastructure, not application architecture.

## Rule

- A dependency belongs only when it fills a defined capability gap with an owner, boundary, security/operational consequences, validation requirements, and removal/replacement implications. A package is not architecture.
