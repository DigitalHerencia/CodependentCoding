import { SignedInControl, SignedOutControl, UserProfileControl } from "@/lib/auth/components";

export function ProfileFeature() {
  return (
    <>
      <SignedOutControl>
        <section className="border-3 border-foreground bg-card p-6">
          <h1 className="text-xl font-semibold">Account profile</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This screen is publicly visible in the template. Sign in to open the
            live Clerk user-profile control.
          </p>
        </section>
      </SignedOutControl>
      <SignedInControl>
        <UserProfileControl />
      </SignedInControl>
    </>
  );
}
