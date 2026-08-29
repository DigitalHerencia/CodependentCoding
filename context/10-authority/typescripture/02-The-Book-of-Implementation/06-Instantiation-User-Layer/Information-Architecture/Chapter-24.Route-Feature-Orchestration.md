---
title: Hipster Stack Golden Route and Feature Orchestrator Pattern
type: reference
scope: domain
project:
domain: hipsterstack
artifact: route-feature-orchestration
kind: reference
namespace: hipsterstack.patterns.route-feature-orchestration.reference
status: review
authority: working-note
parent: "[[hipsterstack.patterns.catalog.map]]"
depends_on:
  - "[[hipsterstack.engineering-system.definition.source-document]]"
supersedes: []
tags:
  - tech-stack/hipsterstack
  - architecture/routes-and-features
  - patterns/canonical
  - status/review
created: 2026-08-05
updated: 2026-08-05
---

# Canonical Pattern 007: The Golden Route and Feature Orchestrator

Routes adapt the framework.

Features assemble the product experience.

Neither layer owns persistence, provider mechanics, or domain mutation.

The canonical page path is:

```text
URL request
   ↓
Next.js route
   ↓
validated route context
   ↓
feature page loader
   ↓
authorized fetchers
   ↓
page-state resolution
   ↓
feature composition
   ↓
domain and shared components
```

The route answers:

> What URL was requested, and what should Next.js do with the result?

The feature answers:

> What product experience should be assembled for this use case?

## Core rule

> **Routes adapt. Features orchestrate. Components render. Fetchers read. Actions mutate.**

A route should not become a 300-line page controller.

A feature should not become a secret persistence layer.

A component should not discover its own authorization rules halfway through rendering.

---

# Responsibilities

## Route orchestration owns

- URL structure
- Route parameters
- Search parameters
- Metadata entrypoints
- Route-level redirects
- `notFound()` decisions
- Route-level loading, error, and not-found boundaries
- HTTP adaptation in Route Handlers
- Delegation to one feature entrypoint

## Feature orchestration owns

- Page-specific read composition
- Calling one or more fetchers
- Parallel versus sequential read decisions
- Mapping read results into page state
- Role-aware and lifecycle-aware presentation decisions
- Selecting which domain components appear
- Supplying action references to interactive components
- Page-level empty, blocked, onboarding, and ready states
- Suspense boundaries around independently streamable subfeatures

## Components own

- Rendering
- Local interaction
- Accessible controls
- Browser-only behavior in deliberate Client Components
- Display formatting
- Submitting commands through supplied Server Actions

## These layers do not own

- Prisma queries
- Raw Stripe calls
- Database transactions
- Domain state transitions
- Membership resolution rules
- Provider webhook processing
- Cross-resource mutation workflows

---

# Canonical file structure

```text
app/
└── (tenant)/
    └── organizations/
        └── [organizationId]/
            └── projects/
                └── [projectId]/
                    ├── page.tsx
                    ├── loading.tsx
                    ├── error.tsx
                    └── not-found.tsx

features/
└── projects/
    └── project-detail/
        ├── project-detail-page.loader.ts
        ├── project-detail-page.feature.tsx
        ├── project-detail-page.types.ts
        ├── project-detail-header.tsx
        ├── project-detail-actions.client.tsx
        └── project-activity-section.tsx

lib/
└── fetchers/
    └── projects/
        ├── get-project-detail.fetcher.ts
        └── list-project-activity.fetcher.ts
```

The route knows the feature entrypoint.

The feature knows fetchers and components.

The components do not know Prisma exists.

---

# Route input contract

Route parameters and search parameters are untrusted transport input.

```ts
// features/projects/project-detail/project-detail-page.types.ts

export interface ProjectDetailRouteInput {
  organizationId: string;
  projectId: string;
  tab: "overview" | "activity" | "settings";
}
```

Normalize route input once.

```ts
// features/projects/project-detail/project-detail-route.schema.ts

import { z } from "zod";

export const projectDetailRouteSchema = z.object({
  organizationId: z.string().trim().min(1),
  projectId: z.string().trim().min(1),
  tab: z
    .enum(["overview", "activity", "settings"])
    .default("overview"),
});
```

---

# Page-resolution contract

The loader returns a deliberate page resolution rather than throwing framework behavior from every helper.

