---
title: Server Operations
slug: server-operations
order: 7
summary: Fetchers read, actions write, workflows compose. The action pipeline, the result contract, the single error mapper, and rate limiting.
rules:
  [
    CC-ERR-001,
    CC-ERR-002,
    CC-ERR-003,
    CC-FLOW-001,
    CC-RATE-001,
    CC-RATE-002,
    CC-READ-001,
    CC-READ-002,
    CC-READ-003,
    CC-READ-004,
    CC-SRV-001,
    CC-WRITE-001,
    CC-WRITE-002,
    CC-WRITE-003,
    CC-WRITE-004,
    CC-WRITE-005,
  ]
---

# Server Operations

Three kinds of server function, each with one job.

| Kind     | File                                | Directive                 | Called by                          | Returns                                   |
| -------- | ----------------------------------- | ------------------------- | ---------------------------------- | ----------------------------------------- |
| Fetcher  | `lib/fetchers/<slice>Fetchers.ts`   | `import "server-only"`    | features, workflows                | DTO, DTO[], or `null`                     |
| Action   | `lib/actions/<slice>Actions.ts`     | `"use server"` (file top) | forms, client islands              | `ActionResult<DTO>`                       |
| Workflow | `lib/workflows/<slice>Workflows.ts` | `import "server-only"`    | features (reads), actions (writes) | DTO / view model, or throws a coded error |

> **CC-SRV-001** · `now` · `codependent/require-server-only` (auto-fix)
> Every module under `lib/` that is not `"use server"`, not `lib/utils`, not `lib/constants`, and not imported by client code imports `server-only`, so the build fails if it reaches a client bundle.

Naming: fetchers start with `get` or `list`; actions with `create`, `update`, `delete`, or a domain verb (`approve`, `archive`); workflows are named for the use case (`getCrmWorkspace`, `closeCrmDeal`) — the file name already says "workflow".

## Fetchers

A fetcher is a server-only read use case. It validates its criteria, authenticates, authorizes, scopes, reads exactly what it needs, and returns a DTO.

```ts
// lib/fetchers/crmFetchers.ts
import "server-only";
import { z } from "zod";
import { assertPermission } from "@/lib/authz/permissions";
import { withTenantRead } from "@/lib/db/tenant";
import {
  crmContactDetailSelect,
  crmContactRowSelect,
} from "@/lib/db/selects/crm.selects";
import { toCrmContactDTO, toCrmContactRowDTO } from "@/lib/db/dto/crm.dto";
import { listCrmContactsSchema } from "@/schemas/crmSchemas";
import { pagination } from "@/lib/constants/pagination";

/** One contact in the caller's organization, or null. */
export async function getCrmContact(input: unknown) {
  const { contactId } = z.object({ contactId: z.uuid() }).parse(input);
  return withTenantRead(async (tx, access) => {
    assertPermission(access, "crm.contact:read");
    const row = await tx.crmContact.findFirst({
      where: {
        id: contactId,
        organizationId: access.organizationId,
        deletedAt: null,
      },
      select: crmContactDetailSelect,
    });
    return row ? toCrmContactDTO(row) : null;
  });
}

/** A page of contacts with a total, filtered and sorted from search params. */
export async function listCrmContacts(input: unknown) {
  const query = listCrmContactsSchema.parse(input);
  return withTenantRead(async (tx, access) => {
    assertPermission(access, "crm.contact:read");
    const where = {
      organizationId: access.organizationId,
      deletedAt: null,
      ...(query.status ? { status: query.status } : {}),
      ...(query.q
        ? {
            OR: [
              { email: { contains: query.q, mode: "insensitive" as const } },
              { lastName: { contains: query.q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };
    const take = Math.min(query.pageSize, pagination.maximumPageSize);
    const [rows, total] = await Promise.all([
      tx.crmContact.findMany({
        where,
        select: crmContactRowSelect,
        orderBy: [{ [query.sort]: query.dir }, { id: "asc" }],
        take,
        skip: (query.page - 1) * take,
      }),
      tx.crmContact.count({ where }),
    ]);
    return {
      rows: rows.map(toCrmContactRowDTO),
      total,
      page: query.page,
      pageSize: take,
    };
  });
}
```

