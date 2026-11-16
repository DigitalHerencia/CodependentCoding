"use client";

import {
  AuthInputBlock,
  AuthPasswordToggleBlock,
} from "@/components/blocks/auth-blocks";
import { AuthFormTemplate } from "@/components/templates/auth-templates";
import { Button } from "@/components/ui/button";
import { authAppearance, authPresentationCopy } from "@/content/auth";
import { SignUp, useSignUp } from "@clerk/nextjs";
import { getSignUpFormSchema } from "@/schemas/authSchemas";
import {
  finalizeAuthWorkflow,
  submitAuthSignUpWorkflow,
} from "@/lib/workflows/authClientWorkflows";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

const subscribeToHydration = () => () => {};

/** Own RHF validation and Clerk state; presentation is composed by the auth template. */
export function AuthSignUpForm() {
  const hasHydrated = useSyncExternalStore<boolean>(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const { signUp, fetchStatus } = useSignUp();
  const [verifying, setVerifying] = useState(false);
  const [managed, setManaged] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const schema = getSignUpFormSchema(verifying);
  const form = useForm<
    z.input<typeof schema>,
    unknown,
    z.output<typeof schema>
  >({
    resolver: zodResolver(schema),
    defaultValues: { username: "", emailAddress: "", password: "", code: "" },
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

  async function advance() {
    form.resetField("password");
    if (signUp.status === "complete") {
      await check(
        await finalizeAuthWorkflow(signUp, {
          onTask: () => setManaged(true),
          navigate: (url) => window.location.assign(url),
        }),
      );
    } else if (
      signUp.missingFields.length === 0 &&
      signUp.unverifiedFields.includes("email_address")
    ) {
      setVerifying(true);
      await check(await signUp.verifications.sendEmailCode());
    } else {
      // Clerk handles additional requirements when template owners change configuration.
      setManaged(true);
    }
  }

  async function submit(values: z.output<typeof schema>) {
    setMessage("");
    try {
      const result = await submitAuthSignUpWorkflow(signUp, verifying, values);
      if (await check(result)) await advance();
    } catch {
      setMessage(authPresentationCopy.unableToConnectPleaseTryAgain);
    }
  }

  if (managed)
    return (
      <SignUp
        path="/sign-up"
        routing="path"
        appearance={authAppearance}
        signInUrl="/sign-in"
        fallbackRedirectUrl="/dashboard"
      />
    );

  return (
    <AuthFormTemplate
      action="/sign-up"
      busy={busy}
      onSubmit={form.handleSubmit(submit)}
      challenge={<div id="clerk-captcha" />}
      footer={
        <div className="auth-secondary-actions">
          <span>
            {authPresentationCopy.alreadyHaveAnAccount}{" "}
            <Link href="/sign-in" className="type-link">
              {authPresentationCopy.signIn}
            </Link>
          </span>
        </div>
      }

      variant="signUp"
      title={
        verifying
          ? authPresentationCopy.verifyYourEmail
          : authPresentationCopy.createAnAccount
      }
      description={
        verifying
          ? authPresentationCopy.enterTheCodeSentToYourEmailAddress
          : authPresentationCopy.setUpYourAccount
      }
    >
      {!verifying ? (
        <>
          <Controller
            name={"username"}
            control={form.control}
            render={({ field, fieldState }) => (
              <AuthInputBlock
                {...field}
                id="signup-username"
                label={authPresentationCopy.username}
                autoComplete="username"
                required
                value={field.value ?? ""}
                invalid={fieldState.invalid}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name={"emailAddress"}
            control={form.control}
            render={({ field, fieldState }) => (
              <AuthInputBlock
                {...field}
                id="signup-email"
                label={authPresentationCopy.email}
                type="email"
                autoComplete="email"
                required
                value={field.value ?? ""}
                invalid={fieldState.invalid}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name={"password"}
            control={form.control}
            render={({ field, fieldState }) => (
              <AuthInputBlock
                {...field}
                id="signup-password"
                label={authPresentationCopy.password}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
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
        </>
      ) : (
        <Controller
          name={"code"}
          control={form.control}
          render={({ field, fieldState }) => (
            <AuthInputBlock
              {...field}
              id="signup-code"
              label={authPresentationCopy.verificationCode}
              autoComplete="one-time-code"
              inputMode="numeric"
              required
              value={field.value ?? ""}
              invalid={fieldState.invalid}
              error={fieldState.error?.message}
            />
          )}
        />
      )}
      {message && (
        <p role="alert" className="text-left text-sm leading-relaxed">
          {message}
        </p>
      )}
      <Button type="submit" className="w-full">
        {busy
          ? authPresentationCopy.pleaseWait
          : verifying
            ? authPresentationCopy.verifyEmail
            : authPresentationCopy.createAccount}
      </Button>
      {verifying && (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="link"
            onClick={async () => {
              setMessage("");
              try {
                if (await check(await signUp.verifications.sendEmailCode()))
                  setMessage(authPresentationCopy.aNewCodeHasBeenSent);
              } catch {
                setMessage(
                  authPresentationCopy.unableToSendACodePleaseTryAgain,
                );
              }
            }}
          >
            {authPresentationCopy.resendCode}
          </Button>
          <Button
            type="button"
            variant="link"
            onClick={async () => {
              await signUp.reset();
              form.reset();
              setMessage("");
              setVerifying(false);
            }}
          >
            {authPresentationCopy.changeAccountDetails}
          </Button>
        </div>
      )}
    </AuthFormTemplate>
  );
}
