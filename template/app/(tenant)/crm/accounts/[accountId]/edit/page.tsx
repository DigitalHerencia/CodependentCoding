import { CrmEditAccountFeature } from "@/features/crm/crmEditAccountFeature";

export default async function Page({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await params;
  return <CrmEditAccountFeature accountId={accountId} />;
}
