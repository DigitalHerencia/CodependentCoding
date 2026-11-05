export declare const LOCAL_ONLY: RegExp;
export declare function readExample(
  text: string,
): { name: string; required: boolean }[];
export declare function readLocal(text: string): Map<string, string>;
export interface EnvPlan {
  push: string[];
  localOnly: string[];
  unset: string[];
  missingRequired: string[];
}
export declare function planEnv(appDir: string): {
  plan: EnvPlan;
  local: Map<string, string>;
};
