// Types for ownership.mjs so TypeScript tests can import it (allowJs is off).
type Manifest = { modules: { id: string; owns?: string[] }[] };
type Rule = "owns" | "segment" | "basename" | "base";

export declare const BASE: "base";
export declare function ownerOf(
  path: string,
  manifest: Manifest,
): { owner: string | null; rule: Rule; candidates: string[] };
export declare function listFiles(cwd: string): string[];
export declare function ownershipReport(
  files: string[],
  manifest: Manifest,
): {
  counts: Record<string, number>;
  ambiguous: { path: string; rule: Rule; candidates: string[] }[];
};