```ts
// features/projects/project-detail/project-detail-page.types.ts

import type { ProjectDetailDTO } from "@/types/project.types";
import type { ProjectActivityItemDTO } from "@/types/project-activity.types";

export type ProjectDetailPageResolution =
  | {
      kind: "render";
      state: ProjectDetailPageState;
    }
  | {
      kind: "not-found";
    }
  | {
      kind: "redirect";
      href: string;
    };

export interface ProjectDetailPageState {
  route: ProjectDetailRouteInput;

  project: ProjectDetailDTO;

  activity: {
    items: ProjectActivityItemDTO[];
    hasMore: boolean;
  };

  permissions: {
    canEdit: boolean;
    canArchive: boolean;
    canManageMembers: boolean;
  };

  presentation: {
    title: string;
    description: string | null;
    showOnboardingNotice: boolean;
  };
}
```

The page state contains everything required to assemble the page.

It does not contain:

- Prisma records
- Clerk session objects
- Stripe SDK objects
- database clients
- provider secrets
- unbounded relation graphs

---

# The golden feature loader

```ts
// features/projects/project-detail/project-detail-page.loader.ts

import "server-only";

import { getProjectDetail } from "@/lib/fetchers/projects/get-project-detail.fetcher";
import { listProjectActivity } from "@/lib/fetchers/projects/list-project-activity.fetcher";
import { getProjectPageCapabilities } from "@/lib/fetchers/projects/get-project-page-capabilities.fetcher";
import type {
  ProjectDetailPageResolution,
  ProjectDetailRouteInput,
} from "./project-detail-page.types";

export async function loadProjectDetailPage(
  route: ProjectDetailRouteInput,
): Promise<ProjectDetailPageResolution> {
  const project = await getProjectDetail({
    organizationId: route.organizationId,
    projectId: route.projectId,
  });

  if (!project) {
    return {
      kind: "not-found",
    };
  }

  if (project.requiresOnboardingRedirect) {
    return {
      kind: "redirect",
      href: `/organizations/${route.organizationId}/onboarding`,
    };
  }

  const [activity, capabilities] = await Promise.all([
    listProjectActivity({
      organizationId: route.organizationId,
      projectId: route.projectId,
      limit: 20,
    }),

    getProjectPageCapabilities({
      organizationId: route.organizationId,
      projectId: route.projectId,
    }),
  ]);

  return {
    kind: "render",
    state: {
      route,
      project,

      activity: {
        items: activity.items,
        hasMore: activity.pageInfo.hasNextPage,
      },

      permissions: {
        canEdit: capabilities.includes("project.write"),
        canArchive: capabilities.includes("project.archive"),
        canManageMembers: capabilities.includes(
          "project.members.manage",
        ),
      },

      presentation: {
        title: project.name,
        description: project.description,
        showOnboardingNotice: !project.isFullyConfigured,
      },
    },
  };
}
```

## Why load the project first?

The activity and capability reads depend on a valid project.

That is an intentional waterfall:

```text
project exists and is accessible
        ↓
load dependent page data
```

Independent reads begin together through `Promise.all()`.

Do not force parallelism when one read establishes the legal or logical precondition for another.

---

# The golden route

```tsx
// app/(tenant)/organizations/[organizationId]/projects/[projectId]/page.tsx

import { notFound, redirect } from "next/navigation";

import {
  ProjectDetailPageFeature,
} from "@/features/projects/project-detail/project-detail-page.feature";
import {
  loadProjectDetailPage,
} from "@/features/projects/project-detail/project-detail-page.loader";
import {
  projectDetailRouteSchema,
} from "@/features/projects/project-detail/project-detail-route.schema";

interface ProjectDetailPageProps {
  params: Promise<{
    organizationId: string;
    projectId: string;
  }>;

  searchParams: Promise<{
    tab?: string;
  }>;
}

export default async function ProjectDetailPage({
  params,
  searchParams,
}: ProjectDetailPageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const route = projectDetailRouteSchema.parse({
    organizationId: resolvedParams.organizationId,
    projectId: resolvedParams.projectId,
    tab: resolvedSearchParams.tab,
  });

  const resolution = await loadProjectDetailPage(route);

  switch (resolution.kind) {
    case "not-found":
      notFound();

    case "redirect":
      redirect(resolution.href);

    case "render":
      return (
        <ProjectDetailPageFeature
          state={resolution.state}
        />
      );
  }
}
```

