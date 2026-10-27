import type { ReactNode } from "react";
import { PageHero } from "@/components/blocks/page-hero";
import { hipsterStackCopy } from "@/lib/constants/siteCopy";

export function HipsterFrame({ children }: { children: ReactNode }) {
  return (
    <main className="px-4 pb-16">
      <PageHero
        kicker={hipsterStackCopy.kicker}
        title={hipsterStackCopy.title}
        subtitle={hipsterStackCopy.subtitle}
      />
      <p className="site-rise mx-auto max-w-2xl text-center text-sm text-foreground-muted">
        {hipsterStackCopy.line}
      </p>
      <div className="site-rise mt-8">{children}</div>
    </main>
  );
}
