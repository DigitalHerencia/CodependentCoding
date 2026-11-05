import { useClerk } from "@clerk/nextjs";

export function useClerkAccount() {
  const { openUserProfile, signOut } = useClerk();
  return { openUserProfile, signOut };
}

export { useReverification as useAdminReverification } from "@clerk/nextjs";

export { SignIn, SignUp, useSignIn, useSignUp } from "@clerk/nextjs";
