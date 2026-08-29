import {
  PageHeaderBlock,
  RecordDetailBlock,
} from "@/components/blocks/application-sections";
import { notFound } from "next/navigation";

import { getContactById } from "@/lib/fetchers/crmFetchers";
import { contactIdSchema } from "@/schemas/crmSchemas";

export async function ContactDetailFeature({
  contactId,
}: {
  contactId: string;
}) {
  const parsedId = contactIdSchema.safeParse(contactId);
  if (!parsedId.success) notFound();

  const contact = await getContactById(parsedId.data);
  if (!contact) notFound();

  return (
    <div className="space-y-6">
      <PageHeaderBlock
        eyebrow="CRM contact"
        title={`${contact.firstName} ${contact.lastName}`}
        action={{
          label: "Edit contact",
          href: `/crm/contacts/${contact.id}/edit`,
        }}
      />
      <RecordDetailBlock
        title="Contact details"
        status={contact.status}
        items={[
          { label: "Email", value: contact.email ?? "—" },
          { label: "Phone", value: contact.phone ?? "—" },
          { label: "Title", value: contact.title ?? "—" },
          { label: "Account", value: contact.account?.name ?? "Unassigned" },
          { label: "Owner", value: contact.owner?.displayName ?? "Unassigned" },
        ]}
      />
    </div>
  );
}
