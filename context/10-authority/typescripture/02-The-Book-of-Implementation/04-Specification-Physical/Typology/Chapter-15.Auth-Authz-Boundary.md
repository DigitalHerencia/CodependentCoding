---
title: Hipster Stack Golden Auth Authz Boundary Pattern
type: reference
scope: domain
project:
domain: hipsterstack
artifact: auth-authz-boundary
kind: reference
namespace: hipsterstack.patterns.auth-authz-boundary.reference
status: review
authority: working-note
parent: "[[hipsterstack.patterns.catalog.map]]"
depends_on:
  - "[[hipsterstack.engineering-system.definition.source-document]]"
supersedes: []
tags:
  - tech-stack/hipsterstack
  - architecture/auth
  - architecture/authz
  - patterns/canonical
  - status/review
created: 2026-08-03
updated: 2026-08-05
---

# Canonical Pattern 005: The Golden Auth/Authz Boundary

Authentication and authorization become muddy when one helper tries to answer every security question.

The canonical model separates five different decisions:

```text
Authentication
  Who is calling?

Tenant membership
  Which organization may they act inside?

Capability RBAC
  What classes of operation may their role perform?

Resource policy
  May they perform this operation on this specific record?

Readiness / workflow invariant
  Is the operation currently possible?
```

PostgreSQL RLS is a sixth, separate containment layer.

## The layers

| Layer | Example question |
|---|---|
| Authentication | Is there a valid Clerk session? |
| Local identity | Which local user corresponds to the Clerk identity? |
| Membership | Is the user an active member of this organization? |
| RBAC capability | Does their membership role grant `invoice.write.all`? |
| Resource policy | Do they own this invoice or have all-scope access? |
| Workflow invariant | Is the invoice currently payable? |
| Readiness | Is Stripe onboarding complete? |
| RLS | Can this database connection access rows outside this tenant? |

Do not rename all of these `auth`.

## Canonical identity models

```prisma
model User {
  id          String     @id @default(cuid())
  clerkUserId String     @unique
  status      UserStatus @default(active)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  memberships Membership[]
}

model Organization {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  memberships Membership[]
}

model Membership {
  id             String           @id @default(cuid())
  organizationId String
  userId         String
  status         MembershipStatus @default(active)
  role           MembershipRole
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Restrict)
  user         User         @relation(fields: [userId], references: [id], onDelete: Restrict)

  @@unique([organizationId, userId])
  @@index([userId, status])
}

enum UserStatus {
  active
  suspended
  disabled
}

enum MembershipStatus {
  active
  invited
  suspended
  revoked
}

enum MembershipRole {
  owner
  admin
  member
  viewer
}
```

This is a static role model. A database-configurable role/permission model can be added later if the product genuinely requires custom roles.

Do not build a permission-management product merely because the word RBAC became exciting.

## The Actor

The actor is trusted server-side identity context.

```ts
// lib/auth/actor.ts

export type Actor =
  | {
      kind: "user";
      userId: string;
      clerkUserId: string;
      status: "active";
    }
  | {
      kind: "system";
      system: "stripe-webhook" | "clerk-webhook" | "cron" | "worker";
      requestId: string;
    };
```

User requests receive a user actor. Webhooks and scheduled jobs receive explicit system actors.

Do not fake provider events as a magic user ID such as `"system:stripe"` inside a user foreign-key column.

## Require the user actor

```ts
// lib/auth/actor.ts

import "server-only";

import { auth } from "@clerk/nextjs/server";
import { cache } from "react";

import { prisma } from "@/lib/db/prisma";
import { ApplicationError } from "@/lib/errors/application-error";

export const requireActor = cache(async (): Promise<Actor> => {
  const session = await auth();

  if (!session.userId) {
    throw new ApplicationError(
      "UNAUTHENTICATED",
      "Sign in to continue.",
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: session.userId,
    },
    select: {
      id: true,
      clerkUserId: true,
      status: true,
    },
  });

  if (!user || user.status !== "active") {
    throw new ApplicationError(
      "UNAUTHENTICATED",
      "Your account is not active.",
    );
  }

  return {
    kind: "user",
    userId: user.id,
    clerkUserId: user.clerkUserId,
    status: "active",
  };
});
```

This performs authentication and local identity resolution.

It does not decide which organization the user may access.

## Membership context

```ts
export interface MembershipContext {
  membershipId: string;
  organizationId: string;
  userId: string;
  role: MembershipRole;
  capabilities: ReadonlySet<Capability>;
}
```

