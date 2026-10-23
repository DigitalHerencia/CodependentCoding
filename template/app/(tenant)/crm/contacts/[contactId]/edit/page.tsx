import { CrmEditContactFeature } from "@/features/crm/crmEditContactFeature";

export default async function Page({
  params,
}: {
  params: Promise<{ contactId: string }>;
}) {
  const { contactId } = await params;
  return <CrmEditContactFeature contactId={contactId} />;
}
