import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { test, vi } from "vitest";

vi.mock("@/lib/auth/clerkAccount", () => ({
  useSignIn: () => ({ signIn: {}, fetchStatus: "idle" }),
  useSignUp: () => ({ signUp: {}, fetchStatus: "idle" }),
  SignIn: () => null,
  SignUp: () => null,
}));

import { SignInForm } from "@/features/auth/sign-in-form";
import { SignUpForm } from "@/features/auth/sign-up-form";

for (const [path, Component] of [
  ["/sign-in", SignInForm],
  ["/sign-up", SignUpForm],
] as const) {
  test(`${path} cannot submit credentials through a native GET before hydration`, () => {
    const html = renderToStaticMarkup(createElement(Component));
    const form = html.match(/<form\b[^>]*>/)?.[0] ?? "";
    assert.equal(
      /\bmethod="post"/.test(form),
      true,
      "Credentials must use POST.",
    );
    assert.equal(
      form.includes(`action="${path}"`),
      true,
      "Use a query-free action.",
    );
    assert.equal(
      /<fieldset\b[^>]*\bdisabled=""/.test(html),
      true,
      "Credentials must stay disabled until hydration.",
    );
  });
}
