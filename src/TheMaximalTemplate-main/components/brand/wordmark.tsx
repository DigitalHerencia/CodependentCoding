import Link from "next/link";

import { site } from "@/content/site";

export function Wordmark() {
  const mark = site.name.trim().charAt(0).toUpperCase();

  return (
    <Link href="/" className="flex items-center gap-3 no-underline">
      <span className="grid size-8 place-items-center border border-primary bg-primary text-sm font-black text-primary-foreground">
        {mark}
      </span>
      <span className="font-display text-2xl leading-none uppercase">
        {site.name}
      </span>
    </Link>
  );
}
