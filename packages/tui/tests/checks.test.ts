import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/integrations/process/run-command", () => ({
  runCommand: vi.fn(async (_command: string, args: string[]) =>
    args[1] === "lint"
      ? { code: 1, output: "line 1\n[CC-FEAT-001] bad import", durationMs: 5 }
      : { code: 0, output: "ok", durationMs: 5 },
  ),
}));

const { runTemplateChecksAction } = await import("@/lib/actions/checksActions");

describe("template checks", () => {
  it("runs every check in order and reports a failure's last lines", async () => {
    const seen: string[] = [];
    const result = await runTemplateChecksAction((runs) =>
      seen.push(runs.map((run) => run.status[0]).join("")),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.map((run) => run.status)).toEqual([
      "passed",
      "failed",
      "passed",
      "passed",
      "passed",
    ]);
    expect(result.data[1]?.detail).toContain("CC-FEAT-001");
    expect(seen[0]).toBe("rwwww");
    expect(seen.at(-1)).toBe("pfppp");
  });
});
