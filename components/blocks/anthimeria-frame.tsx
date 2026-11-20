import type { ReactNode } from "react";
import { PageHero } from "@/components/blocks/page-hero";
import { anthimeriaCopy } from "@/content/public";

export function AnthimeriaFrame({ children }: { children: ReactNode }) {
  return (
    <main className="px-4 pb-16">
      <PageHero
        kicker={anthimeriaCopy.kicker}
        title={anthimeriaCopy.title}
        subtitle={anthimeriaCopy.subtitle}
      />
      <p className="site-rise mx-auto max-w-2xl text-center text-sm text-muted-foreground">
        {anthimeriaCopy.line}
      </p>
      <div className="site-rise mt-8">{children}</div>
    </main>
  );
}
