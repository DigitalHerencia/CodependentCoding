"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { DoctrineNavGroup } from "@/types/doctrineTypes";

export function DoctrineSidebar({ nav }: { nav: DoctrineNavGroup[] }) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        input.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const needle = query.trim().toLowerCase();
  const groups = nav
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.title.toLowerCase().includes(needle),
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <nav aria-label="Doctrine" className="text-xs">
      <label className="sr-only" htmlFor="doctrine-search">
        Search the doctrine
      </label>
      <input
        ref={input}
        id="doctrine-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search… (Ctrl+K)"
        className="mb-4 w-full border border-signal-border bg-background-strong px-3 py-2 text-xs text-foreground focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
      />
      {groups.map((group) => (
        <div className="mb-5" key={group.title}>
          <p className="m-0 mb-2 tracking-[0.2em] text-signal uppercase">
            {group.title}
          </p>
          <ul className="m-0 list-none space-y-1 p-0">
            {group.items.map((item) => {
              const href = item.slug ? `/doctrine/${item.slug}` : "/doctrine";
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href as `/doctrine/${string}`}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block border-l-2 py-1 pl-3 no-underline transition-colors hover:text-signal",
                      active
                        ? "border-signal text-foreground"
                        : "border-transparent text-foreground-muted",
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      {groups.length === 0 ? (
        <p className="text-foreground-muted">
          Nothing matches. Nothing ever truly does.
        </p>
      ) : null}
    </nav>
  );
}
