---
title: Hipster Stack Golden Fetcher Pattern
type: reference
scope: domain
project:
domain: hipsterstack
artifact: fetcher
kind: reference
namespace: hipsterstack.patterns.fetcher.reference
status: review
authority: working-note
parent: "[[hipsterstack.patterns.catalog.map]]"
depends_on:
  - "[[hipsterstack.engineering-system.definition.source-document]]"
supersedes: []
tags:
  - tech-stack/hipsterstack
  - architecture/fetchers
  - patterns/canonical
  - status/review
created: 2026-08-03
updated: 2026-08-05
---

# Canonical Pattern 001: The Golden Fetcher

Here is the motherfucker.

A **fetcher is not a React component, Server Action, API endpoint, or generic Prisma wrapper**.

It is a plain asynchronous, server-only **read use case** called by a React Server Component or feature:

```text
untrusted input
    ↓
runtime validation
    ↓
authenticated actor
    ↓
authorized data scope
    ↓
tenant-scoped Prisma query
    ↓
minimal select
    ↓
DTO mapper
    ↓
serializable DTO
```

React Server Components can query an ORM directly because they execute on the server, so you do not need to build an internal API route between the component and PostgreSQL. Next.js still requires you to authenticate and authorize those reads. ([Next.js][1])

---

## The responsibility

A golden fetcher does exactly this:

```text
Authenticate
Authorize
Validate
Scope
Select
Read
Map
Return
```

It does **not**:

```text
Write to the database
Call Stripe
Synchronize provider state
Send email
Revalidate paths
Redirect
Call notFound()
Return Prisma models
Return Date objects to client-facing code
Contain JSX
Accept client-provided ownership as truth
Perform unbounded “fetch all” queries
```

The exported fetcher is a secure application boundary. It should be impossible to call it accidentally and receive data from the wrong organization.

---

# Canonical file layout

```text
lib/
├── auth/
│   └── actor.ts
├── authz/
│   └── project-read-scope.ts
├── db/
│   ├── prisma.ts
│   ├── selects/
│   │   └── project.selects.ts
│   └── mappers/
│       └── project.mappers.ts
└── fetchers/
    └── projects/
        ├── get-project-detail.fetcher.ts
        └── list-projects.fetcher.ts

schemas/
└── project.schemas.ts

types/
└── project.types.ts
```

You could consolidate some of this in a smaller codebase. The important part is preserving the responsibilities, not winning a folder-count competition.

---

# 1. The DTO

The DTO is the shape the rest of your application is allowed to know.

```ts
// types/project.types.ts

export type ProjectStatusDTO = "draft" | "active" | "archived";

export interface ProjectDetailDTO {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  status: ProjectStatusDTO;

  owner: {
    id: string;
    displayName: string;
  };

  taskCount: number;

  createdAt: string;
  updatedAt: string;
}
```

Notice:

* No Prisma namespace.
* No generated model.
* Dates are ISO strings.
* No fields the UI does not need.
* Nullability is explicit.
* Nested data has an intentional application shape.

This is your **read contract**.

---

# 2. The select

The select describes the exact persistence projection required to construct that DTO.

```ts
// lib/db/selects/project.selects.ts

import type { Prisma } from "@/prisma/generated/prisma/client";

export const projectDetailSelect = {
  id: true,
  organizationId: true,
  name: true,
  description: true,
  status: true,
  createdAt: true,
  updatedAt: true,

  owner: {
    select: {
      id: true,
      displayName: true,
    },
  },

  _count: {
    select: {
      tasks: true,
    },
  },
} satisfies Prisma.ProjectSelect;

export type ProjectDetailRecord = Prisma.ProjectGetPayload<{
  select: typeof projectDetailSelect;
}>;
```

Prisma’s `select` mechanism exists specifically to return only the scalar and related fields needed by a query rather than returning the entire record graph. Nested selections let you constrain related records as well. ([Prisma][2])

## Why export the record type?

Because the mapper should know the precise shape returned by this select:

```text
projectDetailSelect
        ↓
ProjectDetailRecord
        ↓
mapProjectDetailDTO()
```

If someone removes `owner.displayName` from the select, TypeScript breaks the mapper.

That is useful breakage.

---

# 3. The DTO mapper

The mapper translates persistence representation into application representation.

