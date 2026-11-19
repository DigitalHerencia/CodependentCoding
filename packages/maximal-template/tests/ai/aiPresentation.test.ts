import AiRouteError from "@/app/(tenant)/ai/error";
import { AiOutputBlock, AiSummaryBlock } from "@/components/blocks/ai-blocks";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

/** Untrusted inference output stays text and measured-zero semantics stay visible. */
describe("AI presentation safety", () => {
  it("provides recovery without exposing the route error diagnostic", () => {
    const html = renderToStaticMarkup(
      createElement(AiRouteError, {
        error: new Error("private provider diagnostic"),
        reset: () => undefined,
      }),
    );
    expect(html).not.toContain("private provider diagnostic");
    expect(html).toContain("Try again");
    expect(html).toContain('role="alert"');
  });
  it("escapes generated HTML rather than creating executable elements", () => {
    const html = renderToStaticMarkup(
      createElement(AiOutputBlock, {
        pending: false,
        output:
          '<script>alert("untrusted")</script><img src=x onerror=alert(1)>',
      }),
    );
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
  });

  it("hides stale generated output while a replacement request is pending", () => {
    const html = renderToStaticMarkup(
      createElement(AiOutputBlock, {
        pending: true,
        output: "previous response",
      }),
    );
    expect(html).not.toContain("previous response");
    expect(html).toContain("Generating");
  });

  it("renders unavailable measurements explicitly while preserving exact costs", () => {
    const html = renderToStaticMarkup(
      createElement(AiSummaryBlock, {
        summary: {
          generationCount: 3,
          inputTokens: null,
          outputTokens: 0,
          cost: "99999999999.12345678",
          measuredInputCount: 0,
          measuredOutputCount: 1,
          measuredCostCount: 2,
        },
      }),
    );
    expect(html).toContain("Not measured");
    expect(html).toContain("99999999999.12345678");
    expect(html).toContain("Missing measurements are not zero");
  });
});
