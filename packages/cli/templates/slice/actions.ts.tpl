"use server";

// Why: the only write path for {{module}}. Each action authenticates, authorizes, validates, writes inside the tenant transaction (RLS context set), invalidates the affected routes and returns an ActionResult.
{{prismaTypeImport}}import {
  create{{Entity}}Schema,
  update{{Entity}}Schema,
} from "@/schemas/{{module}}Schemas";
import type { ActionResult } from "@/types/actionTypes";
import type { {{Entity}}DTO } from "@/types/{{module}}Types";
import { toActionResult } from "@/lib/utils/actionResult";
import { requireIdentity } from "@/lib/auth/auth";
import { assertPermission } from "@/lib/authz/permissions";
import { to{{Entity}}DTO } from "@/lib/db/dto/{{module}}.dto";
import { {{entity}}Select } from "@/lib/db/selects/{{module}}.selects";
import { withTenantTransaction } from "@/lib/db/tenant";
import { invalidatePaths } from "@/lib/cache/invalidate";
import { {{errorImports}} } from "@/lib/db/transactions/errors";

export async function create{{Entity}}(
  rawInput: unknown,
): Promise<ActionResult<{{Entity}}DTO>> {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    const saved = await withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "{{module}}:write");
      const input = create{{Entity}}Schema.parse(rawInput);
{{refCheckCall}}
      const record = await tx.{{entity}}.create({
        data: {
          organizationId: access.organizationId,
{{writeData}}
        },
        select: {{entity}}Select,
      });
      await tx.auditEvent.create({
        data: {
          organizationId: access.organizationId,
          actorUserId: access.userId,
          action: "{{entity}}.created",
          resourceType: "{{Entity}}",
          resourceId: record.id,
        },
      });
      return to{{Entity}}DTO(record);
    });
    invalidatePaths({{entity}}Paths(saved.id));
    return saved;
  });
}

export async function update{{Entity}}(
  rawInput: unknown,
): Promise<ActionResult<{{Entity}}DTO>> {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    const saved = await withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "{{module}}:write");
      const input = update{{Entity}}Schema.parse(rawInput);
{{refCheckCall}}
      const result = await tx.{{entity}}.updateMany({
        where: {
          id: input.{{param}},
          organizationId: access.organizationId,
          version: input.expectedVersion,
        },
        data: {
{{writeData}}
          version: { increment: 1 },
        },
      });
      if (result.count !== 1) {
        const exists = await tx.{{entity}}.count({
          where: { id: input.{{param}}, organizationId: access.organizationId },
        });
        throw staleOrMissing("{{Entity}}", exists > 0);
      }
      return to{{Entity}}DTO(
        await tx.{{entity}}.findFirstOrThrow({
          where: { id: input.{{param}}, organizationId: access.organizationId },
          select: {{entity}}Select,
        }),
      );
    });
    invalidatePaths({{entity}}Paths(saved.id));
    return saved;
  });
}
{{refCheckFunction}}
/** Routes that show {{entities}}. */
function {{entity}}Paths(id: string) {
  return ["/{{route}}", `/{{route}}/${id}`];
}
