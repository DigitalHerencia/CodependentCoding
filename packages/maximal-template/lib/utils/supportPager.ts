import type { SupportPager } from "@/types/supportTypes";

/** Preserve normalized filters when constructing adjacent result-page URLs. */
export function supportPager(
  path: string,
  page: number,
  hasMore: boolean,
  filters: Record<string, string | undefined> = {},
): SupportPager {
  const params = new URLSearchParams();
  for (const [name, value] of Object.entries(filters)) {
    if (value) params.set(name, value);
  }
  const href = (target: number) => {
    params.set("page", String(target));
    return `${path}?${params.toString()}`;
  };
  return {
    ...(page > 1 ? { previous: href(page - 1) } : {}),
    ...(hasMore ? { next: href(page + 1) } : {}),
  };
}
