// Why: maps an app's hipster.json (or its absence) to the shape the apps screen uses.
import path from "node:path";

import type { HipsterJson } from "@/schemas/appsSchemas";
import type { GeneratedApp } from "@/types/appsTypes";

export function toGeneratedAppDTO(
  dir: string,
  record: HipsterJson | null,
): GeneratedApp {
  return {
    dir,
    name: path.basename(dir),
    found: record !== null,
    modules: record?.modules ?? [],
    tenancy: record?.tenancy ?? null,
    accessControl: record?.accessControl ?? null,
    color: record?.color ?? null,
    createdAt: record?.createdAt ?? null,
    cliVersion: record?.cli ?? null,
    templateCommit: record?.template?.commit ?? null,
  };
}
