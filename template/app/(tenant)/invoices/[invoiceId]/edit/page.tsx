import { Suspense } from "react";

import { InvoiceEditFeature } from "@/features/invoicing/invoice-edit-feature";
import { InvoiceFormSkeleton } from "@/features/invoicing/invoice-form-skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;
  return (
    <Suspense fallback={<InvoiceFormSkeleton />}>
      <InvoiceEditFeature invoiceId={invoiceId} />
    </Suspense>
  );
}
