// Why: shared shapes for planning and creating a vertical slice in a generated app.
import type { CheckRun } from "@/types/checksTypes";

export interface SliceRequest {
  appDir: string;
  entity: string;
  moduleId: string;
  fields: string;
}

export interface SlicePreview {
  appDir: string;
  entity: string;
  moduleId: string;
  newModule: boolean;
  created: string[];
  updated: string[];
}

export interface SliceOutcome {
  steps: CheckRun[];
  changes: string;
}
