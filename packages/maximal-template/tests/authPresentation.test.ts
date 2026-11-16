import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test, vi } from "vitest";
import RouteError from "@/app/(auth)/error";
import Loading from "@/app/(auth)/loading";
import { AuthInputBlock } from "@/components/blocks/auth-blocks";
import { AuthHeader } from "@/components/nav/auth-header";

test("the auth error boundary passes Next's reset callback without exposing error details", () => {
  const reset = vi.fn();
  const result = RouteError({ error: new Error("private fixture"), reset });
  expect(result.props.reset).toBe(reset);
  const html = renderToStaticMarkup(result);
  expect(html).toContain("Something went wrong");
  expect(html).toContain("Try again");
  expect(html).toContain('href="/sign-in"');
  expect(html).not.toContain("private fixture");
  expect(html).not.toContain("404");
});

test("loading announces its state and hides decorative skeletons", () => {
  const html = renderToStaticMarkup(createElement(Loading));
  expect(html).toContain('role="status"');
  expect(html).toContain('aria-label="Loading auth content"');
  expect(html).toContain('aria-hidden="true"');
});

test("the auth header returns home through a plain link", () => {
  const html = renderToStaticMarkup(createElement(AuthHeader));
  expect(html).toContain('href="/"');
  expect(html).toContain("Return Home");
  expect(html).not.toMatch(/<button|role="button"|data-slot="button"/);
});

test("validation errors remain associated with their labelled input", () => {
  const html = renderToStaticMarkup(
    createElement(AuthInputBlock, {
      id: "fixture-code",
      label: "Verification code",
      invalid: true,
      error: "Required fixture",
      autoComplete: "one-time-code",
    }),
  );
  expect(html).toContain('for="fixture-code"');
  expect(html).toContain('aria-describedby="fixture-code-error"');
  expect(html).toContain('id="fixture-code-error"');
  expect(html).toContain('aria-invalid="true"');
});
