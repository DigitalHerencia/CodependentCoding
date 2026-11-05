import { useClerk } from "@clerk/nextjs";

export function useClerkAccount() {
  const { openUserProfile, signOut } = useClerk();
  return { openUserProfile, signOut };
}