> **CC-READ-001** · `now` · `codependent/layer-boundaries`
> Fetchers import no action, workflow, transaction helper or integration.

> **CC-READ-002** · `now` · `codependent/no-fetcher-writes`
> Fetchers never call a Prisma write method (`create`, `update`, `upsert`, `delete`, `*Many`, `$executeRaw`).

> **CC-READ-003** · `now` · review
> IDs, params and search params are validated with Zod in the fetcher. A malformed ID is a `null` result (not found), not a thrown 500.

> **CC-READ-004** · `now` · review
> Answer aggregate questions with aggregate reads (`count`, `aggregate`, `groupBy`, a narrow select). Never fetch a list and call a detail fetcher per row (N+1).

Lists are bounded: `take` is capped by `lib/constants/pagination`; sort keys come from a Zod enum, never from a raw string; every `orderBy` ends with a unique key so pages are stable.

## Actions

An action is the **mutation entry point**: a public POST endpoint that the framework wires to a form. It is a thin, strict pipeline.

```text
authenticate → rate-limit → parse → open tenant transaction
  → role check → record-scoped write (or *.tx helper, or workflow) + audit row
→ commit → invalidate → ActionResult
```

Why this order: authentication (no database) and rate-limiting (Redis) reject anonymous and abusive callers before any real work. Parsing is pure CPU on a body capped at 1 MB, and the schemas are already public in the client bundle, so parsing before authorization leaks nothing. Authorization needs the membership (only available inside the tenant transaction) and the record ID (only available after parsing). The write and its audit row commit together.

```ts
// lib/actions/crmActions.ts
"use server";

import { requireIdentity } from "@/lib/auth/auth";
import { assertPermission } from "@/lib/authz/permissions";
import { invalidateCrmContacts } from "@/lib/cache/invalidate";
import { toCrmContactDTO } from "@/lib/db/dto/crm.dto";
import { crmContactDetailSelect } from "@/lib/db/selects/crm.selects";
import { withTenantTransaction } from "@/lib/db/tenant";
import { enforceRateLimit } from "@/lib/integrations/upstash/ratelimit";
import { toActionResult } from "@/lib/utils/actionResult";
import { createCrmContactSchema } from "@/schemas/crmSchemas";
import type { ActionResult } from "@/types/actionTypes";
import type { CrmContactDTO } from "@/types/crmTypes";

/** Creates a contact in the caller's active organization. */
export async function createCrmContact(
  raw: unknown,
): Promise<ActionResult<CrmContactDTO>> {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    await enforceRateLimit("crm.contact.create", identity.clerkUserId, {
      requests: 30,
      window: "1 m",
    });
    const input = createCrmContactSchema.parse(raw);

    const contact = await withTenantTransaction(async (tx, access) => {
      assertPermission(access, "crm.contact:create");
      const row = await tx.crmContact.create({
        data: {
          ...input,
          organizationId: access.organizationId,
          ownerMembershipId: access.membershipId,
        },
        select: crmContactDetailSelect,
      });
      await tx.auditEvent.create({
        data: {
          organizationId: access.organizationId,
          actorUserId: access.userId,
          action: "crm.contact.created",
          resourceType: "CrmContact",
          resourceId: row.id,
        },
      });
      return toCrmContactDTO(row);
    });

    invalidateCrmContacts();
    return contact;
  });
}
```

> **CC-WRITE-002** · `now` · `codependent/use-server-actions`
> Action files begin with `"use server"` and export only async functions. Inline `"use server"` closures inside components are forbidden.
> Closure variables are encrypted, but the doctrine does not rely on encryption to keep values off the client; an action's inputs are always its arguments.

> **CC-WRITE-003** · `now` · `codependent/action-pipeline`
> Every exported action authenticates before any other await and parses its argument with a schema from `schemas/`. `assertPermission` runs inside the tenant transaction before the first write — in the action, or in the first transaction of the workflow it delegates to.

