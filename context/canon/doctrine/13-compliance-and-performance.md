---
title: Compliance and Performance
slug: compliance-and-performance
order: 13
summary: What a solo builder owes users at each tier, and the performance practices that cost nothing until there is traffic to measure.
rules:
  [
    CC-LEGAL-001,
    CC-LEGAL-002,
    CC-LEGAL-003,
    CC-PERF-001,
    CC-PERF-002,
    CC-PERF-003,
  ]
---

# Compliance and Performance

## Tiers

| Tier    | Compliance                                                                                                                                                                                                                | Performance                                                                                                     |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `now`   | Soft delete + anonymize already carries most of the legal substance. No card data is ever touched (Stripe Checkout and Portal). Essential cookies only (Clerk, Vercel).                                                   | `next/image`, streaming with skeletons, Server Components by default, no client data fetching, bounded queries. |
| `users` | Privacy policy and terms that describe the real app (not placeholders). A documented manual process to export or delete a person's data on request. Paid hosting plan (Vercel Hobby is non-commercial).                   | Real-user Core Web Vitals collected.                                                                            |
| `scale` | Compliance review: audit-log retention period, erasure vs. soft delete, GDPR (applies with any EU users), CCPA thresholds, cookie banner only if non-essential cookies or analytics are added, DPA list of subprocessors. | Budgets enforced in CI; Neon plan limits and pooling reviewed.                                                  |

> **CC-LEGAL-001** · `users` · `/ship` checklist
> The generated privacy policy and terms list the app's real operator, contact, processors (Clerk, Neon, Vercel, plus installed modules), data categories and retention, and contain no lorem ipsum or sample legal text.

> **CC-LEGAL-002** · `users` · `/ship` checklist
> An export-or-delete request can be fulfilled in under 30 days by a written procedure: anonymize personal fields, keep audit rows, confirm to the requester.

> **CC-LEGAL-003** · `scale` · review
> Adding analytics or any non-essential cookie requires a consent mechanism before it ships.

## Performance practices

> **CC-PERF-001** · `now` · review
> No client component fetches data; no `useEffect` for data. Interactivity is islands.

> **CC-PERF-002** · `now` · review
> Images use `next/image` with explicit `sizes`. Text is never shipped as an image (logos and wordmarks are SVG).

> **CC-PERF-003** · `scale` · CI
> Budgets once there is traffic: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at p75; route JS ≤ 150 KB gzip for public routes. Turbopack Bundle Analyzer snapshots on dependency PRs.

The factory site is the exception that proves the practices: it is public, static and measurable from day one, so it holds the `scale` budgets now (see the refurbishment plan).
