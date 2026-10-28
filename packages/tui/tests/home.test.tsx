import { render } from "ink-testing-library";
import { describe, expect, it } from "vitest";

import { RootLayout } from "@/app/layout";
import { HomePage } from "@/app/page";

describe("home screen", () => {
  it("renders the workspace inside the app frame", () => {
    const { lastFrame, unmount } = render(
      <RootLayout>
        <HomePage />
      </RootLayout>,
    );
    const frame = lastFrame() ?? "";
    expect(frame).toContain("Workspace: MAIN");
    expect(frame).toContain("ctrl+c quit");
    unmount();
  });
});