```ts
// lib/db/mappers/project.mappers.ts

import type { ProjectDetailRecord } from "@/lib/db/selects/project.selects";
import type {
  ProjectDetailDTO,
  ProjectStatusDTO,
} from "@/types/project.types";

function mapProjectStatus(
  status: ProjectDetailRecord["status"],
): ProjectStatusDTO {
  switch (status) {
    case "draft":
    case "active":
    case "archived":
      return status;
  }
}

export function mapProjectDetailDTO(
  record: ProjectDetailRecord,
): ProjectDetailDTO {
  return {
    id: record.id,
    organizationId: record.organizationId,
    name: record.name,
    description: record.description,
    status: mapProjectStatus(record.status),

    owner: {
      id: record.owner.id,
      displayName: record.owner.displayName,
    },

    taskCount: record._count.tasks,

    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
```

The mapper owns:

* Date serialization
* Enum/domain translation
* Renaming fields
* Flattening relations
* Combining values
* Hiding persistence details
* Providing stable UI-facing contracts

The mapper does **not** query the database.

---

# 4. The authorization scope

This is the part that prevents auth/authz from turning into wet spaghetti.

The authz helper should not merely return `true` or `false`. For reads, it can return the **scope the query is permitted to use**.

```ts
// lib/authz/project-read-scope.ts

import type { Actor } from "@/lib/auth/actor";

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

interface RequireProjectReadScopeInput {
  actor: Actor;
  organizationId: string;
}

export async function requireProjectReadScope(
  input: RequireProjectReadScopeInput,
): Promise<ProjectReadScope> {
  const membership = await requireOrganizationMembership({
    actor: input.actor,
    organizationId: input.organizationId,
  });

  if (membership.capabilities.has("project.read.all")) {
    return {
      kind: "organization",
      organizationId: input.organizationId,
    };
  }

  if (membership.capabilities.has("project.read.own")) {
    return {
      kind: "owned",
      organizationId: input.organizationId,
      ownerUserId: input.actor.userId,
    };
  }

  throw new AuthorizationError("Project read access denied.");
}
```

The important idea is:

```text
authz does not fetch the project

authz determines the maximum legal query scope
```

Then the fetcher injects that scope directly into the SQL-producing Prisma query.

---

# 5. The golden by-ID fetcher

```ts
// lib/fetchers/projects/get-project-detail.fetcher.ts

import "server-only";

import { z } from "zod";

import { requireActor } from "@/lib/auth/actor";
import { requireProjectReadScope } from "@/lib/authz/project-read-scope";
import { mapProjectDetailDTO } from "@/lib/db/mappers/project.mappers";
import { prisma } from "@/lib/db/prisma";
import { projectDetailSelect } from "@/lib/db/selects/project.selects";
import type { ProjectDetailDTO } from "@/types/project.types";

const getProjectDetailInputSchema = z.object({
  organizationId: z.string().trim().min(1),
  projectId: z.string().trim().min(1),
});

export async function getProjectDetail(
  input: unknown,
): Promise<ProjectDetailDTO | null> {
  // 1. Validate everything that originated outside this module.
  const parsed = getProjectDetailInputSchema.parse(input);

  // 2. Resolve the trusted server-side actor.
  const actor = await requireActor();

  // 3. Determine the legal database scope.
  const scope = await requireProjectReadScope({
    actor,
    organizationId: parsed.organizationId,
  });

  // 4. Put authorization into the query itself.
  const record = await prisma.project.findFirst({
    where: {
      id: parsed.projectId,
      organizationId: scope.organizationId,
      deletedAt: null,

      ...(scope.kind === "owned"
        ? {
            ownerUserId: scope.ownerUserId,
          }
        : {}),
    },

    select: projectDetailSelect,
  });

  // 5. Do not leak the persistence record.
  return record ? mapProjectDetailDTO(record) : null;
}
```

`import "server-only"` causes Next.js to produce a build-time error when this module is accidentally pulled into a Client Component’s dependency graph. ([Next.js][3])

## This line is the real security boundary

```ts
where: {
  id: parsed.projectId,
  organizationId: scope.organizationId,
  ...(scope.kind === "owned"
    ? { ownerUserId: scope.ownerUserId }
    : {}),
}
```

Not this:

```ts
const project = await prisma.project.findUnique({
  where: { id: projectId },
});

if (project.organizationId !== organizationId) {
  throw new Error("Forbidden");
}
```

The second version retrieves an unauthorized record before rejecting it.

The golden pattern is:

> **Do not fetch broadly and authorize narrowly. Query only within the already-authorized scope.**

---

# 6. Calling it from a React Server Component

