// Why: reads which checkout the terminal app is working in.
import path from "node:path";

import { workspaceRoot } from "@/lib/db/client";
import type { WorkspaceInfo } from "@/types/workspaceTypes";

let info: Promise<WorkspaceInfo> | undefined;

export function getWorkspaceInfo(): Promise<WorkspaceInfo> {
  info ??= Promise.resolve().then(() => {
    const root = workspaceRoot();
    return { name: path.basename(root), root };
  });
  return info;
}
