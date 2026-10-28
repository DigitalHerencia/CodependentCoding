import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/integrations/hipster-stack/compose", () => ({
  INITIAL_COMMIT: "chore: scaffold from hipster-stack",
  composeNewApp: vi.fn(async () => {
    throw new Error("/tmp/app is not empty.");
  }),
  validateNewApp: vi.fn(),
}));
vi.mock("@/lib/integrations/process/run-command", () => ({
  runCommand: vi.fn(async () => ({ code: 0, output: "", durationMs: 1 })),
}));

const { runCommand } = await import("@/lib/integrations/process/run-command");
const { createAppAction } = await import("@/lib/actions/appsActions");

describe("new app", () => {
  it("rejects a bad color before anything runs", async () => {
    const result = await createAppAction(
      {
        appDir: "/tmp/app",
        preset: "blank",
        tenancy: "multi",
        accessControl: "abac",
        color: "teal",
      },
      () => undefined,
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("VALIDATION");
  });

  it("stops at the first failed step and runs nothing after it", async () => {
    const result = await createAppAction(
      {
        appDir: "/tmp/app",
        preset: "blank",
        tenancy: "multi",
        accessControl: "abac",
        color: "",
      },
      () => undefined,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.steps.map((step) => step.status)).toEqual([
      "failed",
      "waiting",
      "waiting",
      "waiting",
    ]);
    expect(result.data.steps[0]?.detail).toContain("not empty");
    expect(runCommand).not.toHaveBeenCalled();
  });
});
