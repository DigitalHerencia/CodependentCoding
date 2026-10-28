import { render } from "ink-testing-library";
import { describe, expect, it } from "vitest";

import { RootLayout } from "@/app/layout";
import { getDoctrineSummary } from "@/lib/fetchers/doctrineFetchers";

async function frameWith(read: () => string | undefined, text: string) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const frame = read() ?? "";
    if (frame.includes(text)) return frame;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  throw new Error(`"${text}" never rendered:\n${read() ?? ""}`);
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 100));

/** Ink registers input handlers in effects, so let each render settle first. */
async function press(stdin: { write: (data: string) => void }, key: string) {
  await settle();
  stdin.write(key);
  await settle();
}

describe("doctrine reads", () => {
  it("reads every layer and rule from the checkout", async () => {
    const { layers, rules } = await getDoctrineSummary();
    expect(layers.map((layer) => layer.id)).toContain("feature-client");
    expect(layers.find((layer) => layer.id === "feature")?.deny).toContain(
      "ui",
    );
    expect(rules.find((rule) => rule.id === "CC-FEAT-004")?.layer).toBe(
      "feature-client",
    );
  });
});

describe("screens", () => {
  it("opens on the command center", async () => {
    const { lastFrame, unmount } = render(<RootLayout />);
    const frame = await frameWith(lastFrame, "Repository");
    expect(frame).toContain("Workspace: MAIN");
    expect(frame).toMatch(/\d+ layers · \d+ rules/);
    expect(frame).toMatch(/\d+ modules · \d+ presets/);
    unmount();
  });

  it("switches to the doctrine screen and opens another layer", async () => {
    const { lastFrame, stdin, unmount } = render(<RootLayout />);
    await frameWith(lastFrame, "Repository");
    await press(stdin, "2");
    await frameWith(lastFrame, "Route handlers own the HTTP lifecycle");
    await press(stdin, "\u001B[B");
    await press(stdin, "\r");
    const frame = await frameWith(lastFrame, "Routes own URL boundaries");
    expect(frame).toContain("CC-ROUTE-001");
    unmount();
  });
});

describe("modules screen", () => {
  it("lists modules and shows the chosen one's presets", async () => {
    const { lastFrame, stdin, unmount } = render(<RootLayout />);
    await frameWith(lastFrame, "Repository");
    await press(stdin, "3");
    const frame = await frameWith(lastFrame, "CRM / Pipeline");
    expect(frame).toMatch(/Presets\s+.*crm/);
    unmount();
  });
});
