import { InvoicesFeature } from "@/features/invoicing/invoicesFeature";

// URL ownership stops here; orchestration is delegated to the feature.
export default function Page() {
  return <InvoicesFeature />;
}
