---
title: Hipster Stack Golden Server Action Pattern
type: reference
scope: domain
project:
domain: hipsterstack
artifact: server-action
kind: reference
namespace: hipsterstack.patterns.server-action.reference
status: review
authority: working-note
parent: "[[hipsterstack.patterns.catalog.map]]"
depends_on:
  - "[[hipsterstack.engineering-system.definition.source-document]]"
supersedes: []
tags:
  - tech-stack/hipsterstack
  - architecture/server-actions
  - patterns/canonical
  - status/review
created: 2026-08-03
updated: 2026-08-05
---

# Canonical Pattern 002: The Golden Server Action

A Server Action is a **Next.js adapter for receiving a mutation request and returning a framework-safe result**.

It is not the billing department, the database layer, the Stripe integration, the authorization system, the email worker, and the domain model crammed into one file because `"use server"` looked official.

## Canonical flow

```text
untrusted mutation input
        ↓
Server Action
        ↓
runtime validation
        ↓
authenticated actor
        ↓
application use case
        ↓
typed use-case result
        ↓
cache invalidation
        ↓
typed ActionResult
```

The authoritative resource-level authorization and workflow invariant checks belong in the application use case, because that layer loads the resource facts required to make the decision.

## Responsibilities

A golden Server Action owns:

- The `"use server"` boundary
- Transport-specific input normalization
- Runtime validation of transport input
- Current actor resolution
- Invocation of one application command or workflow
- Translation of known application errors into a stable result
- Next.js cache invalidation after successful mutation
- Optional redirect after successful mutation

It does not own:

- Raw Prisma queries
- Stripe SDK calls
- Email delivery
- Multi-step domain workflows
- Database transactions
- Resource transition rules
- Webhook processing
- React rendering

## File structure

```text
lib/
├── actions/
│   └── projects/
│       └── archive-project.action.ts
├── application/
│   └── projects/
│       └── archive-project.workflow.ts
├── auth/
│   └── actor.ts
├── cache/
│   └── invalidation.ts
└── errors/
    └── application-error.ts

schemas/
└── project.schemas.ts

types/
└── action-result.ts
```

## The canonical ActionResult

```ts
// types/action-result.ts

export type ActionFieldErrors = Record<string, string[]>;

export type ActionResult<TData> =
  | {
      ok: true;
      data: TData;
    }
  | {
      ok: false;
      code:
        | "VALIDATION_ERROR"
        | "UNAUTHENTICATED"
        | "FORBIDDEN"
        | "NOT_FOUND"
        | "CONFLICT"
        | "PROVIDER_ERROR"
        | "INTERNAL_ERROR";
      formError?: string;
      fieldErrors?: ActionFieldErrors;
    };
```

The discriminant is always `ok`.

Consumers should never have to guess whether a result is an error by inspecting whether `message` exists.

## Application errors

```ts
// lib/errors/application-error.ts

export type ApplicationErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "PROVIDER_ERROR";

export class ApplicationError extends Error {
  constructor(
    public readonly code: ApplicationErrorCode,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "ApplicationError";
  }
}
```

Known failures become typed results. Unknown failures are logged and become a generic internal error.

Do not return database exception messages, provider payloads, or stack traces to the browser.

## Input schema

```ts
// schemas/project.schemas.ts

import { z } from "zod";

export const archiveProjectActionSchema = z.object({
  projectId: z.string().trim().min(1),
  organizationId: z.string().trim().min(1),
});

export type ArchiveProjectActionInput = z.infer<
  typeof archiveProjectActionSchema
>;
```

## Cache invalidation result

The application workflow should not import `next/cache`.

It may return logical invalidation intent:

```ts
// lib/cache/invalidation.ts

export interface InvalidationPlan {
  tags?: string[];
  paths?: string[];
}

export interface MutationOutcome<TData> {
  data: TData;
  invalidate?: InvalidationPlan;
}
```

The action translates that plan into Next.js calls.

```ts
// lib/cache/apply-invalidation.ts

import { revalidatePath, updateTag } from "next/cache";

import type { InvalidationPlan } from "@/lib/cache/invalidation";

export function applyInvalidation(plan?: InvalidationPlan): void {
  if (!plan) return;

  for (const tag of plan.tags ?? []) {
    updateTag(tag);
  }

  for (const path of plan.paths ?? []) {
    revalidatePath(path);
  }
}
```

Use immediate invalidation for read-your-writes behavior after a Server Action. Do not invalidate half the application because identifying the affected resource felt inconvenient.

## The canonical action

