import { InvoiceEditorFeature } from "@/features/invoicing/invoiceEditorFeature";

// URL ownership stops here; orchestration is delegated to the feature.
export default function Page() {
  return <InvoiceEditorFeature />;
}
