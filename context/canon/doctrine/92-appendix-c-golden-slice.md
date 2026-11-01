---
title: Golden Slice
slug: golden-slice
order: 92
summary: One complete vertical slice — CRM contacts — every file, in dependency order, with the code not already shown in the chapters.
---

# Golden Slice: `crm` contacts

This is the slice `hipster-stack slice` scaffolds from. Read it top to bottom once and you have read the whole doctrine in code. Files already shown in a chapter are linked instead of repeated.

## Files

```text
prisma/schema/crm.prisma                         model
prisma/rls/crm.sql                               policies (Ch. 05)
schemas/crmSchemas.ts                            Zod — shared by form and action
types/crmTypes.ts                                DTOs, inferred inputs
lib/db/selects/crm.selects.ts                    column allowlists (Ch. 05)
lib/db/dto/crm.dto.ts                            record → DTO (Ch. 05)
lib/db/transactions/crm-update-deal-stage.tx.ts  atomic multi-row write (Ch. 05)
lib/fetchers/crmFetchers.ts                      reads (Ch. 07)
lib/actions/crmActions.ts                        writes (Ch. 07)
lib/workflows/crmWorkflows.ts                    compositions (Ch. 07)
lib/cache/invalidate.ts                          invalidateCrmContacts()
lib/modules/crm.module.ts                        nav, dashboard widgets, permissions
content/crm.ts                                   copy
components/blocks/crm-blocks.tsx                 contact card, status badge, deal row
components/templates/crm-templates.tsx           list, detail, form layouts
features/crm/crmContactsFeature.tsx              list page assembly
features/crm/crmContactsFilters.client.tsx       filter bar island
features/crm/crmContactFeature.tsx               detail page assembly (Ch. 04)
features/crm/crmContactActions.client.tsx        archive / edit buttons
features/crm/crmContactNewForm.tsx               create form (Ch. 04)
features/crm/crmContactEditForm.tsx              edit form
features/crm/crmContacts{,Contact,ContactForm}Skeleton.tsx
app/(tenant)/crm/contacts/{page,new/page,[contactId]/page,[contactId]/edit/page}.tsx  (Ch. 03)
tests/unit/crm/crmSchemas.test.ts
tests/unit/crm/crm.dto.test.ts
tests/integration/crm/crmActions.test.ts
tests/integration/rls/crm.test.ts
```

## Model

```prisma
// prisma/schema/crm.prisma
model CrmContact {
  id                String   @id @default(uuid(7)) @db.Uuid
  organizationId    String   @db.Uuid
  ownerMembershipId String?  @db.Uuid
  accountId         String?  @db.Uuid
  firstName         String   @db.VarChar(200)
  lastName          String   @db.VarChar(200)
  email             String?  @db.VarChar(320)
  status            CrmContactStatus @default(LEAD)
  version           Int      @default(1)
  deletedAt         DateTime? @db.Timestamptz(6)
  createdAt         DateTime @default(now()) @db.Timestamptz(6)
  updatedAt         DateTime @updatedAt @db.Timestamptz(6)

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Restrict)
  account      CrmAccount?  @relation(fields: [accountId], references: [id], onDelete: SetNull)

  @@unique([organizationId, email])
  @@index([organizationId, status])
  @@index([organizationId, lastName])
}

enum CrmContactStatus {
  LEAD
  ACTIVE
  ARCHIVED
}
```

`organizationId` leads every index because every query and every policy starts with it.

## Schemas and types

```ts
// schemas/crmSchemas.ts
import { z } from "zod";
import { CrmContactStatus } from "@/generated/prisma/enums";
import { limits } from "@/lib/constants/limits";
import { pagination } from "@/lib/constants/pagination";

export const crmContactStatusSchema = z.enum(CrmContactStatus); // derived, never retyped

export const createCrmContactSchema = z.object({
  firstName: z.string().trim().min(1, "Required").max(limits.name),
  lastName: z.string().trim().min(1, "Required").max(limits.name),
  email: z.email("Enter a valid email").max(320).optional(),
  accountId: z.uuid().optional(),
});

export const updateCrmContactSchema = createCrmContactSchema.extend({
  contactId: z.uuid(),
  expectedVersion: z.int().positive(),
});

export const listCrmContactsSchema = z.object({
  q: z.string().trim().max(100).optional(),
  status: crmContactStatusSchema.optional(),
  sort: z.enum(["lastName", "createdAt"]).default("lastName"),
  dir: z.enum(["asc", "desc"]).default("asc"),
  page: z.coerce.number().int().min(1).default(pagination.defaultPage),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(pagination.maximumPageSize)
    .default(pagination.defaultPageSize),
});
```

```ts
// types/crmTypes.ts
import type { z } from "zod";
import type { CrmContactStatus } from "@/generated/prisma/enums";
import type {
  createCrmContactSchema,
  updateCrmContactSchema,
} from "@/schemas/crmSchemas";

export type CreateCrmContactInput = z.infer<typeof createCrmContactSchema>;
export type UpdateCrmContactInput = z.infer<typeof updateCrmContactSchema>;

export type CrmContactDTO = {
  id: string;
  name: string;
  email: string | null;
  status: CrmContactStatus;
  version: number;
  updatedAt: string;
  account: { id: string; name: string } | null;
};
```

The status vocabulary is written once, in the Prisma enum. The Zod schema and the DTO type both derive from it, so a new status is one schema change and a migration.

## Module definition

```ts
// lib/modules/crm.module.ts
import type { ModuleDefinition } from "@/types/moduleTypes";

export const crmModule = {
  id: "crm",
  nav: [{ label: "Contacts", href: "/crm/contacts", icon: "users" }],
  dashboard: [{ id: "crm-pipeline-value", title: "Pipeline value" }],
  permissions: {
    resources: ["crm.contact", "crm.account", "crm.deal"],
    grants: { MEMBER: ["read", "create", "update"], VIEWER: ["read"] },
  },
} satisfies ModuleDefinition;
```

## Tests

```ts
// tests/integration/rls/crm.test.ts
import { describe, expect, it } from "vitest";
import {
  asRuntime,
  seedTwoOrganizations,
} from "@/tests/integration/rls/harness";

describe("CrmContact isolation", () => {
  it("never shows organization B's contacts to organization A", async () => {
    const { orgA, orgB } = await seedTwoOrganizations({ crmContact: 2 });
    await asRuntime({ organizationId: orgA.id }, async (tx) => {
      expect(
        await tx.crmContact.count({ where: { organizationId: orgB.id } }),
      ).toBe(0); // predicate says B, RLS says no
      expect(await tx.crmContact.count()).toBe(2); // no predicate, RLS still scopes
      expect(
        (
          await tx.crmContact.updateMany({
            where: { organizationId: orgB.id },
            data: { firstName: "x" },
          })
        ).count,
      ).toBe(0);
    });
  });

  it("returns nothing when no context is set", async () => {
    await asRuntime({}, async (tx) =>
      expect(await tx.crmContact.count()).toBe(0),
    );
  });
});
```

`asRuntime` connects with the `app_runtime` credentials from `DATABASE_URL_TEST`, so the test fails if anyone ever points the app at the owner role.
