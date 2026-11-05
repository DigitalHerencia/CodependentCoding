export interface Issue {
  file: string;
  id: string;
  title: string;
  type: string;
  area: string;
  priority: string;
  size: string;
  status: string;
  milestone?: string;
  labels?: string[];
  depends_on?: string[];
  body: string;
}
export declare const FILE_PATTERN: RegExp;
export declare const ENUMS: Record<
  "type" | "priority" | "size" | "status",
  string[]
>;
export declare function parseFrontmatter(text: string): {
  data: Record<string, string | string[]>;
  body: string;
};
export declare function labelsOf(issue: Issue): string[];
export declare function loadIssues(dir?: string): {
  issues: Issue[];
  problems: string[];
};