```ts
// lib/authz/membership.ts

export async function requireMembership(input: {
  actor: Actor;
  organizationId: string;
}): Promise<MembershipContext> {
  if (input.actor.kind !== "user") {
    throw new ApplicationError(
      "FORBIDDEN",
      "A user membership is required.",
    );
  }

  const membership = await prisma.membership.findFirst({
    where: {
      organizationId: input.organizationId,
      userId: input.actor.userId,
      status: "active",
    },
    select: {
      id: true,
      organizationId: true,
      userId: true,
      role: true,
    },
  });

  if (!membership) {
    throw new ApplicationError(
      "NOT_FOUND",
      "Organization not found.",
    );
  }

  return {
    membershipId: membership.id,
    organizationId: membership.organizationId,
    userId: membership.userId,
    role: membership.role,
    capabilities: ROLE_CAPABILITIES[membership.role],
  };
}
```

Returning `NOT_FOUND` for inaccessible tenant records can avoid confirming whether another tenant exists.

## Capability vocabulary

Use business capabilities rather than route names or UI component names.

```ts
export type Capability =
  | "project.read.own"
  | "project.read.all"
  | "project.write.own"
  | "project.write.all"
  | "invoice.read.own"
  | "invoice.read.all"
  | "invoice.write.own"
  | "invoice.write.all"
  | "membership.manage"
  | "billing.manage"
  | "organization.manage";
```

```ts
export const ROLE_CAPABILITIES: Record<
  MembershipRole,
  ReadonlySet<Capability>
> = {
  owner: new Set([
    "project.read.all",
    "project.write.all",
    "invoice.read.all",
    "invoice.write.all",
    "membership.manage",
    "billing.manage",
    "organization.manage",
  ]),
  admin: new Set([
    "project.read.all",
    "project.write.all",
    "invoice.read.all",
    "invoice.write.all",
    "membership.manage",
  ]),
  member: new Set([
    "project.read.own",
    "project.write.own",
    "invoice.read.own",
  ]),
  viewer: new Set([
    "project.read.own",
    "invoice.read.own",
  ]),
};
```

A role is a bundle. A capability is the operation vocabulary.

## Pure capability check

```ts
export function hasCapability(
  membership: MembershipContext,
  capability: Capability,
): boolean {
  return membership.capabilities.has(capability);
}

export function requireCapability(
  membership: MembershipContext,
  capability: Capability,
): void {
  if (!hasCapability(membership, capability)) {
    throw new ApplicationError(
      "FORBIDDEN",
      "You do not have permission to perform this operation.",
    );
  }
}
```

This layer is pure.

## Read scope

Protected reads should derive a legal query scope.

```ts
export type ProjectReadScope =
  | {
      kind: "organization";
      organizationId: string;
    }
  | {
      kind: "owned";
      organizationId: string;
      ownerUserId: string;
    };
```

```ts
export async function requireProjectReadScope(input: {
  actor: Actor;
  organizationId: string;
}): Promise<ProjectReadScope> {
  const membership = await requireMembership(input);

  if (hasCapability(membership, "project.read.all")) {
    return {
      kind: "organization",
      organizationId: membership.organizationId,
    };
  }

  if (hasCapability(membership, "project.read.own")) {
    return {
      kind: "owned",
      organizationId: membership.organizationId,
      ownerUserId: membership.userId,
    };
  }

  throw new ApplicationError(
    "FORBIDDEN",
    "Project access denied.",
  );
}
```

The fetcher embeds this scope in the Prisma `where` clause.

## Resource policy

A write policy uses actor, membership, resource facts, and operation.

```ts
interface ProjectPolicyResource {
  id: string;
  organizationId: string;
  ownerUserId: string;
  status: "draft" | "active" | "archived";
}

export function requireProjectArchiveAuthorization(input: {
  actor: Actor;
  membership: MembershipContext;
  project: ProjectPolicyResource;
}): void {
  if (input.actor.kind !== "user") {
    throw new ApplicationError(
      "FORBIDDEN",
      "A user actor is required.",
    );
  }

  if (
    input.project.organizationId !== input.membership.organizationId
  ) {
    throw new ApplicationError(
      "NOT_FOUND",
      "Project not found.",
    );
  }

  if (
    hasCapability(input.membership, "project.write.all")
  ) {
    return;
  }

  const canWriteOwn =
    hasCapability(input.membership, "project.write.own") &&
    input.project.ownerUserId === input.actor.userId;

  if (!canWriteOwn) {
    throw new ApplicationError(
      "FORBIDDEN",
      "Project archive access denied.",
    );
  }
}
```

The policy does not query Prisma. The workflow loads the resource and passes the required facts.

## Workflow invariant

Authorization says the actor may attempt the operation.

A workflow invariant says whether the resource can currently transition.

```ts
export function assertProjectArchivable(
  project: ProjectPolicyResource,
): void {
  if (project.status === "archived") {
    throw new ApplicationError(
      "CONFLICT",
      "The project is already archived.",
    );
  }
}
```

Do not mix this into generic RBAC.

## Readiness

Readiness describes provider or operational prerequisites.

