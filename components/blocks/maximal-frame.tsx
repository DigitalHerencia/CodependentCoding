import type { ReactNode } from "react";
import { PageHero } from "@/components/blocks/page-hero";
import { maximalCopy } from "@/lib/constants/siteCopy";

export function MaximalFrame({ children }: { children: ReactNode }) {
  return (
    <main className="px-4 pb-16">
      <PageHero
        kicker={maximalCopy.kicker}
        title={maximalCopy.title}
        subtitle={maximalCopy.subtitle}
      />
      <p className="site-rise mx-auto max-w-2xl text-center text-sm text-foreground-muted">
        {maximalCopy.line}
      </p>
      <div className="site-rise mt-8">{children}</div>
    </main>
  );
}
