import { describe, expect, it, vi } from "vitest";

const writes = new Map([
  ["features/invoices/invoicesFeature.tsx", ""],
  ["stuff/helpers.ts", ""],
]);

vi.mock("@/lib/integrations/hipster-stack/slice", () => ({
  planAppSlice: vi.fn(async () => ({
    names: { Entity: "Invoice" },
    newModule: true,
    created: [...writes.keys()],
    updated: [],
    writes,
  })),
  writeAppSlice: vi.fn(),
  formatAppSlice: vi.fn(() => []),
}));
vi.mock("@/lib/integrations/git/status", () => ({
  changedFiles: vi.fn(async () => ""),
}));
vi.mock("@/lib/integrations/process/run-command", () => ({
  runCommand: vi.fn(async () => ({ code: 0, output: "ok", durationMs: 1 })),
}));

const { writeAppSlice } =
  await import("@/lib/integrations/hipster-stack/slice");
const { createSliceAction } = await import("@/lib/actions/slicesActions");

describe("slice creation", () => {
  it("stops before writing when a path has no doctrine layer", async () => {
    const result = await createSliceAction(
      {
        appDir: ".",
        entity: "invoice",
        moduleId: "billing",
        fields: "number:string",
      },
      () => undefined,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const [doctrine, write] = result.data.steps;
    expect(doctrine?.status).toBe("failed");
    expect(doctrine?.detail).toContain("stuff/helpers.ts");
    expect(doctrine?.detail).not.toContain("invoicesFeature");
    expect(write?.status).toBe("waiting");
    expect(writeAppSlice).not.toHaveBeenCalled();
  });
});
