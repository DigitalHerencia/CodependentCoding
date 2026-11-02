"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { DoctrineNavGroup } from "@/types/doctrineTypes";

export function DoctrineSidebar({ nav }: { nav: DoctrineNavGroup[] }) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const mobileInput = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();

  function openChapters() {
    dialog.current?.showModal();
    mobileInput.current?.focus();
  }

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    function focusSearch() {
      if (desktop.matches) input.current?.focus();
      else openChapters();
    }
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        focusSearch();
      }
    }
    function onHash() {
      if (window.location.hash === "#chapter-search") focusSearch();
    }
    function onResize() {
      if (desktop.matches && dialog.current?.open) {
        dialog.current.close();
        input.current?.focus();
      }
    }
    onHash();
    window.addEventListener("keydown", onKey);
    window.addEventListener("hashchange", onHash);
    desktop.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hashchange", onHash);
      desktop.removeEventListener("change", onResize);
    };
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

  function chapters(mobile: boolean) {
    const inputId = `${id}-${mobile ? "mobile" : "desktop"}-search`;
    return (
      <nav aria-label="Doctrine" className="text-xs">
        <label className="sr-only" htmlFor={inputId}>
          Search chapter titles
        </label>
        <input
          ref={mobile ? mobileInput : input}
          id={inputId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search… (Ctrl+K)"
          className="mb-4 w-full border border-border bg-background-strong px-3 py-2 text-xs text-foreground focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
        />
        {groups.map((group) => (
          <div className="mb-5" key={group.title}>
            <p className="m-0 mb-2 tracking-[0.2em] text-signal-text uppercase">
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
                      onClick={() => {
                        if (mobile) dialog.current?.close();
                      }}
                      className={cn(
                        "block border-l-2 py-1 pl-3 no-underline transition-colors hover:text-signal-text",
                        active
                          ? "border-signal text-foreground"
                          : "border-transparent text-muted-foreground",
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
          <p className="text-muted-foreground">No matching chapters.</p>
        ) : null}
      </nav>
    );
  }

  return (
    <>
      <div className="docs-chapters-desktop">{chapters(false)}</div>
      <button
        ref={trigger}
        className="docs-chapters-trigger"
        type="button"
        aria-haspopup="dialog"
        aria-controls={`${id}-drawer`}
        onClick={openChapters}
      >
        Chapters <span aria-hidden="true">☰</span>
      </button>
      <dialog
        ref={dialog}
        id={`${id}-drawer`}
        className="docs-chapters-sheet"
        aria-labelledby={`${id}-title`}
        onClose={() => {
          if (!window.matchMedia("(min-width: 1024px)").matches)
            trigger.current?.focus();
        }}
      >
        <div className="docs-chapters-heading">
          <h2 id={`${id}-title`}>Chapters</h2>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label="Close chapters"
          >
            Close ×
          </button>
        </div>
        {chapters(true)}
      </dialog>
    </>
  );
}
