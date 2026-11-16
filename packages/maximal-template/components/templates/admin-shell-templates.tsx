import {
  AdminErrorBlock,
  AdminLoadingBlock,
} from "@/components/blocks/admin-shell-blocks";

/** Keep route-group fallback presentation independent from administration data pages. */
export function AdminLoadingTemplate({ label }: { label?: string }) {
  return <AdminLoadingBlock {...(label ? { label } : {})} />;
}

export function AdminErrorTemplate({ onRetry }: { onRetry: () => void }) {
  return <AdminErrorBlock onRetry={onRetry} />;
}
