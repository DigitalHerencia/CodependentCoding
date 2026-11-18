"use client";
/** Auth New Sign In Form contracts and composition for the owning application slice. */
import type {
  AuthMessage,
  AuthInputTemplateProps,
  AuthPageTemplateProps,
} from "@/types/authTypes";

import { AuthSignInTemplate } from "@/components/templates/auth-templates";
import { getSignInFormSchema } from "@/schemas/authSchemas";
import {
  useAuthSignInWorkflow,
  advanceAuthSignInWorkflow,
  submitAuthSignInWorkflow,
  sendAuthFactorWorkflow,
  resendAuthRecoveryWorkflow,
  resetAuthSignInWorkflow,
  getAuthFactorsWorkflow,
} from "@/lib/workflows/authWorkflows";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useSyncExternalStore } from "react";
import { useForm, useController } from "react-hook-form";
import type { z } from "zod";

import type { AuthSignInStep, AuthFactor } from "@/types/authTypes";

const subscribeToHydration = () => () => {};

/** Own RHF validation and Clerk state; presentation is composed by the auth template. */
export function AuthNewSignInForm() {
  const hasHydrated = useSyncExternalStore<boolean>(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const { signIn, fetchStatus } = useAuthSignInWorkflow();
  const [step, setStep] = useState<AuthSignInStep>("password");
  const [factor, setFactor] = useState<AuthFactor>("email_code");
  const [message, setMessage] = useState<AuthMessage>("");
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
  const { field: codeField } = useController({
    control: form.control,
    name: "code",
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
    await check(await sendAuthFactorWorkflow(signIn, next));
  }

  async function advance() {
    form.resetField("password");
    form.resetField("code");
    const next = await advanceAuthSignInWorkflow(signIn, {
      onTask: () => setManaged(true),
      navigate: (url) => window.location.assign(url),
    });
    if (next.kind === "managed") setManaged(true);
    else if (next.kind === "password") setStep("new-password");
    else if (next.kind === "factor") {
      setStep("mfa");
      setFactor(next.factor);
      await check(next.result);
    } else await check(next.result);
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
      setMessage({ copy: "unableToConnectPleaseTryAgain" });
    }
  }

  const fields: AuthInputTemplateProps[] = [];
  if (step === "password" || step === "recover")
    fields.push({
      ...form.register("identifier"),
      id: "signin-identifier",
      labelKey: "username",
      autoComplete: "username",
      required: true,
      error: form.formState.errors.identifier?.message,
    });
  if (step === "password" || step === "new-password")
    fields.push({
      ...form.register("password"),
      id: "signin-password",
      labelKey: step === "new-password" ? "newPassword" : "password",
      type: showPassword ? "text" : "password",
      autoComplete:
        step === "new-password" ? "new-password" : "current-password",
      required: true,
      error: form.formState.errors.password?.message,
    });
  if (step === "reset-code" || step === "mfa")
    fields.push({
      ...codeField,
      onValueChange: codeField.onChange,
      id: "signin-code",
      labelKey:
        step === "mfa" && factor === "backup_code"
          ? "backupCode"
          : "verificationCode",
      autoComplete: "one-time-code",
      inputMode: factor === "backup_code" ? "text" : "numeric",
      required: true,
      error: form.formState.errors.code?.message,
    });
  const actions: NonNullable<AuthPageTemplateProps["actions"]> = [];
  if (step === "password")
    actions.push({
      key: "recover",
      label: "forgotPassword",
      onClick: () => {
        form.reset();
        setStep("recover");
        setMessage("");
      },
    });
  if (
    step === "reset-code" ||
    (step === "mfa" && ["email_code", "phone_code"].includes(factor))
  )
    actions.push({
      key: "resend",
      label: "resendCode",
      onClick: async () => {
        setMessage("");
        try {
          if (step === "reset-code")
            await check(await resendAuthRecoveryWorkflow(signIn));
          else await sendFactor(factor);
        } catch {
          setMessage({ copy: "unableToSendACodePleaseTryAgain" });
        }
      },
    });
  if (step !== "password")
    actions.push({
      key: "reset",
      label: "backToSignIn",
      onClick: async () => {
        try {
          await resetAuthSignInWorkflow(signIn);
          form.reset();
          setMessage("");
          setStep("password");
        } catch {
          setMessage({ copy: "unableToConnectPleaseTryAgain" });
        }
      },
    });
  return (
    <AuthSignInTemplate
      fields={fields}
      busy={busy}
      managed={managed}
      message={message}
      actions={actions}
      onSubmit={form.handleSubmit(submit)}
      titleKey={
        step === "password"
          ? "welcomeBack"
          : step === "mfa"
            ? "verifyYourIdentity"
            : "resetYourPassword"
      }
      descriptionKey={
        step === "password"
          ? "enterYourUsernameAndPasswordToContinue"
          : step === "recover"
            ? "enterYourUsernameToReceiveARecoveryCodeAt"
            : step === "new-password"
              ? "chooseANewPassword"
              : "enterYourVerificationCodeToContinue"
      }
      submitKey={
        step === "password"
          ? "signIn"
          : step === "recover"
            ? "sendRecoveryCode"
            : "continue"
      }
      shown={showPassword}
      onTogglePassword={() => setShowPassword(!showPassword)}
      factors={
        step === "mfa"
          ? getAuthFactorsWorkflow(signIn)
              .filter((strategy) => strategy !== factor)
              .map((strategy) => ({
                factor: strategy,
                onClick: async () => {
                  setMessage("");
                  try {
                    await sendFactor(strategy);
                  } catch {
                    setMessage({
                      copy: "unableToSwitchVerificationMethodsPleaseTryAgain",
                    });
                  }
                },
              }))
          : []
      }
    />
  );
}
