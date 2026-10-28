// Why: shared shapes for composing a new app from the Maximal Template.
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
