// Why: maps contract rows and doctrine-map entries to transport-safe shapes.
import type { DoctrineRuleRow } from "@/schemas/doctrineSchemas";
import type { DoctrineLayer, DoctrineRule } from "@/types/doctrineTypes";

export interface BoundaryRecord {
  rule?: string;
  why?: string;
  deny?: string[];
}

export function toDoctrineRuleDTO(row: DoctrineRuleRow): DoctrineRule {
  return {
    id: row.id,
    layer: row.layer ?? null,
    text: row.text,
    enforcement: row.enforcement ?? null,
  };
}

export function toDoctrineLayerDTO(
  id: string,
  boundary: BoundaryRecord | undefined,
): DoctrineLayer {
  return {
    id,
    rule: boundary?.rule ?? null,
    why: boundary?.why ?? null,
    deny: [...(boundary?.deny ?? [])],
  };
}
