// Types for compose.mjs so the CLI and TypeScript tests can import it (allowJs is off).
type Manifest = { modules: { id: string; dependsOn?: string[] }[] };

export declare function closure(
  manifest: Manifest,
  selected: string[],
): string[];
export declare function renderRegistry(ids: string[]): string;
export declare function compose(
  root: string,
  outDir: string,
  selected: string[],
  options?: { exclude?: string[] },
): { modules: string[]; files: number; removed: number };
