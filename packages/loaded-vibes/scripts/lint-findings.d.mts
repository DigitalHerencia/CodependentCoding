export interface Finding {
  file: string;
  line: number;
  message: string;
}
export interface FindingGroup {
  id: string;
  findings: Finding[];
}
export declare function groupFindings(
  results: {
    filePath: string;
    messages: { ruleId: string | null; message: string; line?: number }[];
  }[],
  appDir: string,
): FindingGroup[];
export declare function lintApp(appDir: string): FindingGroup[];
