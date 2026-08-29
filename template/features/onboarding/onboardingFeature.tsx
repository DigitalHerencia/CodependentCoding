import { Show, SignInButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

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
        <Show when="signed-out">
          <p className="mb-4 text-sm text-muted-foreground">
            The template remains publicly browsable. Sign in only to exercise
            authenticated application behavior.
          </p>
          <SignInButton mode="modal">
            <Button type="button">Sign in</Button>
          </SignInButton>
        </Show>
        <Show when="signed-in">
          <p className="text-sm">
            Your application-owned workspace is resolved from your local
            membership after authentication.
          </p>
        </Show>
      </div>
    </section>
  );
}