```ts
export interface StripeReadiness {
  onboardingComplete: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
}

export function assertStripeBillingReady(
  readiness: StripeReadiness,
): void {
  if (!readiness.onboardingComplete) {
    throw new ApplicationError(
      "CONFLICT",
      "Complete Stripe onboarding first.",
    );
  }

  if (!readiness.chargesEnabled) {
    throw new ApplicationError(
      "CONFLICT",
      "Stripe charges are not enabled.",
    );
  }
}
```

A member may be authorized to issue an invoice while the organization is not operationally ready to accept payment.

Those are different failures.

## Route gating versus authoritative authorization

Routes and layouts may perform coarse checks to avoid rendering inaccessible surfaces.

```text
route/layout:
  may hide or redirect broad UI

fetcher/workflow:
  must perform authoritative authorization
```

Never treat hidden navigation as security.

## System actors

Webhook processors and jobs should receive explicit system authorization policies.

```ts
export function requireStripeWebhookActor(
  actor: Actor,
): asserts actor is Extract<
  Actor,
  { kind: "system"; system: "stripe-webhook" }
> {
  if (
    actor.kind !== "system" ||
    actor.system !== "stripe-webhook"
  ) {
    throw new ApplicationError(
      "FORBIDDEN",
      "Stripe webhook actor required.",
    );
  }
}
```

System actors do not receive user membership capabilities.

Their allowed operations should be narrowly defined by the worker or processor entrypoint.

## RLS relationship

Application authorization remains the source of business decisions.

PostgreSQL RLS becomes a containment layer:

```text
Application authz:
  decides intended access

RLS:
  prevents accidental cross-tenant access
```

A common transaction-local context:

```sql
SELECT set_config('app.organization_id', $1, true);
SELECT set_config('app.user_id', $2, true);
```

Policy:

```sql
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Project" FORCE ROW LEVEL SECURITY;

CREATE POLICY project_tenant_isolation
ON "Project"
USING (
  "organizationId" = current_setting(
    'app.organization_id',
    true
  )
)
WITH CHECK (
  "organizationId" = current_setting(
    'app.organization_id',
    true
  )
);
```

Important:

- The application role must not own protected tables.
- The application role must not have `BYPASSRLS`.
- Tenant context must be transaction-local under connection pooling.
- Webhooks and cross-tenant administration need explicit database roles or intentional privileged paths.
- RLS tests must use the same role as production.

Do not add RLS before every tenant-owned row has an unambiguous tenant key.

## Anti-patterns

### Clerk metadata as product truth

Avoid:

```text
Clerk public metadata says role=admin
therefore database access granted
```

Use Clerk for identity and session truth. Use the application database for memberships, roles, and product authorization.

### Global admin by email

Avoid:

```ts
if (email.endsWith("@mycompany.com")) return true;
```

Bootstrap overrides may exist temporarily, but they must be explicit, audited, environment-specific, and removable.

### Boolean soup

Avoid:

```ts
isOwner
isAdmin
isSuperAdmin
isCustomer
isEmployee
canManage
```

Prefer:

```text
membership role
  → capabilities
  → resource policy
```

### Client-provided scope

Avoid:

```ts
getProjects({
  organizationId: formData.get("organizationId"),
  userId: formData.get("userId"),
});
```

Resolve the actor and membership server-side.

## Tests

Build a policy matrix:

| Role | Own resource | Other resource | Read | Write | Manage members |
|---|---:|---:|---:|---:|---:|
| owner | yes | yes | allow | allow | allow |
| admin | yes | yes | allow | allow | allow |
| member | yes | no | allow | allow | deny |
| viewer | yes | no | allow | deny | deny |
| no membership | any | any | deny | deny | deny |

Test:

- Missing session
- Disabled user
- Suspended membership
- Cross-tenant resource
- Own versus all capability
- System actor restrictions
- Route hiding does not bypass workflow authorization
- RLS blocks direct accidental cross-tenant query
- Application role cannot bypass RLS

## Golden auth/authz checklist

```text
[ ] Clerk resolves identity, not product role truth
[ ] Local active user becomes a trusted Actor
[ ] Tenant membership is resolved server-side
[ ] Roles map to explicit capabilities
[ ] Read access derives query scope
[ ] Write access evaluates resource policy
[ ] Workflow invariants are separate from authorization
[ ] Provider readiness is separate from authorization
[ ] System actors are explicit and narrowly scoped
[ ] Client-provided user/tenant scope is never trusted
[ ] RLS supplements rather than replaces application authz
```

## Compressed canonical model

```text
requireActor()
  → requireMembership(actor, organizationId)
  → requireCapability(membership, operation)
  → requireResourcePolicy(actor, membership, resource)
  → assertWorkflowInvariant(resource)
  → perform operation
```

Authentication identifies the caller. RBAC grants general capability. Resource policy narrows it to the record. The workflow decides whether reality currently permits the transition.
