# CC-080: Auth and authorization route slices

Status: approved by owner prompt, 2026-11-18. Issue: #372.
The owner prompt supersedes earlier scope and resolves the prior workflow and profile decisions.

## Acceptance criteria

- Auth owns Clerk identity/sessions and application-owned profile onboarding. Authz owns authorization, tenancy and organizations. Identity/session access belongs to auth; permission/tenant access contracts belong to authz.
- Remove AuthEntryFeature, AuthSplitLayout, replaced access/organization slices and profile/onboarding pages. AuthShell owns the responsive route-group split and navigation slots.
- One browser-safe authWorkflows.ts and one onboardingWorkflows.ts compose route application logic. Server-only provider and database capabilities are injected into the signed webhook workflow; profile reads cross an authenticated Server Action bridge.
- Sign-in and sign-up page routes wrap their named route features in Suspense with authFormSkeleton. Loading/error boundaries and skeletons import blocks directly. Each credential page has one presentation template; forms orchestrate RHF, templates and workflows.
- Copy and UI primitives are imported only by owned blocks. Scoped ESLint rules enforce page/feature/template/block boundaries.
- Mandatory onboarding is a modal rendered before authenticated children. Completion blocks Escape/outside/close dismissal. First name, last name, bio and phone are optional nullable User columns; an explicit profileCompletedAt marks completion even when every field is empty. The edit modal has no supplied placement or trigger in this change.
- Profile reads/writes authenticate the current identity and use identity RLS, independent of organization/invitation state. Verified Clerk identity repairs the initial webhook-delivery race without fabricating local identity data.
- Clerk identity sync uses verified signatures, current provider state, durable event claims/retry tracking, atomic completion and local-profile-safe writes. Auth/authz own their Prisma schema fragments, RLS source and seed fixtures. The additive profile migration is committed as source; no remote migrations or seeds run.
- After source edits, run only lint:fix, format:write, typegen and typecheck. No tests, builds or development servers. Open an Issue-linked PR, resolve CI failures, merge, clean the task branch and synchronize main.

## Documentation and source evidence

- [Clerk Core 3 custom password flows](https://clerk.com/docs/guides/development/custom-flows/authentication/email-password)
- [Clerk current user lookup](https://clerk.com/docs/reference/backend/user/get-user)
- [Clerk webhook delivery guarantees](https://clerk.com/docs/guides/development/webhooks/overview)
- [BoldKit registry](https://boldkit.dev/r/registry.json): OTP, skeleton and loader primitives available; auth/onboarding/error block endpoints unavailable. Existing BoldKit presentation is adapted to application contracts.
- [ESLint import boundaries](https://eslint.org/docs/latest/rules/no-restricted-imports)

Context7 was not available in this session. Official provider documentation was consulted directly. Browser/runtime behavior, tests, builds and database execution remain unverified under the owner's resource limits.
