"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

/** Serialized, validated CRM URL state passed from a server workflow. */
export type CrmSearchState = {
  q: string;
  page: number;
  pageSize: number;
  sort: string;
  status?: string | undefined;
  stage?: string | undefined;
};

/**
 * Keep transient input state in the browser while server workflows own
 * validated query results. Debounce text search; filters and paging are immediate.
 */
export function useCrmSearch(criteria: CrmSearchState, mode: "accounts" | "contacts" | "leads" | "pipeline") {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [query, setQuery] = useState(criteria.q);
  const [pending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function navigate(values: Record<string, string | number | undefined>) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(values)) {
      if (value === undefined || value === "") next.delete(key);
      else next.set(key, String(value));
    }
    const suffix = next.toString();
    startTransition(() => router.replace(suffix ? pathname + "?" + suffix : pathname, { scroll: false }));
  }

  function onQueryChange(value: string) {
    setQuery(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => navigate({ q: value.trim(), page: 1 }), 300);
  }
  function onSortChange(sort: string) {
    if (timer.current) clearTimeout(timer.current);
    navigate({ sort, q: query.trim(), page: 1 });
  }
  function onFilterChange(filter: string) {
    if (timer.current) clearTimeout(timer.current);
    navigate({ [mode === "pipeline" ? "stage" : "status"]: filter, q: query.trim(), page: 1 });
  }
  function onPageChange(page: number) {
    if (timer.current) clearTimeout(timer.current);
    navigate({ page, q: query.trim() });
  }

  return { query, pending, onQueryChange, onSortChange, onFilterChange, onPageChange };
}
