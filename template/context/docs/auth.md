# Authentication, Authorization, Tenancy, and Demo Access — The Maximal Template™

## 1. Purpose

This document defines the Maximal Template™ identity, access, tenant, RLS, and public-demo boundaries.

## 2. Clerk role

Clerk owns external authentication identity and session truth.

Clerk Organizations are **not enabled** for the canonical template.

Application organization/workspace membership is owned by the local database.

## 3. Sign-in and sign-up

The Clerk authentication example is configured around username/password authentication.

Sign-in and sign-up routes remain publicly reachable as demonstrations of the auth capability.

They are not the admission gate to the rest of the public demo.

## 4. Local application identity

The application database owns the local `User` representation that maps Clerk identity into application state.

It also owns:

- `Organization`;
- `Membership`;
- membership status;
- application role/capability relationships;
- product/resource ownership;
- tenant-scoped workflow state.

Do not treat Clerk metadata as canonical application role or tenant truth.

## 5. Authentication vs authorization

Authentication answers:

> Who is this identity?

Authorization answers:

> What may this identity do to this resource, in this tenant, in this state?

`lib/auth/` owns authentication/session helpers.

`lib/authz/` owns:

- roles;
- permissions/capabilities;
- RBAC;
- ABAC;
- tenant membership;
- ownership/assignment policy;
- resource policy;
- privileged administration policy.

## 6. Public demo access

The public demo is browseable signed out.

Signed-out visitors may inspect seeded/read-only demonstration surfaces including:

- dashboard;
- CRM;
- projects;
- support;
- marketing;
- invoicing;
- social;
- AI;
- portal;
- admin;
- user/settings;
- onboarding examples.

Public browseability never grants write permission.

A page being visible does not imply that its mutations are authorized for an anonymous visitor.

## 7. Protected mutation path

A protected mutation should follow:

```text
browser intent
    ↓
server action / approved HTTP boundary
    ↓
runtime validation
    ↓
Clerk authentication
    ↓
local User
    ↓
Membership / tenant context
    ↓
RBAC / ABAC / resource policy
    ↓
CRUD write / transaction helper
    ↓
RLS containment
```

## 8. Protected read path

Real protected reads should follow:

```text
route/feature
    ↓
fetcher
    ↓
runtime criteria validation
    ↓
authentication/authz as required
    ↓
tenant/resource scope
    ↓
RLS-scoped database read
    ↓
explicit select
    ↓
DTO
```

The public demo may also use explicitly safe seeded/demo read behavior. That exception must remain clearly demo-oriented and must not silently become production authorization policy.

## 9. PostgreSQL RLS

RLS is part of the production security model.

RLS is defense in depth:

- application authz decides whether an operation is legal;
- query/write scope limits application behavior;
- RLS contains tenant rows if application code makes a mistake.

RLS does not replace application authorization.

## 10. Clerk webhook boundary

Canonical route:

```text
app/api/clerk/webhooks/route.ts
```

The HTTP handler owns:

- webhook receipt;
- Clerk/Svix verification;
- payload parsing;
- event interpretation;
- idempotency lifecycle;
- invocation of reusable persistence helpers;
- response.

Canonical subscribed events currently include:

```text
email.created
session.created
session.ended
session.pending
session.removed
session.revoked
user.created
user.deleted
user.updated
```

Provider/auth-specific event interpretation may use helpers under `lib/auth/`.

Reusable multi-write persistence belongs in `lib/db/transactions/`.

Do not allow an auth helper to become an unclassified database service.

## 11. Clerk webhook environment key

The code and `.env.example` must use one canonical secret name.

The current route implementation uses:

```text
CLERK_WEBHOOK_SECRET
```

Governance therefore treats that as the canonical repository name unless the implementation is deliberately changed everywhere in one scoped update.

## 12. Administrative demo routes

Admin routes may be publicly visible in the demo.

The URL must still be explicit:

```text
/admin/users
/admin/records
/admin/audit
```

A route called `/admin/...` does not imply that the caller has admin mutation permission.

Privileged actions remain explicitly authorized.

## 13. Failure semantics

Expected server-side access outcomes should distinguish:

- unauthenticated;
- forbidden;
- not found / intentionally hidden;
- invalid input;
- conflict;
- provider failure.

Do not expose sensitive existence or authorization details across tenant boundaries.

## 14. Secret handling

Never expose:

- Clerk secret keys;
- webhook signing secrets;
- session tokens;
- raw provider payloads containing sensitive data.

Public publishable keys may be present where the provider requires them, but server secrets remain server-only.
