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

import { AuthSignInForm } from "@/features/auth/authSignInForm";
import { AuthSignUpForm } from "@/features/auth/authSignUpForm";

for (const [path, Component] of [
  ["/sign-in", AuthSignInForm],
  ["/sign-up", AuthSignUpForm],
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
