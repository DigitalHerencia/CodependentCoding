// Why: reads the doctrine (contract + lint map) from the checkout, once per run.
import { parse } from "yaml";

import { importWorkspaceModule, readWorkspaceText } from "@/lib/db/client";
import {
  type BoundaryRecord,
  toDoctrineLayerDTO,
  toDoctrineRuleDTO,
} from "@/lib/db/dto/doctrine.dto";
import { validationContractSchema } from "@/schemas/doctrineSchemas";
import type { DoctrineSummary } from "@/types/doctrineTypes";

const CONTRACT = ".claude/contracts/validation.yaml";
const LINT_MAP = "template/eslint/doctrine-map.mjs";

interface DoctrineMapModule {
  layers: { id: string; match: RegExp }[];
  boundaries: Record<string, BoundaryRecord>;
  genericNames: RegExp;
}

let summary: Promise<DoctrineSummary> | undefined;

/** Layers that carry import limits, in lint order, and every CC rule in the contract. */
export function getDoctrineSummary(): Promise<DoctrineSummary> {
  summary ??= readDoctrine();
  return summary;
}

async function readDoctrine(): Promise<DoctrineSummary> {
  const [contractText, map] = await Promise.all([
    readWorkspaceText(CONTRACT),
    importWorkspaceModule<DoctrineMapModule>(LINT_MAP),
  ]);
  const contract = validationContractSchema.parse(parse(contractText));
  return {
    layers: map.layers
      .filter((layer) => map.boundaries[layer.id])
      .map((layer) => toDoctrineLayerDTO(layer.id, map.boundaries[layer.id])),
    rules: contract.rules.map(toDoctrineRuleDTO),
  };
}

/** Code paths the doctrine has no layer for, or that use an invented folder name. */
export async function findUnplacedPaths(paths: string[]): Promise<string[]> {
  const map = await importWorkspaceModule<DoctrineMapModule>(LINT_MAP);
  return paths.filter(
    (file) =>
      /\.tsx?$/.test(file) &&
      (!map.layers.some((layer) => layer.match.test(file)) ||
        map.genericNames.test(file)),
  );
}
