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
          <div className="max-w-xl space-y-4 uppercase">
            <p className="eyebrow text-lg text-primary">
              {authContent.eyebrow}
            </p>
            <h1 className="uppercase">{authContent.title}</h1>
            <p className="text-foreground/80">{authContent.description}</p>
          </div>
        </div>
      </section>
      <section
        className={cn(
          "auth-form-column flex min-w-0 flex-col bg-primary text-foreground",
          formOnLeft && "md:order-1",
        )}
      >
        <div className="mt-28 flex flex-1 flex-col items-center justify-center px-6 pb-8 md:p-12">
          <div className="w-full max-w-md">
            <div className="mb-2 flex scale-125 justify-center">
              <LogoLockup />
            </div>
            {children}
          </div>
        </div>
        <AuthFooter />
      </section>
    </main>
  );
}
