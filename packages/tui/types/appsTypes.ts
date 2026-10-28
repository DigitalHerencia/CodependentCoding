// Why: shared shapes for composing a new app and listing the ones already made.
import type { CheckRun } from "@/types/checksTypes";

export interface NewAppRequest {
  appDir: string;
  preset: string;
  tenancy: "multi" | "single";
  accessControl: "abac" | "rbac";
  /** Brand hex like #2f7a8d; empty keeps the template's tokens. */
  color: string;
}

export interface NewAppOutcome {
  appDir: string;
  modules: string[];
  steps: CheckRun[];
}

export interface GeneratedApp {
  dir: string;
  name: string;
  /** False when the folder or its hipster.json is gone. */
  found: boolean;
  modules: string[];
  tenancy: string | null;
  accessControl: string | null;
  color: string | null;
  createdAt: string | null;
  cliVersion: string | null;
  templateCommit: string | null;
}
