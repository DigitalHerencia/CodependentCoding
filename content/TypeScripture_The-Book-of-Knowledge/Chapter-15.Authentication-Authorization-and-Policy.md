# Chapter 15: Authentication, Authorization, and Policy

**The Book of Knowledge™**

## Authentication

Authentication answers **who is calling?** Clerk owns external identity/session truth. The application's Auth concern wraps the server-side identity/session operations the application actually needs. Clerk is therefore housed under Auth rather than treated as just another generic integration.

## Authorization

Authorization answers **what may this authenticated caller do?** The canonical RBAC vocabulary is:

- **Roles** represent access positions.
- **Permissions** represent allowed capabilities.
- **Resources** are the things being protected.
- **Policies** express and enforce the rules connecting those facts and any required context.

## Authority rules

Protected reads and mutations perform authoritative authorization at their operational boundary. Client-provided user IDs, roles, permissions, organization IDs, prices, customer/account IDs, or provider metadata do not establish authority.

## RLS relationship

RLS is independent database containment for tenant-owned data. It complements Auth/AuthZ; it does not replace them. Protected tenant operations establish the intended transaction-local tenant/identity context and execute under a runtime role that cannot bypass the RLS policy it is supposed to enforce.

## Concern-first placement

Third-party status does not automatically mean `integrations/`. Authentication and persistence are first-class concerns, which is why Clerk belongs under Auth and Neon/Prisma belong under DB/Prisma rather than the generic integration bucket.
