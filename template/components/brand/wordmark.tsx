import Link from "next/link";

import { applicationProduct } from "@/content/application";

export function Wordmark() {
  const mark = applicationProduct.name.trim().charAt(0).toUpperCase();

  return (
    <Link
      href="/"
      aria-label={`${applicationProduct.name} home`}
      className="flex min-w-0 items-center gap-3 no-underline"
    >
      <span
        aria-hidden="true"
        className="grid size-8 shrink-0 place-items-center border border-primary bg-primary text-sm font-black text-primary-foreground"
      >
        {mark}
      </span>
      <span className="min-w-0 font-display text-2xl leading-none wrap-break-word uppercase">
        {applicationProduct.name}
      </span>
    </Link>
  );
}