```ts
// lib/actions/projects/archive-project.action.ts

"use server";

import { ZodError } from "zod";

import { archiveProject } from "@/lib/application/projects/archive-project.workflow";
import { requireActor } from "@/lib/auth/actor";
import { applyInvalidation } from "@/lib/cache/apply-invalidation";
import { ApplicationError } from "@/lib/errors/application-error";
import { archiveProjectActionSchema } from "@/schemas/project.schemas";
import type { ActionResult } from "@/types/action-result";
import type { ProjectSummaryDTO } from "@/types/project.types";

export async function archiveProjectAction(
  rawInput: unknown,
): Promise<ActionResult<ProjectSummaryDTO>> {
  try {
    const input = archiveProjectActionSchema.parse(rawInput);
    const actor = await requireActor();

    const outcome = await archiveProject({
      actor,
      input,
    });

    applyInvalidation(outcome.invalidate);

    return {
      ok: true,
      data: outcome.data,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        ok: false,
        code: "VALIDATION_ERROR",
        formError: "Review the submitted values.",
        fieldErrors: error.flatten().fieldErrors,
      };
    }

    if (error instanceof ApplicationError) {
      return {
        ok: false,
        code: error.code,
        formError: error.message,
      };
    }

    console.error("archiveProjectAction failed", { error });

    return {
      ok: false,
      code: "INTERNAL_ERROR",
      formError: "The project could not be archived.",
    };
  }
}
```

## FormData adapter

When the browser submits `FormData`, normalize it before schema parsing.

```ts
"use server";

export async function archiveProjectFormAction(
  _previousState: ActionResult<ProjectSummaryDTO> | null,
  formData: FormData,
): Promise<ActionResult<ProjectSummaryDTO>> {
  return archiveProjectAction({
    projectId: formData.get("projectId"),
    organizationId: formData.get("organizationId"),
  });
}
```

Keep this adapter stupid.

Do not bury business decisions inside `formData.get()` branches.

## Redirecting action

The action may redirect after a successful result because redirect behavior is a transport concern.

```ts
"use server";

import { redirect } from "next/navigation";

export async function archiveProjectAndReturnAction(
  rawInput: unknown,
): Promise<ActionResult<never>> {
  const result = await archiveProjectAction(rawInput);

  if (!result.ok) {
    return result;
  }

  redirect(`/organizations/${result.data.organizationId}/projects`);
}
```

Remember that `redirect()` throws internally. Do not place it inside a broad `try/catch` that converts it into `"INTERNAL_ERROR"`.

## Integration-backed action

The action remains thin even when the use case touches Stripe.

```ts
// lib/actions/billing/create-checkout-session.action.ts

"use server";

import { createCheckoutSessionWorkflow } from "@/lib/application/billing/create-checkout-session.workflow";
import { requireActor } from "@/lib/auth/actor";
import { applyInvalidation } from "@/lib/cache/apply-invalidation";
import { createCheckoutSessionSchema } from "@/schemas/billing.schemas";
import type { ActionResult } from "@/types/action-result";
import type { CheckoutSessionDTO } from "@/types/billing.types";

export async function createCheckoutSessionAction(
  rawInput: unknown,
): Promise<ActionResult<CheckoutSessionDTO>> {
  try {
    const input = createCheckoutSessionSchema.parse(rawInput);
    const actor = await requireActor();

    const outcome = await createCheckoutSessionWorkflow({
      actor,
      input,
    });

    applyInvalidation(outcome.invalidate);

    return {
      ok: true,
      data: outcome.data,
    };
  } catch (error) {
    return mapActionError(error, {
      fallbackMessage: "Checkout could not be started.",
    });
  }
}
```

The action does not personally load the invoice, check ownership, create the Stripe Customer, generate idempotency keys, create the Checkout Session, persist the payment attempt, or send notifications.

## Authentication versus authorization

The action resolves the actor:

```text
Who is calling?
```

The application workflow authorizes the requested operation:

```text
May this actor archive this specific project in its current state?
```

This keeps authorization close to the resource facts and prevents action files from repeating incomplete policy checks.

## Naming

Use intent-based names:

```text
archiveProjectAction
issueInvoiceAction
confirmBookingAction
createCheckoutSessionAction
changeMembershipRoleAction
```

Avoid:

```text
updateProjectAction
saveDataAction
handleSubmit
processThing
doMutation
```

## Tests

The action test should prove transport behavior, not re-test the workflow internals.

Test:

- Invalid input returns field errors
- Missing actor returns unauthenticated result
- Known application error maps to the correct code
- Successful workflow result is returned
- Cache invalidation runs only after success
- Unknown exceptions are logged and hidden
- Redirect occurs only after success

Mock actor resolution, the application workflow, and the cache adapter.

Do not mock Prisma here because the action should not know Prisma exists.

## Golden action checklist

```text
[ ] File begins with "use server"
[ ] Raw input is runtime-validated
[ ] Current actor is resolved server-side
[ ] Exactly one application command/workflow is invoked
[ ] No Prisma import exists
[ ] No provider SDK import exists
[ ] Known errors map to stable ActionResult codes
[ ] Unknown errors are logged and hidden
[ ] Cache invalidation occurs only after successful mutation
[ ] Redirect behavior remains at the framework boundary
[ ] Result contains serializable application DTOs
```

## Compressed canonical form

```ts
"use server";

export async function mutateThingAction(
  rawInput: unknown,
): Promise<ActionResult<ThingDTO>> {
  try {
    const input = inputSchema.parse(rawInput);
    const actor = await requireActor();

    const outcome = await mutateThing({ actor, input });

    applyInvalidation(outcome.invalidate);

    return {
      ok: true,
      data: outcome.data,
    };
  } catch (error) {
    return mapActionError(error);
  }
}
```

The action receives the request, establishes the caller, invokes the use case, adapts the result, and gets the fuck out of the way.
