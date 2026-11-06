import { loadCrmLeadsWorkflow } from "@/lib/workflows/crmWorkflows";
import { CrmContactsFeatureClient } from "./crm-contacts-feature.client";

export async function CrmLeadsFeature() {
  const { contacts } = await loadCrmLeadsWorkflow();
  return <CrmContactsFeatureClient contacts={contacts} lead />;
}
