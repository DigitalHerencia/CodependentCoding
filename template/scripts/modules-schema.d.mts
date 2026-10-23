// Types for modules-schema.mjs so TypeScript tests can import it (allowJs is off).
import type { z } from "zod";

export declare const RESERVED_IDS: readonly string[];
export declare const manifestSchema: z.ZodType;
export declare function toJsonSchema(): Record<string, unknown>;
export declare function validateManifest(
  input: unknown,
): { ok: true; manifest: unknown } | { ok: false; errors: string[] };
