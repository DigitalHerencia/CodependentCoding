import { ErrorBlock } from "@/components/blocks/error-states";

// Global 404 presentation delegates to a reusable block.
export default function NotFound() {
  return <ErrorBlock title="Not found" />;
}
