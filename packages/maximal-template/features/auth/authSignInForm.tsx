"use client";

import {
  AuthInputBlock,
  AuthPasswordToggleBlock,
} from "@/components/blocks/auth-blocks";
import { AuthFormTemplate } from "@/components/templates/auth-templates";
import { Button } from "@/components/ui/button";
import {
  authAppearance,
  authPresentationCopy,
  authRemainingCopy,
} from "@/content/auth";
import { SignIn, useSignIn } from "@clerk/nextjs";
import { getSignInFormSchema } from "@/schemas/authSchemas";
import {
  finalizeAuthWorkflow,
  submitAuthSignInWorkflow,
} from "@/lib/workflows/authClientWorkflows";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import type { AuthSignInStep, AuthFactor } from "@/types/authTypes";

const subscribeToHydration = () => () => {};

/** Own RHF validation and Clerk state; presentation is composed by the auth template. */
export function AuthSignInForm() {
  const hasHydrated = useSyncExternalStore<boolean>(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const { signIn, fetchStatus } = useSignIn();
  const [step, setStep] = useState<AuthSignInStep>("password");
  const [factor, setFactor] = useState<AuthFactor>("email_code");
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
  const busy =
    !hasHydrated || fetchStatus === "fetching" || form.formState.isSubmitting;

  async function check(result: { error: { message: string } | null }) {
    if (result.error) {
      setMessage(result.error.message);
      return false;
    }
    return true;
  }

  async function sendFactor(next: AuthFactor) {
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
        await finalizeAuthWorkflow(signIn, {
          onTask: () => setManaged(true),
          navigate: (url) => window.location.assign(url),
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
      await sendFactor(supported.strategy as AuthFactor);
    } else {
      // Clerk retains ownership of future instance requirements and session tasks.
      setManaged(true);
    }
  }

  async function submit(values: z.output<typeof schema>) {
    setMessage("");
    try {
      const result = await submitAuthSignInWorkflow(
        signIn,
        step,
        factor,
        values,
      );
      if (!(await check(result))) return;
      if (step === "recover") setStep("reset-code");
      else if (step === "reset-code") setStep("new-password");
      else await advance();
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
    <AuthFormTemplate
      action="/sign-in"
      busy={busy}
      onSubmit={form.handleSubmit(submit)}
      footer={
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
      }

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
      {(step === "password" || step === "recover") && (
        <Controller
          name={"identifier"}
          control={form.control}
          render={({ field, fieldState }) => (
            <AuthInputBlock
              {...field}
              id="signin-username"
              label={authPresentationCopy.username}
              autoComplete="username"
              required
              value={field.value ?? ""}
              invalid={fieldState.invalid}
              error={fieldState.error?.message}
            />
          )}
        />
      )}
      {(step === "password" || step === "new-password") && (
        <Controller
          name={"password"}
          control={form.control}
          render={({ field, fieldState }) => (
            <AuthInputBlock
              {...field}
              id="signin-password"
              label={
                step === "new-password"
                  ? authPresentationCopy.newPassword
                  : authPresentationCopy.password
              }
              type={showPassword ? "text" : "password"}
              autoComplete={
                step === "new-password" ? "new-password" : "current-password"
              }
              required
              value={field.value ?? ""}
              invalid={fieldState.invalid}
              error={fieldState.error?.message}
              labelAction={
                <AuthPasswordToggleBlock
                  shown={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                />
              }
            />
          )}
        />
      )}
      {(step === "reset-code" || step === "mfa") && (
        <Controller
          name={"code"}
          control={form.control}
          render={({ field, fieldState }) => (
            <AuthInputBlock
              {...field}
              id="signin-code"
              label={
                factor === "backup_code" && step === "mfa"
                  ? authPresentationCopy.backupCode
                  : authPresentationCopy.verificationCode
              }
              autoComplete="one-time-code"
              inputMode={factor === "backup_code" ? "text" : "numeric"}
              required
              value={field.value ?? ""}
              invalid={fieldState.invalid}
              error={fieldState.error?.message}
            />
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
        (step === "mfa" && ["email_code", "phone_code"].includes(factor))) && (
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
              setMessage(authPresentationCopy.unableToSendACodePleaseTryAgain);
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
                ["totp", "email_code", "phone_code", "backup_code"].includes(
                  strategy,
                ),
            )
            .map(({ strategy }) => (
              <Button
                key={strategy}
                type="button"
                variant="link"
                onClick={async () => {
                  setMessage("");
                  try {
                    await sendFactor(strategy as AuthFactor);
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
    </AuthFormTemplate>
  );
}
