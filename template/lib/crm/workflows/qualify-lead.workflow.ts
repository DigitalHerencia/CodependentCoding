import { updateContactWorkflow } from "../../crm/crmWorkflows";
import { getContactById } from "../../fetchers/crmFetchers";

export async function qualifyLeadWorkflow(contactId: string) {
  const contact = await getContactById(contactId);
  if (!contact) throw new Error("CRM lead was not found.");
  if (contact.status !== "LEAD") {
    throw new Error("Only a lead can be qualified.");
  }
  return updateContactWorkflow({
    contactId: contact.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
    title: contact.title,
    status: "ACTIVE",
    expectedUpdatedAt: new Date(contact.updatedAt),
  });
}
