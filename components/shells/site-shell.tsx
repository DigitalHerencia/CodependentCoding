import Image from "next/image";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/nav/site-footer";
import { SiteHeader } from "@/components/nav/site-header";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="site-canvas">
      <SiteHeader />
      <div className="site-content">{children}</div>
      <div className="site-horizon" aria-hidden="true">
        <Image
          src="/digital-herencia-desert-bg.avif"
          alt=""
          width={1920}
          height={1097}
          sizes="100vw"
          unoptimized
        />
      </div>
      <SiteFooter />
    </div>
  );
}
