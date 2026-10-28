import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { render } from "ink-testing-library";
import { describe, expect, it } from "vitest";

import { frameWith, press } from "@/tests/ink-helpers";

const home = mkdtempSync(path.join(tmpdir(), "codependent-home-"));
const app = mkdtempSync(path.join(tmpdir(), "demo-app-"));
writeFileSync(
  path.join(app, "hipster.json"),
  JSON.stringify({
    template: { commit: "8b3dc6bd07cb" },
    cli: "0.1.0",
    createdAt: "2026-10-28T21:07:06.118Z",
    modules: ["crm"],
    color: null,
    tenancy: "single",
    accessControl: "rbac",
  }),
);
process.env.CODEPENDENT_HOME = home;
const { RootLayout } = await import("@/app/layout");

describe("settings and apps screens", () => {
  it("adds an app folder in settings, then lists it on the apps screen", async () => {
    const { lastFrame, stdin, unmount } = render(<RootLayout />);
    await frameWith(lastFrame, "Repository");
    await press(stdin, "8");
    await frameWith(lastFrame, "No app folders yet");
    await press(stdin, "a");
    await frameWith(lastFrame, "App folder");
    await press(stdin, app);
    await press(stdin, "\r");
    await frameWith(lastFrame, "Added.");
    expect(
      JSON.parse(readFileSync(path.join(home, "settings.json"), "utf8")),
    ).toEqual({ apps: [app] });

    await press(stdin, "7");
    const frame = await frameWith(lastFrame, "base, crm");
    expect(frame).toContain(path.basename(app));
    expect(frame).toMatch(/Organizations\s*:?\s*single/);
    unmount();
  });

  it("refuses a folder without hipster.json", async () => {
    const { rememberAppAction } = await import("@/lib/actions/settingsActions");
    const result = await rememberAppAction({ dir: home });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("NOT_FOUND");
  });
});