```tsx
// app/(tenant)/organizations/[organizationId]/projects/[projectId]/page.tsx

import { notFound } from "next/navigation";

import { ProjectDetailFeature } from "@/features/projects/project-detail-feature";
import { getProjectDetail } from "@/lib/fetchers/projects/get-project-detail.fetcher";

interface ProjectPageProps {
  params: Promise<{
    organizationId: string;
    projectId: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { organizationId, projectId } = await params;

  const project = await getProjectDetail({
    organizationId,
    projectId,
  });

  if (!project) {
    notFound();
  }

  return <ProjectDetailFeature project={project} />;
}
```

The fetcher does not know about Next.js navigation.

The route decides:

```text
null means 404 here
```

Another caller might decide:

```text
null means render an empty state
```

That keeps the fetcher reusable and framework-light.

---

# The golden list fetcher

Do not write this:

```ts
export async function getAllProjects() {
  return prisma.project.findMany();
}
```

That is how someone accidentally loads 80,000 tenant records and ships the whole Prisma model into a client table.

The canonical list is:

* Tenant-scoped
* Authorization-scoped
* Filtered
* Sorted
* Bounded
* Paginated
* DTO-mapped

```ts
// lib/fetchers/projects/list-projects.fetcher.ts

import "server-only";

import { z } from "zod";

import { requireActor } from "@/lib/auth/actor";
import { requireProjectReadScope } from "@/lib/authz/project-read-scope";
import { mapProjectListItemDTO } from "@/lib/db/mappers/project.mappers";
import { prisma } from "@/lib/db/prisma";
import { projectListItemSelect } from "@/lib/db/selects/project.selects";
import type { ProjectListDTO } from "@/types/project.types";

const listProjectsInputSchema = z.object({
  organizationId: z.string().trim().min(1),

  search: z.string().trim().max(100).optional(),

  status: z.enum(["draft", "active", "archived"]).optional(),

  cursor: z.string().trim().min(1).optional(),

  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export async function listProjects(
  input: unknown,
): Promise<ProjectListDTO> {
  const parsed = listProjectsInputSchema.parse(input);
  const actor = await requireActor();

  const scope = await requireProjectReadScope({
    actor,
    organizationId: parsed.organizationId,
  });

  const records = await prisma.project.findMany({
    where: {
      organizationId: scope.organizationId,
      deletedAt: null,

      ...(scope.kind === "owned"
        ? {
            ownerUserId: scope.ownerUserId,
          }
        : {}),

      ...(parsed.status
        ? {
            status: parsed.status,
          }
        : {}),

      ...(parsed.search
        ? {
            OR: [
              {
                name: {
                  contains: parsed.search,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: parsed.search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    },

    orderBy: [{ updatedAt: "desc" }, { id: "desc" }],

    take: parsed.limit + 1,

    ...(parsed.cursor
      ? {
          cursor: {
            id: parsed.cursor,
          },
          skip: 1,
        }
      : {}),

    select: projectListItemSelect,
  });

  const hasNextPage = records.length > parsed.limit;
  const visibleRecords = hasNextPage
    ? records.slice(0, parsed.limit)
    : records;

  return {
    items: visibleRecords.map(mapProjectListItemDTO),

    pageInfo: {
      hasNextPage,
      nextCursor: hasNextPage
        ? (visibleRecords.at(-1)?.id ?? null)
        : null,
    },
  };
}
```

## Why `limit + 1`?

You request one additional record:

```text
requested page size: 20
database take:       21
```

If record 21 exists, you know another page exists without running a separate `COUNT(*)`.

For admin tables that require exact page numbers and exact totals, use offset pagination plus a parallel count:

```ts
const [records, total] = await Promise.all([
  prisma.project.findMany({
    where,
    skip,
    take: pageSize,
    select: projectListItemSelect,
  }),

  prisma.project.count({
    where,
  }),
]);
```

Use:

```text
Cursor pagination
  feeds
  activity logs
  large datasets
  infinite scrolling

Offset + count
  conventional admin tables
  “Page 4 of 19”
  exact totals required
```

---

# The canonical fetcher families

You do not need 40 abstract base classes. You need a small number of repeatable read shapes.

| Fetcher                | Purpose                                         |
| ---------------------- | ----------------------------------------------- |
| `getThingById`         | One scoped detail record                        |
| `listThings`           | Filtered and paginated collection               |
| `getThingOptions`      | Small `{ value, label }` collection for selects |
| `getThingSummary`      | Counts and aggregates                           |
| `getThingPageState`    | Compose several related reads for one feature   |
| `searchThings`         | Bounded full-text or filtered search            |
| `getPublicThingBySlug` | Explicitly public projection                    |
| `getAdminThingById`    | Explicit privileged cross-scope read            |

## Avoid ambiguous names

Bad:

