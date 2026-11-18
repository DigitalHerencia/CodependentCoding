/** Auth route orchestration shared safely across server entry and browser forms. */
import {
  guardAuthEntryAction,
  loadOwnAuthProfileAction,
  requireAuthIdentityAction,
} from "@/lib/actions/authActions";
import { clearPwaAccountCachesWorkflow } from "@/lib/workflows/pwaClientWorkflows";
import {
  useSignIn,
  useSignUp,
  useClerk,
} from "@/lib/integrations/clerk/client";
import type { NextRequest } from "next/server";
import type {
  AuthSignInTransition,
  AuthSignUpTransition,
  AuthFactor,
  AuthSignInResource,
  AuthSignInStep,
  AuthSignInValues,
  AuthSignUpResource,
  AuthSignUpValues,
  AuthFinalizeCallbacks,
  ClerkWebhookDependencies,
} from "@/types/authTypes";

/** Resolve the sign-in route's identity guard through a server-only action. */
export async function guardAuthEntryWorkflow() {
  await guardAuthEntryAction();
}
/** Provider hooks stay behind the auth workflow API. */
export function useAuthSignInWorkflow() {
  return useSignIn();
}
/** Provider hooks stay behind the auth workflow API. */
export function useAuthSignUpWorkflow() {
  return useSignUp();
}
/** Dispatch the current sign-in, recovery, or verification stage to Clerk. */
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
/** Clerk activates the session; the destination renders mandatory local onboarding. */
export function finalizeAuthWorkflow(
  resource: AuthSignInResource | AuthSignUpResource,
  callbacks: AuthFinalizeCallbacks,
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
/** Create or verify the sign-up attempt without provider-owned profile fields. */
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
/** Send only an explicitly selected provider-supported verification code. */
export async function sendAuthFactorWorkflow(
  signIn: AuthSignInResource,
  factor: AuthFactor,
) {
  if (factor === "email_code") return signIn.mfa.sendEmailCode();
  if (factor === "phone_code") return signIn.mfa.sendPhoneCode();
  return { error: null };
}
/** Resend recovery verification through the same installed provider API. */
export function resendAuthRecoveryWorkflow(signIn: AuthSignInResource) {
  return signIn.resetPasswordEmailCode.sendCode();
}
/** Reset the provider attempt when returning to initial sign-in. */
export function resetAuthSignInWorkflow(signIn: AuthSignInResource) {
  return signIn.reset();
}
/** Request email verification after Clerk accepts the sign-up details. */
export function sendAuthSignUpCodeWorkflow(signUp: AuthSignUpResource) {
  return signUp.verifications.sendEmailCode();
}
/** Invitation routes authenticate independently of local profile completion. */
export async function loadInvitationAcceptanceWorkflow(
  params: Promise<{ token: string }>,
) {
  await requireAuthIdentityAction();
  return params;
}
/** Verify first, then claim and commit using server-owned, injected capabilities. */
export async function handleClerkWebhookWorkflow(
  request: NextRequest,
  dependencies: ClerkWebhookDependencies,
) {
  const payload = await request.clone().text();
  let event;
  try {
    event = await dependencies.verify(request);
  } catch {
    return Response.json(
      { error: "Invalid Clerk webhook signature." },
      { status: 400 },
    );
  }
  const eventId = request.headers.get("svix-id");
  if (!eventId)
    return Response.json(
      { error: "The svix-id header is required." },
      { status: 400 },
    );
  let claimed: string | null = null;
  try {
    claimed = await dependencies.claim(eventId, event.type, payload);
    if (!claimed) return Response.json({ received: true, duplicate: true });
    const projection = await dependencies.project(event);
    await dependencies.commit(event, projection, claimed);
    return Response.json({ received: true, duplicate: false });
  } catch (error) {
    if (dependencies.isConflict(error))
      return Response.json(
        { error: "Clerk webhook event identity conflict." },
        { status: 409 },
      );
    if (claimed) {
      try {
        await dependencies.fail(claimed);
      } catch {
        console.error("Clerk webhook failure recording failed");
      }
    }
    console.error("Clerk webhook processing failed");
    return Response.json(
      { error: "Clerk webhook processing failed." },
      { status: 500 },
    );
  }
}

/** Project supported verification factors for the current sign-in attempt. */
export function getAuthFactorsWorkflow(
  signIn: AuthSignInResource,
): AuthFactor[] {
  return (signIn.supportedSecondFactors ?? []).flatMap(({ strategy }) =>
    strategy === "totp" ||
    strategy === "email_code" ||
    strategy === "phone_code" ||
    strategy === "backup_code"
      ? [strategy]
      : [],
  );
}
/** Compose post-submit sign-in transitions and provider-owned session tasks. */
export async function advanceAuthSignInWorkflow(
  signIn: AuthSignInResource,
  callbacks: AuthFinalizeCallbacks,
): Promise<AuthSignInTransition> {
  if (signIn.status === "complete")
    return {
      kind: "finalize",
      result: await finalizeAuthWorkflow(signIn, callbacks),
    };
  if (signIn.status === "needs_new_password") return { kind: "password" };
  if (
    signIn.status === "needs_second_factor" ||
    signIn.status === "needs_client_trust"
  ) {
    const factor = getAuthFactorsWorkflow(signIn)[0];
    if (factor)
      return {
        kind: "factor",
        factor,
        result: await sendAuthFactorWorkflow(signIn, factor),
      };
  }
  return { kind: "managed" };
}
/** Compose email verification or session activation after accepted sign-up input. */
export async function advanceAuthSignUpWorkflow(
  signUp: AuthSignUpResource,
  callbacks: AuthFinalizeCallbacks,
): Promise<AuthSignUpTransition> {
  if (signUp.status === "complete")
    return {
      kind: "finalize",
      result: await finalizeAuthWorkflow(signUp, callbacks),
    };
  if (
    signUp.missingFields.length === 0 &&
    signUp.unverifiedFields.includes("email_address")
  )
    return { kind: "verify", result: await sendAuthSignUpCodeWorkflow(signUp) };
  return { kind: "managed" };
}

/** Read the caller's local profile through the authenticated auth boundary. */
export async function loadAuthAccountWorkflow() {
  return { profile: await loadOwnAuthProfileAction() };
}

/** Retain secure PWA cache clearing before Clerk signs out the identity. */
export function useAuthAccountWorkflow() {
  const { openUserProfile, signOut } = useClerk();
  return {
    onManageAccount: () => openUserProfile(),
    onSignOut: async () => {
      await clearPwaAccountCachesWorkflow();
      await signOut({ redirectUrl: "/sign-in" });
    },
  };
}
