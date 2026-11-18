/** Auth Client Workflows.test contracts for the owning application slice. */
import { beforeEach, expect, test, vi } from "vitest";
import {
  finalizeAuthWorkflow,
  submitAuthSignInWorkflow,
  submitAuthSignUpWorkflow,
} from "@/lib/workflows/authWorkflows";
import {
  getSignInFormSchema,
  getSignUpFormSchema,
} from "@/schemas/authSchemas";
import type {
  AuthSignInResource,
  AuthSignInStep,
  AuthSignUpResource,
} from "@/types/authTypes";

const ok = { error: null };
const signIn = {
  create: vi.fn(async () => ok),
  password: vi.fn(async () => ok),
  resetPasswordEmailCode: {
    sendCode: vi.fn(async () => ok),
    verifyCode: vi.fn(async () => ok),
    submitPassword: vi.fn(async () => ok),
  },
  mfa: {
    verifyTOTP: vi.fn(async () => ok),
    verifyBackupCode: vi.fn(async () => ok),
    verifyPhoneCode: vi.fn(async () => ok),
    verifyEmailCode: vi.fn(async () => ok),
  },
};
const values = {
  identifier: "fixture-user",
  password: "fixture-password",
  code: "123456",
};
const resource = signIn as unknown as AuthSignInResource;

beforeEach(() => vi.clearAllMocks());

test("password submission sends only the selected credentials to Clerk", async () => {
  await submitAuthSignInWorkflow(resource, "password", "email_code", values);
  expect(signIn.password).toHaveBeenCalledWith({
    identifier: values.identifier,
    password: values.password,
  });
  expect(signIn.create).not.toHaveBeenCalled();
});

test("recovery establishes the identity before sending an email code", async () => {
  await submitAuthSignInWorkflow(resource, "recover", "email_code", values);
  expect(signIn.create).toHaveBeenCalledWith({ identifier: values.identifier });
  expect(signIn.create.mock.invocationCallOrder[0]).toBeLessThan(
    signIn.resetPasswordEmailCode.sendCode.mock.invocationCallOrder[0]!,
  );
});

test("a rejected recovery identity never sends a verification code", async () => {
  const denied = { error: { message: "Rejected fixture" } };
  const create = vi.fn(async () => denied);
  const rejected = { ...signIn, create } as unknown as AuthSignInResource;
  expect(
    await submitAuthSignInWorkflow(rejected, "recover", "email_code", values),
  ).toBe(denied);
  expect(signIn.resetPasswordEmailCode.sendCode).not.toHaveBeenCalled();
});

test.each([
  [
    "reset-code",
    "email_code",
    signIn.resetPasswordEmailCode.verifyCode,
    { code: values.code },
  ],
  [
    "new-password",
    "email_code",
    signIn.resetPasswordEmailCode.submitPassword,
    { password: values.password },
  ],
  ["mfa", "totp", signIn.mfa.verifyTOTP, { code: values.code }],
  ["mfa", "backup_code", signIn.mfa.verifyBackupCode, { code: values.code }],
  ["mfa", "phone_code", signIn.mfa.verifyPhoneCode, { code: values.code }],
  ["mfa", "email_code", signIn.mfa.verifyEmailCode, { code: values.code }],
] as const)(
  "%s dispatches %s without replaying the password",
  async (step, factor, method, expected) => {
    await submitAuthSignInWorkflow(resource, step, factor, values);
    expect(method).toHaveBeenCalledExactlyOnceWith(expected);
    expect(signIn.password).not.toHaveBeenCalled();
  },
);

test("sign-up credentials and verification codes are separate operations", async () => {
  const password = vi.fn(async () => ok);
  const verifyEmailCode = vi.fn(async () => ok);
  const signUp = {
    password,
    verifications: { verifyEmailCode },
  } as unknown as AuthSignUpResource;
  const signup = {
    username: "fixture",
    emailAddress: "fixture@example.test",
    password: values.password,
    code: values.code,
  };
  await submitAuthSignUpWorkflow(signUp, false, signup);
  expect(password).toHaveBeenCalledExactlyOnceWith({
    username: signup.username,
    emailAddress: signup.emailAddress,
    password: signup.password,
  });
  expect(verifyEmailCode).not.toHaveBeenCalled();
  await submitAuthSignUpWorkflow(signUp, true, signup);
  expect(verifyEmailCode).toHaveBeenCalledExactlyOnceWith({
    code: signup.code,
  });
  expect(password).toHaveBeenCalledTimes(1);
});

test.each([false, true])(
  "finalization respects pending session tasks (%s)",
  async (pending) => {
    type Navigate = NonNullable<
      Parameters<AuthSignInResource["finalize"]>[0]
    >["navigate"];
    const finalize = vi.fn(async ({ navigate }: { navigate: Navigate }) => {
      // The fixture intentionally models only the session fields read by the callback.
      const args = {
        session: { currentTask: pending ? { key: "setup-mfa" } : null },
        decorateUrl: (url: string) => `${url}?fixture=decorated`,
      };
      await navigate?.(args as unknown as Parameters<NonNullable<Navigate>>[0]);
      return ok;
    });
    const callbacks = { onTask: vi.fn(), navigate: vi.fn() };
    await finalizeAuthWorkflow(
      { finalize } as unknown as AuthSignInResource,
      callbacks,
    );
    if (pending) {
      expect(callbacks.onTask).toHaveBeenCalledOnce();
      expect(callbacks.navigate).not.toHaveBeenCalled();
    } else {
      expect(callbacks.onTask).not.toHaveBeenCalled();
      expect(callbacks.navigate).toHaveBeenCalledExactlyOnceWith(
        "/dashboard?fixture=decorated",
      );
    }
  },
);

test.each<AuthSignInStep>([
  "password",
  "recover",
  "reset-code",
  "new-password",
  "mfa",
])("validation follows the active %s stage", (step) => {
  expect(getSignInFormSchema(step).safeParse({}).success).toBe(false);
  const selected =
    step === "password"
      ? { identifier: values.identifier, password: values.password }
      : step === "recover"
        ? { identifier: values.identifier }
        : step === "new-password"
          ? { password: values.password }
          : { code: values.code };
  expect(getSignInFormSchema(step).safeParse(selected).success).toBe(true);
});

test("sign-up validation requires an email before verification and only a code after", () => {
  expect(
    getSignUpFormSchema(false).safeParse({
      username: "fixture",
      emailAddress: "invalid",
      password: values.password,
    }).success,
  ).toBe(false);
  expect(
    getSignUpFormSchema(true).safeParse({ code: values.code }).success,
  ).toBe(true);
  expect(getSignUpFormSchema(true).safeParse({ code: " " }).success).toBe(
    false,
  );
});
