# Chapter 15: Authentication, Authorization, and Policy

**The Book of Implementation™**

## Canonical placement

```text
lib/auth/
  auth.ts        # server-side identity/session helpers over Clerk
  clerk.ts       # Clerk client instantiation/configuration
  redirects.ts   # centralized authentication redirects
  clerkWebhook.ts # optional Clerk-specific webhook helpers when they truly belong to auth

lib/authz/
  permissions.ts
  policies.ts
  resources.ts
  roles.ts

lib/db/tenant.ts # authenticated local membership/access context + tenant/RLS transaction
prisma/          # schema, grants, migrations, RLS policies
proxy.ts         # Clerk/Next request protection
```

## Authentication

Authentication establishes who is calling. Clerk is an external provider, but authentication is important enough to be a first-class architectural concern, so Clerk identity/session code belongs in `lib/auth` rather than the generic integrations directory.

`auth.ts` is the application's server-side identity boundary: authenticate the session, obtain current session context, and obtain the current user/identity information needed by protected operations. `clerk.ts` owns client setup. Redirect behavior stays centralized in `redirects.ts`.

## Authorization

Authorization establishes what an authenticated caller may do. The RBAC vocabulary is straightforward: **roles** represent access positions, **permissions** represent allowed capabilities, **resources** are the protected things, and **policies** express/enforce the rules connecting those facts.

Protected reads and mutations authorize at their operational boundary. RLS is independent database containment for tenant-owned tables; it does not replace application authorization.

## Security rule

Client-provided identity, role, organization, price, customer/account IDs, or provider metadata never establish authority. Tenant-owned database work must execute with the intended tenant context, and the runtime database role must not bypass the RLS protections it is supposed to enforce.
