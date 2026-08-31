import { Show, UserProfile } from "@clerk/nextjs";

export function ProfileFeature() {
  return (
    <>
      <Show when="signed-out">
        <section className="border-3 border-foreground bg-card p-6">
          <h1 className="text-xl font-semibold">Account profile</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This screen is publicly visible in the template. Sign in to open the
            live Clerk user-profile control.
          </p>
        </section>
      </Show>
      <Show when="signed-in">
        <UserProfile routing="hash" />
      </Show>
    </>
  );
}