This route owns:

- framework props,
- validation,
- `notFound`,
- redirect,
- delegation.

It does not own the page’s database choreography.

---

# The golden page feature

```tsx
// features/projects/project-detail/project-detail-page.feature.tsx

import { ProjectDetailHeader } from "./project-detail-header";
import { ProjectDetailOverview } from "./project-detail-overview";
import { ProjectDetailSettings } from "./project-detail-settings";
import { ProjectActivityList } from "./project-activity-list";
import type { ProjectDetailPageState } from "./project-detail-page.types";

interface ProjectDetailPageFeatureProps {
  state: ProjectDetailPageState;
}

export function ProjectDetailPageFeature({
  state,
}: ProjectDetailPageFeatureProps) {
  return (
    <main>
      <ProjectDetailHeader
        project={state.project}
        permissions={state.permissions}
      />

      {state.presentation.showOnboardingNotice ? (
        <ProjectOnboardingNotice
          organizationId={state.route.organizationId}
          projectId={state.route.projectId}
        />
      ) : null}

      {state.route.tab === "overview" ? (
        <ProjectDetailOverview
          project={state.project}
        />
      ) : null}

      {state.route.tab === "activity" ? (
        <ProjectActivityList
          items={state.activity.items}
          hasMore={state.activity.hasMore}
        />
      ) : null}

      {state.route.tab === "settings" ? (
        <ProjectDetailSettings
          project={state.project}
          canEdit={state.permissions.canEdit}
        />
      ) : null}
    </main>
  );
}
```

The feature composes product meaning.

It does not query Prisma or reconstruct authorization.

---

# Streaming subfeatures

Not every page should block on every section.

A route or feature can stream independent sections through Suspense.

```tsx
import { Suspense } from "react";

export function ProjectDashboardFeature({
  organizationId,
}: {
  organizationId: string;
}) {
  return (
    <main>
      <DashboardHeader />

      <Suspense fallback={<ProjectMetricsSkeleton />}>
        <ProjectMetricsSection
          organizationId={organizationId}
        />
      </Suspense>

      <Suspense fallback={<RecentActivitySkeleton />}>
        <RecentActivitySection
          organizationId={organizationId}
        />
      </Suspense>
    </main>
  );
}
```

Each async section is a Server Component that calls a secure fetcher.

```tsx
async function ProjectMetricsSection({
  organizationId,
}: {
  organizationId: string;
}) {
  const metrics = await getProjectMetrics({
    organizationId,
  });

  return <ProjectMetrics metrics={metrics} />;
}
```

Use Suspense when:

- sections can render independently,
- delayed data should not block the whole page,
- the fallback preserves useful page structure.

Use `Promise.all()` when:

- the complete page state must be resolved together,
- one state decision depends on all results,
- partial rendering would create contradictory UI.

---

# Loading, error, and not-found ownership

## `loading.tsx`

Owns the route-segment loading shell.

```tsx
export default function Loading() {
  return <ProjectDetailPageSkeleton />;
}
```

## `error.tsx`

Owns unexpected route-segment failures.

```tsx
"use client";

export default function ErrorBoundary({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <UnexpectedErrorState
      title="Project unavailable"
      onRetry={reset}
    />
  );
}
```

Expected failures should not reach this boundary.

Examples of expected page outcomes:

- not found,
- forbidden represented as not found,
- onboarding redirect,
- empty state,
- blocked state.

## `not-found.tsx`

Owns the route-specific missing-resource presentation.

The fetcher returns `null`.

The loader returns `{ kind: "not-found" }`.

The route invokes `notFound()`.

That responsibility chain is explicit.

---

# Layout orchestration

Layouts own durable route shells:

- navigation,
- page chrome,
- provider composition,
- broad authenticated surface gating,
- slots and nested layout structure.

Layouts should not become hidden page loaders.

Avoid placing rapidly changing, page-specific, or expensive uncached reads in a shared layout when the page or a Suspense-wrapped subfeature can own them more precisely.

A route group such as `(tenant)` organizes routes.

It does not create tenancy by itself.

Actual tenancy comes from:

- organization membership,
- tenant-scoped data,
- authorization,
- database containment.

---

# Route Handlers

Route Handlers follow the same adapter rule.

```text
HTTP request
  → route validation/authentication
  → application workflow
  → HTTP response
```

