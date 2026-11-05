// Why: Fetchers: tenant-scoped reads (RLS context set, organizationId in every predicate); null when absent.
import "server-only";

import {persistedReadLimitSchema,persistedRecordIdSchema} from "@/schemas/commonSchemas";
import { assertPermission } from "@/lib/authz/permissions";
import { to{{Entity}}DTO } from "@/lib/db/dtos/{{module}}Dtos";
import { {{entity}}Select } from "@/lib/db/selects/{{module}}Selects";
import { withAuthenticatedRead } from "@/lib/db/tenant";

export async function get{{Entities}}(rawLimit:unknown = 50) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "{{resource}}:read");
    const limit=persistedReadLimitSchema.parse(rawLimit);
    const rows = await tx.{{entity}}.findMany({
      where: { organizationId: access.organizationId },
      orderBy: { updatedAt: "desc" },
      take: Math.min(Math.max(limit, 1), 100),
      select: {{entity}}Select,
    });
    return rows.map(to{{Entity}}DTO);
  });
}

export async function get{{Entity}}(rawId: unknown) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "{{resource}}:read");
    const {{param}}=persistedRecordIdSchema.parse(rawId);
    const row = await tx.{{entity}}.findFirst({
      where: { id: {{param}}, organizationId: access.organizationId },
      select: {{entity}}Select,
    });
    return row ? to{{Entity}}DTO(row) : null;
  });
}
