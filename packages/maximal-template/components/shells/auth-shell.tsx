// components/shells/auth-shell.tsx

import type { ReactNode } from "react";

import { LogoLockup } from "@/components/brand/logo-lockup";
import { AuthFooter } from "@/components/nav/auth-footer";
import { AuthHeader } from "@/components/nav/auth-header";
import { authContent } from "@/content/auth";

/**
 * Split screen: the brand side carries the header (back to the landing) and
 * the headline; the form side carries the page and the footer. Sign-up mirrors
 * sign-in through CSS (`data-auth-variant` on the form panel), not the URL.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="auth-layout">
      <section className="auth-brand-panel auth-panel">
        <AuthHeader />
        <div className="auth-copy-placement">
          <div className="auth-content space-y-5">
            <p className="eyebrow text-muted-primary">{authContent.eyebrow}</p>
            <h1 className="uppercase">{authContent.title}</h1>
            <p className="reading-copy text-foreground/80">
              {authContent.description}
            </p>
          </div>
        </div>
      </section>
      <section className="auth-form-column auth-panel bg-primary/10 text-foreground">
        <div aria-hidden className="auth-header-spacer" />
        <main className="auth-form-placement">
          <div className="auth-content">
            <div className="auth-brand-placement">
              <LogoLockup size="auth" />
            </div>
            {children}
          </div>
        </main>
        <AuthFooter />
      </section>
    </div>
  );
}
