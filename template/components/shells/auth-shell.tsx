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
    <main className="grid min-h-dvh grid-cols-1 bg-background text-foreground md:grid-cols-2">
      <section
        className={cn("flex min-w-0 flex-col", formOnLeft && "md:order-2")}
      >
        <AuthHeader />
        <div className="flex flex-1 items-center px-6 pb-8 md:p-12">
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
          "auth-form-column flex min-w-0 flex-col bg-primary/10 text-foreground",
          formOnLeft && "md:order-1",
        )}
      >
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 md:p-12">
          <div className="w-full max-w-md">
            <div className="mb-6 border-b border-foreground/30 pb-4">
              <LogoLockup className="inline-block bg-foreground px-2 py-1 eyebrow text-xs text-background" />
            </div>
            {children}
          </div>
        </div>
        <AuthFooter />
      </section>
    </main>
  );
}