> **CC-WRITE-004** · `now` · review
> Organization, user and role come from the access context, never from the input. An input field named `organizationId`, `userId` or `role` on a non-admin action is a review failure.

> **CC-WRITE-005** · `now` · review
> A multi-step write is one action using one transaction (a `*.tx.ts` helper or a workflow), never a chain of client calls.

> **CC-WRITE-001** · `now` · `codependent/layer-boundaries`
> Actions do not import integrations. Provider work goes through a workflow so it happens outside the transaction. The one exception is `lib/integrations/upstash/ratelimit`, which is a guard, not a provider operation.

## Workflows

A workflow is a named use case composed from fetchers, transaction helpers, integrations and pure logic. It is the logic-side equivalent of a template: it arranges, it does not re-implement.

```ts
// lib/workflows/crmWorkflows.ts
import "server-only";
import { getCrmPipelineStages, listCrmDeals } from "@/lib/fetchers/crmFetchers";
import type { CrmDealRowDTO, CrmStageDTO } from "@/types/crmTypes";

/** Sum of deal value weighted by stage probability. Domain math stays in the domain's workflow file. */
function calculatePipelineValue(deals: CrmDealRowDTO[], stages: CrmStageDTO[]) {
  const probability = new Map(
    stages.map((stage) => [stage.id, stage.probability]),
  );
  return deals.reduce(
    (sum, deal) =>
      sum + Number(deal.value) * (probability.get(deal.stageId) ?? 0),
    0,
  );
}

/** The pipeline board: stages, their deals, and weighted value, in one view model. */
export async function getCrmPipelineBoard(input: unknown) {
  const [stages, deals] = await Promise.all([
    getCrmPipelineStages(),
    listCrmDeals(input),
  ]);
  return {
    stages: stages.map((stage) => ({
      ...stage,
      deals: deals.rows.filter((deal) => deal.stageId === stage.id),
    })),
    weightedValue: calculatePipelineValue(deals.rows, stages),
  };
}
```

A write workflow is called by an action **after** the action has authenticated, rate-limited and parsed. The workflow owns its transactions, so it owns the permission check inside the first one, and it keeps providers between transactions, never inside them:

```ts
// lib/workflows/invoicingWorkflows.ts
import "server-only";
import { assertPermission } from "@/lib/authz/permissions";
import { withTenantTransaction } from "@/lib/db/tenant";
import {
  finalizeInvoiceTx,
  recordInvoiceSentTx,
} from "@/lib/db/transactions/invoicing-finalize-invoice.tx";
import { sendInvoiceEmail } from "@/lib/integrations/sendgrid/email";
import type { FinalizeInvoiceInput } from "@/types/invoicingTypes";

/** Finalize (atomic, audited) → email (provider, idempotent) → record the send (atomic). */
export async function finalizeAndSendInvoice(input: FinalizeInvoiceInput) {
  const invoice = await withTenantTransaction(async (tx, access) => {
    assertPermission(access, "invoicing.invoice:update");
    return finalizeInvoiceTx(tx, {
      ...input,
      organizationId: access.organizationId,
      actorUserId: access.userId,
    });
  });
  const delivery = await sendInvoiceEmail({
    to: invoice.billingEmail,
    invoiceNumber: invoice.number,
    idempotencyKey: `invoice:${invoice.id}:send`,
  });
  return withTenantTransaction((tx, access) =>
    recordInvoiceSentTx(tx, {
      invoiceId: invoice.id,
      organizationId: access.organizationId,
      providerMessageId: delivery.id,
    }),
  );
}

// lib/actions/invoicingActions.ts  ("use server")
export async function finalizeInvoice(
  raw: unknown,
): Promise<ActionResult<InvoiceDTO>> {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    await enforceRateLimit("invoicing.finalize", identity.clerkUserId, {
      requests: 10,
      window: "1 m",
    });
    const invoice = await finalizeAndSendInvoice(
      finalizeInvoiceSchema.parse(raw),
    );
    invalidateInvoice(invoice.id);
    return invoice;
  });
}
```

