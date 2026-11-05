"use client";
import { authRemainingCopy } from "@/content/auth";

import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { getSignInFormSchema } from "@/schema/authSchemas";

import { authPresentationCopy } from "@/content/auth";
import { SignIn, useSignIn } from "@/lib/auth/clerkAccount";
import Link from "next/link";
import { authAppearance } from "@/content/auth";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AuthFormPanel } from "@/components/blocks/auth-blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

type Step = "password" | "recover" | "reset-code" | "new-password" | "mfa";
type Factor = "email_code" | "phone_code" | "totp" | "backup_code";

export function SignInForm() {
  const { signIn, fetchStatus } = useSignIn();
  const [step, setStep] = useState<Step>("password");
  const [factor, setFactor] = useState<Factor>("email_code");
  const [message, setMessage] = useState("");
  const [managed, setManaged] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const schema = getSignInFormSchema(step);
  const form = useForm<
    z.input<typeof schema>,
    unknown,
    z.output<typeof schema>
  >({
    resolver: zodResolver(schema),
    defaultValues: { identifier: "", password: "", code: "" },
    shouldUnregister: true,
  });
  const busy = fetchStatus === "fetching" || form.formState.isSubmitting;

  async function check(result: { error: { message: string } | null }) {
    if (result.error) {
      setMessage(result.error.message);
      return false;
    }
    return true;
  }

  async function sendFactor(next: Factor) {
    setFactor(next);
    form.resetField("code");
    if (next === "email_code") await check(await signIn.mfa.sendEmailCode());
    if (next === "phone_code") await check(await signIn.mfa.sendPhoneCode());
  }

  async function advance() {
    form.resetField("password");
    form.resetField("code");
    if (signIn.status === "complete") {
      await check(
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session.currentTask) {
              setManaged(true);
              return;
            }
            window.location.assign(decorateUrl("/dashboard"));
          },
        }),
      );
    } else if (signIn.status === "needs_new_password") {
      setStep("new-password");
    } else if (
      signIn.status === "needs_second_factor" ||
      signIn.status === "needs_client_trust"
    ) {
      const supported = signIn.supportedSecondFactors?.find(({ strategy }) =>
        ["totp", "email_code", "phone_code", "backup_code"].includes(strategy),
      );
      if (!supported) {
        setManaged(true);
        return;
      }
      setStep("mfa");
      await sendFactor(supported.strategy as Factor);
    } else {
      // Clerk retains ownership of future instance requirements and session tasks.
      setManaged(true);
    }
  }

  async function submit(values: z.output<typeof schema>) {
    setMessage("");
    try {
      if (step === "recover") {
        if (
          !(await check(await signIn.create({ identifier: values.identifier })))
        )
          return;
        if (await check(await signIn.resetPasswordEmailCode.sendCode()))
          setStep("reset-code");
        return;
      }
      if (step === "reset-code") {
        if (
          await check(
            await signIn.resetPasswordEmailCode.verifyCode({
              code: values.code,
            }),
          )
        )
          setStep("new-password");
        return;
      }
      const result =
        step === "password"
          ? await signIn.password({
              identifier: values.identifier,
              password: values.password,
            })
          : step === "new-password"
            ? await signIn.resetPasswordEmailCode.submitPassword({
                password: values.password,
              })
            : factor === "totp"
              ? await signIn.mfa.verifyTOTP({ code: values.code })
              : factor === "backup_code"
                ? await signIn.mfa.verifyBackupCode({ code: values.code })
                : factor === "phone_code"
                  ? await signIn.mfa.verifyPhoneCode({ code: values.code })
                  : await signIn.mfa.verifyEmailCode({ code: values.code });
      if (await check(result)) await advance();
    } catch {
      setMessage(authPresentationCopy.unableToConnectPleaseTryAgain);
    }
  }

  if (managed)
    return (
      <SignIn
        path="/sign-in"
        routing="path"
        appearance={authAppearance}
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/dashboard"
      />
    );

  return (
    <AuthFormPanel
      title={
        step === "password"
          ? authPresentationCopy.welcomeBack
          : step === "mfa"
            ? authPresentationCopy.verifyYourIdentity
            : authPresentationCopy.resetYourPassword
      }
      description={
        step === "password"
          ? authPresentationCopy.enterYourUsernameAndPasswordToContinue
          : step === "recover"
            ? authPresentationCopy.enterYourUsernameToReceiveARecoveryCodeAt
            : step === "new-password"
              ? authPresentationCopy.chooseANewPassword
              : authPresentationCopy.enterYourVerificationCodeToContinue
      }
    >
      <form
        onSubmit={form.handleSubmit(submit)}
        className="space-y-4"
        aria-busy={busy}
        noValidate
      >
        <fieldset disabled={busy} className="space-y-4 disabled:opacity-70">
          {(step === "password" || step === "recover") && (
            <Controller
              name={"identifier"}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signin-username">
                    {authPresentationCopy.username}
                  </FieldLabel>
                  <Input
                    id="signin-username"
                    autoComplete="username"
                    required
                    {...field}
                    value={field.value ?? ""}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          )}
          {(step === "password" || step === "new-password") && (
            <Controller
              name={"password"}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    <FieldLabel htmlFor="signin-password">
                      {step === "new-password"
                        ? authPresentationCopy.newPassword
                        : authPresentationCopy.password}
                    </FieldLabel>
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      className="h-auto min-h-8 px-0 py-1"
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword
                        ? authPresentationCopy.hidePassword
                        : authPresentationCopy.showPassword}
                    </Button>
                  </div>
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={
                      step === "new-password"
                        ? "new-password"
                        : "current-password"
                    }
                    required
                    {...field}
                    value={field.value ?? ""}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          )}
          {(step === "reset-code" || step === "mfa") && (
            <Controller
              name={"code"}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signin-code">
                    {factor === "backup_code" && step === "mfa"
                      ? authPresentationCopy.backupCode
                      : authPresentationCopy.verificationCode}
                  </FieldLabel>
                  <Input
                    id="signin-code"
                    autoComplete="one-time-code"
                    inputMode={factor === "backup_code" ? "text" : "numeric"}
                    required
                    {...field}
                    value={field.value ?? ""}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          )}
          {message && (
            <p role="alert" className="text-sm leading-relaxed">
              {message}
            </p>
          )}
          <Button type="submit" className="w-full">
            {busy
              ? authPresentationCopy.pleaseWait
              : step === "password"
                ? authPresentationCopy.signIn
                : step === "recover"
                  ? authPresentationCopy.sendRecoveryCode
                  : authPresentationCopy.continue}
          </Button>
          {(step === "reset-code" ||
            (step === "mfa" &&
              ["email_code", "phone_code"].includes(factor))) && (
            <Button
              type="button"
              variant="link"
              className="h-auto min-h-9 px-0 py-1"
              onClick={async () => {
                setMessage("");
                try {
                  if (step === "reset-code")
                    await check(await signIn.resetPasswordEmailCode.sendCode());
                  else await sendFactor(factor);
                } catch {
                  setMessage(
                    authPresentationCopy.unableToSendACodePleaseTryAgain,
                  );
                }
              }}
            >
              {authPresentationCopy.resendCode}
            </Button>
          )}
          {step === "mfa" && (
            <div className="flex flex-wrap gap-2">
              {signIn.supportedSecondFactors
                ?.filter(
                  ({ strategy }) =>
                    strategy !== factor &&
                    [
                      "totp",
                      "email_code",
                      "phone_code",
                      "backup_code",
                    ].includes(strategy),
                )
                .map(({ strategy }) => (
                  <Button
                    key={strategy}
                    type="button"
                    variant="link"
                    onClick={async () => {
                      setMessage("");
                      try {
                        await sendFactor(strategy as Factor);
                      } catch {
                        setMessage(
                          authPresentationCopy.unableToSwitchVerificationMethodsPleaseTryAgain,
                        );
                      }
                    }}
                  >
                    {
                      (
                        {
                          totp: authRemainingCopy.authenticatorApp,
                          email_code: authRemainingCopy.emailCode,
                          phone_code: authRemainingCopy.sMSCode,
                          backup_code: authRemainingCopy.backupCode,
                        } as Record<string, string>
                      )[strategy]
                    }
                  </Button>
                ))}
            </div>
          )}
          {step !== "password" && (
            <Button
              type="button"
              variant="link"
              className="h-auto min-h-9 px-0 py-1"
              onClick={async () => {
                await signIn.reset();
                form.reset();
                setMessage("");
                setStep("password");
              }}
            >
              {authPresentationCopy.backToSignIn}
            </Button>
          )}
        </fieldset>
        <div className="auth-secondary-actions">
          {step === "password" && (
            <Button
              type="button"
              variant="link"
              className="h-auto min-h-9 px-0 py-1"
              onClick={() => {
                form.resetField("password");
                setMessage("");
                setStep("recover");
              }}
            >
              {authPresentationCopy.forgotPassword}
            </Button>
          )}
          <span>
            {authPresentationCopy.newHere}{" "}
            <Link href="/sign-up" className="type-link">
              {authPresentationCopy.createAnAccount}
            </Link>
          </span>
        </div>
      </form>
    </AuthFormPanel>
  );
}
