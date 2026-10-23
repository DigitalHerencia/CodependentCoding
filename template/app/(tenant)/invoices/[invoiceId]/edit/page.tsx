import { Suspense } from "react";

import { InvoiceEditFeature } from "@/features/invoicing/invoiceEditFeature";
import { InvoiceFormSkeleton } from "@/features/invoicing/invoiceFormSkeleton";

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