> **CC-FLOW-001** · `now` · `codependent/layer-boundaries`
> Workflows import no Prisma client and no provider SDK; they use transaction helpers and integration functions.

Workflows never import a `"use server"` module ([CC-FLOW-003](/doctrine/model#cc-flow-003)).

When a provider call sits between two transactions, the first transaction writes an intent state (`FINALIZED`), the provider call carries an idempotency key, and the second records the outcome. A crash between steps leaves a recoverable, visible state, never a lost one. Anything longer than a request, or needing retries, moves to background work (Chapter 08).

## The result contract

```ts
// types/actionTypes.ts
export type ActionErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL";

export type ActionResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      error: {
        code: ActionErrorCode;
        message: string;
        fieldErrors?: Record<string, string[]>;
        ref?: string;
      };
    };
```

> **CC-ERR-001** · `now` · `codependent/single-error-mapper`
> Exactly one function maps thrown errors to `ActionResult` (`lib/utils/actionResult.ts`). It rethrows Next control flow (`redirect`, `notFound`) with `unstable_rethrow`, maps `ZodError` to `VALIDATION` with field errors, maps coded domain errors to **fixed** client messages, and maps everything else to `INTERNAL`.

> **CC-ERR-002** · `now` · review
> Client messages are written for the user and never include an internal message, a stack, an ID the user did not send, or a provider error string. `INTERNAL` carries a `ref` correlation ID; the full error is reported server-side under the same ID.

> **CC-ERR-003** · `now` · review
> Actions never throw to the client. Fetchers return `null` for not-found and throw only on unexpected failure, which the route's `error.tsx` catches.

```ts
// lib/utils/actionResult.ts
import { unstable_rethrow } from "next/navigation";
import { ZodError } from "zod";
import { reportError } from "@/lib/observability/report";
import type { ActionErrorCode, ActionResult } from "@/types/actionTypes";

const clientMessage: Record<
  Exclude<ActionErrorCode, "VALIDATION" | "INTERNAL">,
  string
> = {
  UNAUTHENTICATED: "Sign in to continue.",
  FORBIDDEN: "You don't have access to do that.",
  NOT_FOUND: "That item doesn't exist or was removed.",
  CONFLICT: "Someone else changed this. Reload and try again.",
  RATE_LIMITED: "Too many requests. Wait a moment and try again.",
};

function codeOf(cause: unknown): ActionErrorCode | undefined {
  const code = (cause as { code?: unknown } | null)?.code;
  return typeof code === "string" && code in clientMessage
    ? (code as ActionErrorCode)
    : undefined;
}

/** Runs an action body and converts any failure into a client-safe ActionResult. */
export async function toActionResult<T>(
  run: () => Promise<T>,
): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await run() };
  } catch (cause) {
    unstable_rethrow(cause);
    if (cause instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of cause.issues)
        (fieldErrors[issue.path.join(".") || "form"] ??= []).push(
          issue.message,
        );
      return {
        ok: false,
        error: {
          code: "VALIDATION",
          message: "Check the highlighted fields.",
          fieldErrors,
        },
      };
    }
    const code = codeOf(cause);
    if (code && code !== "VALIDATION" && code !== "INTERNAL")
      return { ok: false, error: { code, message: clientMessage[code] } };
    const ref = reportError(cause, { boundary: "action" });
    return {
      ok: false,
      error: {
        code: "INTERNAL",
        message: "Something went wrong. Try again.",
        ref,
      },
    };
  }
}
```

## Rate limiting

> **CC-RATE-001** · `now` · review
> Expensive or abuse-prone actions (AI generation, invitations, exports, sign-up-adjacent flows) call `enforceRateLimit(scope, identifier, policy)` — Upstash sliding window, server-only — after authentication and before any transaction. In-memory limiters are forbidden: serverless instances do not share memory.

> **CC-RATE-002** · `now` · startup check
> If the rate-limit module is installed and unconfigured, production startup fails; outside production the limiter allows and logs a warning once. Webhook endpoints are never rate-limited; their protection is signature verification and idempotency.
