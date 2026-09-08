import Image from "next/image";
import Link from "next/link";
import { applicationProduct } from "@/content/application";

export function Wordmark({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Link
      href="/"
      aria-label={`${applicationProduct.name} home`}
      className="flex min-w-0 items-center gap-2 no-underline"
    >
      <Image
        src="/favicon.png"
        alt=""
        width={40}
        height={40}
        className="size-10 shrink-0"
      />
      {!collapsed && (
        <span className="min-w-0">
          <span className="block font-display text-xs leading-snug tracking-tight whitespace-nowrap uppercase">
            The Maximal Template™
          </span>
          <span className="block type-caption tracking-widest text-muted-primary uppercase">
            Domain Library
          </span>
        </span>
      )}
    </Link>
  );
}
