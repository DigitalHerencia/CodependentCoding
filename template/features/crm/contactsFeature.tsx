import { PageHeaderBlock } from "@/components/blocks/application-sections";
import { getContacts } from "@/lib/fetchers/crmFetchers";

import { ContactsClientFeature } from "./contactsClientFeature";

export async function ContactsFeature() {
  const contacts = await getContacts({ limit: 200, sort: "name-asc" });

  return (
    <div className="space-y-6">
      <PageHeaderBlock
        eyebrow="CRM"
        title="Contacts"
        description="People associated with accounts in the active organization."
        action={{ label: "New contact", href: "/crm/contacts/new" }}
      />
      <ContactsClientFeature contacts={contacts} />
    </div>
  );
}
