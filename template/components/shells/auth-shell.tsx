"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { LogoLockup } from "@/components/brand/logo-lockup";
import { AuthHeader } from "@/components/nav/auth-header";
import { AuthFooter } from "@/components/nav/auth-footer";
import { authContent } from "@/content/auth";
import { cn } from "@/lib/utils/cn";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  const pathname = usePathname();
  const variant = pathname.startsWith("/sign-up") ? "signUp" : "signIn";
  const formOnLeft = authContent.formPosition[variant] === "left";
  return (
    <main className="auth-layout">
      <section className={cn("auth-panel", formOnLeft && "md:order-2")}>
        <AuthHeader />
        <div className="auth-copy-placement">
          <div className="max-w-xl space-y-5">
            <p className="eyebrow text-muted-primary">{authContent.eyebrow}</p>
            <h1 className="uppercase">{authContent.title}</h1>
            <p className="reading-copy text-foreground/80">
              {authContent.description}
            </p>
          </div>
        </div>
      </section>
      <section
        className={cn(
          "auth-form-column auth-panel bg-primary/10 text-foreground",
          formOnLeft && "md:order-1",
        )}
      >
        <div className="auth-form-placement">
          <div className="w-full max-w-md">
            <div className="auth-brand-placement">
              <LogoLockup size="auth" />
            </div>
            {children}
          </div>
        </div>
        <AuthFooter />
      </section>
    </main>
  );
}
