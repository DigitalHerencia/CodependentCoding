import type {
  AuthFactor,
  AuthSignInResource,
  AuthSignInStep,
  AuthSignInValues,
  AuthSignUpResource,
  AuthSignUpValues,
} from "@/types/authTypes";

/** Dispatch only the selected credential stage to Clerk's installed Core 3 API. */
export async function submitAuthSignInWorkflow(
  signIn: AuthSignInResource,
  step: AuthSignInStep,
  factor: AuthFactor,
  values: AuthSignInValues,
) {
  if (step === "recover") {
    const result = await signIn.create({ identifier: values.identifier });
    if (result.error) return result;
    return signIn.resetPasswordEmailCode.sendCode();
  }
  if (step === "reset-code")
    return signIn.resetPasswordEmailCode.verifyCode({ code: values.code });
  if (step === "password")
    return signIn.password({
      identifier: values.identifier,
      password: values.password,
    });
  if (step === "new-password")
    return signIn.resetPasswordEmailCode.submitPassword({
      password: values.password,
    });
  if (factor === "totp") return signIn.mfa.verifyTOTP({ code: values.code });
  if (factor === "backup_code")
    return signIn.mfa.verifyBackupCode({ code: values.code });
  if (factor === "phone_code")
    return signIn.mfa.verifyPhoneCode({ code: values.code });
  return signIn.mfa.verifyEmailCode({ code: values.code });
}

/** Local form state never marks a session complete; Clerk owns activation and tasks. */
export function finalizeAuthWorkflow(
  resource: AuthSignInResource | AuthSignUpResource,
  callbacks: { onTask: () => void; navigate: (url: string) => void },
) {
  return resource.finalize({
    navigate: ({ session, decorateUrl }) => {
      if (session.currentTask) {
        callbacks.onTask();
        return;
      }
      callbacks.navigate(decorateUrl("/dashboard"));
    },
  });
}

export function submitAuthSignUpWorkflow(
  signUp: AuthSignUpResource,
  verifying: boolean,
  values: AuthSignUpValues,
) {
  return verifying
    ? signUp.verifications.verifyEmailCode({ code: values.code })
    : signUp.password({
        username: values.username,
        emailAddress: values.emailAddress,
        password: values.password,
      });
}