```text
fetchData()
getAll()
loadStuff()
getProject()
queryProjects()
```

Good:

```text
getProjectDetail()
listOrganizationProjects()
getProjectSelectOptions()
getProjectDashboardSummary()
getProjectPageState()
getPublicProjectBySlug()
```

The name should reveal:

```text
cardinality + scope + representation
```

---

# Authentication and authorization ownership

For your template, I recommend this rule:

## Exported fetchers are self-securing

```ts
export async function getProjectDetail(input: unknown) {
  const actor = await requireActor();
  const scope = await requireProjectReadScope(...);
  // query
}
```

Do not require every React component to remember:

```ts
const actor = await requireActor();
await authorize(actor);
return getProject();
```

Someone will eventually call `getProject()` without the first two lines.

## Internal query functions may accept trusted scope

When multiple fetchers need the same persistence query, extract a private or data-layer query:

```ts
async function queryProjectDetail(input: {
  projectId: string;
  scope: ProjectReadScope;
}) {
  return prisma.project.findFirst({
    where: buildProjectReadWhere(input, scope),
    select: projectDetailSelect,
  });
}
```

But only the secure exported fetcher should be called from routes and features.

```text
Route/feature
    ↓
secure exported fetcher
    ↓
internal query
```

---

# Fetchers and caching

For the golden baseline:

> **Authenticated tenant fetchers are uncached unless you deliberately prove otherwise.**

Do not add `"use cache"` to every fetcher.

Next.js 16 Cache Components make persistent function/component caching explicit and opt-in with `"use cache"`. ([Next.js][4])

React’s `cache()` is different: in Server Components it memoizes repeated calls during a server request and React invalidates that memoization between requests. ([React][5])

That means this can be useful:

```ts
import { cache } from "react";

export const requireActor = cache(async (): Promise<Actor> => {
  // Clerk session + local user + membership resolution
});
```

If five fetchers call `requireActor()` during one render, React can reuse the same resolution.

But do not confuse that with durable application caching.

```text
React cache()
  request-level memoization

"use cache"
  persistent Next.js data/component caching

Prisma query
  actual database read
```

For now:

```text
Actor/session resolution
  request memoization is useful

Tenant operational data
  fresh by default

Public catalog/reference data
  candidate for persistent caching

Payment, authz, readiness, time-sensitive state
  do not make decisions from stale cache
```

---

# The canonical fetcher checklist

Every exported fetcher should answer yes to these:

```text
[ ] Is the file marked server-only?
[ ] Is external input runtime-validated?
[ ] Is the actor resolved from trusted server state?
[ ] Is authorization performed server-side?
[ ] Does authorization produce or constrain query scope?
[ ] Is organization/tenant scope inside the Prisma where clause?
[ ] Is ownership scope inside the Prisma where clause when required?
[ ] Is soft-delete state handled?
[ ] Is the query bounded?
[ ] Does it use an explicit select?
[ ] Does it map the persistence record into a DTO?
[ ] Are dates and other non-serializable values transformed?
[ ] Does it avoid writes and external side effects?
[ ] Does it avoid Next.js navigation behavior?
[ ] Does it avoid returning generated Prisma types?
```

## The compressed canonical form

```ts
export async function getThing(input: unknown): Promise<ThingDTO | null> {
  const parsed = inputSchema.parse(input);
  const actor = await requireActor();
  const scope = await requireThingReadScope({ actor, ...parsed });

  const record = await prisma.thing.findFirst({
    where: buildAuthorizedThingWhere(parsed, scope),
    select: thingSelect,
  });

  return record ? mapThingDTO(record) : null;
}
```

That is your prototypical golden fetcher:

> **Parse the request, establish the actor, derive the legal scope, make the database incapable of returning anything outside that scope, select only what is needed, map it, and return a stable DTO.**

No elephant leakage. No Prisma sludge in the component. No client-supplied organization cosplay. No side-effect ambush hiding inside a function named `getDashboardData()`.

[1]: https://nextjs.org/docs/app/getting-started/fetching-data?utm_source=chatgpt.com "Getting Started: Fetching Data | Next.js"
[2]: https://www.prisma.io/docs/orm/prisma-client/queries/select-fields?utm_source=chatgpt.com "Select fields | Prisma Documentation"
[3]: https://nextjs.org/docs/app/getting-started/server-and-client-components?utm_source=chatgpt.com "Getting Started: Server and Client Components | Next.js"
[4]: https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents?utm_source=chatgpt.com "next.config.js: cacheComponents | Next.js"
[5]: https://react.dev/reference/react/cache?utm_source=chatgpt.com "cache – React"
