import { Button } from "@/components/ui/button";
import { SignedInControl, SignedOutControl, SignInButtonControl } from "@/lib/auth/components";

// Features orchestrate blocks and lib helpers; they never import raw UI primitives.
export function OnboardingFeature() {
  return (
    <section className="mx-auto w-full max-w-3xl space-y-6 px-6 py-12">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-widest">
          Application workspace
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Workspace setup</h1>
        <p className="text-muted-foreground">
          Clerk authenticates the user. Organizations, memberships, roles, and
          tenant selection belong to the application database.
        </p>
      </header>
      <div className="border-3 border-foreground bg-card p-5">
        <SignedOutControl>
          <p className="mb-4 text-sm text-muted-foreground">
            The template remains publicly browsable. Sign in only to exercise
            authenticated application behavior.
          </p>
          <SignInButtonControl>
            <Button type="button">Sign in</Button>
          </SignInButtonControl>
        </SignedOutControl>
        <SignedInControl>
          <p className="text-sm">
            Your application-owned workspace is resolved from your local
            membership after authentication.
          </p>
        </SignedInControl>
      </div>
    </section>
  );
}