```ts
// app/api/projects/[projectId]/route.ts

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      projectId: string;
    }>;
  },
) {
  const { projectId } = await context.params;

  const result = await getProjectApiRepresentation({
    projectId,
    request,
  });

  return Response.json(result.body, {
    status: result.status,
    headers: result.headers,
  });
}
```

The Route Handler adapts HTTP.

It does not become a parallel business layer beside Server Actions.

---

# Metadata orchestration

Metadata may call a narrow public or protected fetcher when the title depends on resource state.

```ts
export async function generateMetadata({
  params,
}: ProjectDetailPageProps) {
  const { organizationId, projectId } = await params;

  const metadata = await getProjectMetadata({
    organizationId,
    projectId,
  });

  return {
    title: metadata
      ? `${metadata.name} · Projects`
      : "Project",
  };
}
```

Use a metadata-specific projection.

Do not fetch the entire page DTO to obtain one title.

---

# Feature taxonomy

Use explicit feature suffixes:

```text
*.loader.ts
  server-only page-state orchestration

*.feature.tsx
  page or use-case composition

*.section.tsx
  substantial page region

*.client.tsx
  browser-interactive boundary

*.types.ts
  feature-local contracts

*.presenter.ts
  optional mapping from DTOs to display models
```

The taxonomy should explain responsibility without opening the file.

---

# Anti-patterns

## Route-as-application

```tsx
export default async function Page() {
  const session = await auth();
  const rows = await prisma.project.findMany();
  const checkout = await stripe.checkout.sessions.create();
  // 250 more lines
}
```

## Feature-as-persistence-layer

```tsx
export async function ProjectFeature() {
  const projects = await prisma.project.findMany();
  return <ProjectList projects={projects} />;
}
```

## Component-owned authorization

```tsx
<Button
  disabled={user.role !== "admin"}
>
  Delete
</Button>
```

Button visibility is presentation.

The action or workflow still performs authoritative authorization.

## Route-group cosplay

```text
app/(tenant)/
```

without organization ownership, membership, or tenant-scoped queries.

## Accidental waterfalls

```ts
const metrics = await getMetrics();
const activity = await getActivity();
const notices = await getNotices();
```

when none depend on another.

---

# Tests

## Route tests

Verify:

- params and search params are normalized,
- invalid route input fails predictably,
- not-found resolution invokes the route’s missing behavior,
- redirect resolution uses the expected destination,
- render resolution passes state to the feature,
- no Prisma or provider imports exist in route modules.

## Loader tests

Verify:

- inaccessible project resolves as not found,
- onboarding state resolves as redirect,
- dependent fetchers are not called before the project is established,
- independent reads execute together,
- capability results become presentation permissions,
- no Prisma records leak into page state.

## Feature tests

Verify the page-state matrix:

```text
overview
activity
settings
onboarding notice
editable
read-only
archive available
archive unavailable
empty activity
```

The feature test receives page state directly.

It does not mock Prisma.

## Architecture tests

Enforce:

```text
app/** may import features/** and transport helpers
features/** may import fetchers/**, actions/**, components/**, types/**
features/** may not import Prisma, Stripe, Clerk server SDKs, or db/**
components/** may not import db/** or integrations/**
```

---

# Golden route and feature checklist

```text
[ ] Route parameters are treated as untrusted input
[ ] Route delegates to one feature page loader or feature entrypoint
[ ] Route owns notFound, redirect, metadata, and HTTP decisions
[ ] Feature loader calls secure fetchers rather than Prisma
[ ] Dependent reads remain sequential
[ ] Independent reads run in parallel or stream through Suspense
[ ] Feature state is serializable and persistence-free
[ ] Feature component composes product behavior
[ ] Client Components are introduced only for browser interaction
[ ] Loading, expected empty states, and unexpected failures are distinct
[ ] Layouts provide shells rather than hidden page-specific data access
[ ] Route groups are not mistaken for authorization or tenancy
```

## Compressed canonical form

```tsx
export default async function Page(props: PageProps) {
  const route = parseRouteInput(props);
  const resolution = await loadPage(route);

  switch (resolution.kind) {
    case "not-found":
      notFound();

    case "redirect":
      redirect(resolution.href);

    case "render":
      return <PageFeature state={resolution.state} />;
  }
}
```

The route decides what Next.js should do.

The feature decides what the product should show.
