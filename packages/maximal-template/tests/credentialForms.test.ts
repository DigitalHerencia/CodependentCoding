/** Credential Forms.test contracts for the owning application slice. */
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { test, vi } from "vitest";

vi.mock("@clerk/nextjs", () => ({
  useSignIn: () => ({ signIn: {}, fetchStatus: "idle" }),
  useSignUp: () => ({ signUp: {}, fetchStatus: "idle" }),
  SignIn: () => null,
  SignUp: () => null,
}));

import { AuthNewSignInForm } from "@/features/auth/authNewSignInForm";
import { AuthNewSignUpForm } from "@/features/auth/authNewSignUpForm";

for (const [path, Component] of [
  ["/sign-in", AuthNewSignInForm],
  ["/sign-up", AuthNewSignUpForm],
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
