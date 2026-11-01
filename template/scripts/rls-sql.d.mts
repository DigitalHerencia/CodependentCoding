// Types for rls-sql.mjs so TypeScript tests can import it (allowJs is off).
export declare function rlsFiles(root: string): string[];
export declare function rlsSql(root: string): string;
export declare function writeRlsMigration(
  root: string,
  now?: Date,
): string | null;
export declare function rlsDrift(
  client: {
    query: (
      sql: string,
    ) => Promise<{ rows: { kind: string; key: string; value: string }[] }>;
  },
  root: string,
): Promise<string[]>;
