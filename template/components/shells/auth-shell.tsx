import type { ReactNode } from "react";

import { Wordmark } from "@/components/brand/wordmark";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="grid min-h-dvh grid-cols-1 md:grid-cols-2">
      <section className="hidden border-r bg-background p-8 md:flex md:flex-col md:justify-between">
        <Wordmark />
        <div className="max-w-xl space-y-4">
          <p className="eyebrow text-sm text-primary">On Security</p>
          <h1>We take security very seriously.</h1>
          <p className="text-foreground">
            Our policies do not put people&apos;s data at risk. Their PII
            already got leaked...just not by us.
          </p>
        </div>
      </section>
      <section className="flex min-h-dvh items-center justify-center">
        {children}
      </section>
    </main>
  );
}
