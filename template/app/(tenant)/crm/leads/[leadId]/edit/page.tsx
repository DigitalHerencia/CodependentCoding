import { CrmEditLeadFeature } from "@/features/crm/crmEditLeadFeature";

export default async function Page({
  params,
}: {
  params: Promise<{ leadId: string }>;
}) {
  const { leadId } = await params;
  return <CrmEditLeadFeature leadId={leadId} />;
}
