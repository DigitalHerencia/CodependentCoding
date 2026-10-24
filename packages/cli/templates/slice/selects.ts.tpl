// Why: Selects: one shape per DTO, so queries never over-fetch columns.
import type { Prisma } from "@/generated/prisma/client";

export const {{entity}}Select = {
  id: true,
{{selectFields}}
  version: true,
  updatedAt: true,
} satisfies Prisma.{{Entity}}Select;

export type {{Entity}}Record = Prisma.{{Entity}}GetPayload<{
  select: typeof {{entity}}Select;
}>;
