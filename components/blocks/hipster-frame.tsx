import type { ReactNode } from "react";
import { PageHero } from "@/components/blocks/page-hero";
import { hipsterStackCopy } from "@/content/public";

export function HipsterFrame({ children }: { children: ReactNode }) {
  return (
    <main id="main-content" tabIndex={-1} className="px-4 pb-16">
      <PageHero
        kicker={hipsterStackCopy.kicker}
        title={hipsterStackCopy.title}
        subtitle={hipsterStackCopy.subtitle}
      />
      <p className="site-rise mx-auto max-w-2xl text-center text-sm text-muted-foreground">
        {hipsterStackCopy.line}
      </p>
      <div className="site-rise mt-8">{children}</div>
    </main>
  );
}
