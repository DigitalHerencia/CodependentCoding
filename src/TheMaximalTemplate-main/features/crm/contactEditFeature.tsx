import { notFound } from "next/navigation";

import { getContactById } from "@/lib/fetchers/crmFetchers";
import { contactIdSchema } from "@/schemas/crmSchemas";

import { ContactEditForm } from "./contactEditForm";

export async function ContactEditFeature({ contactId }: { contactId: string }) {
  const parsedId = contactIdSchema.safeParse(contactId);
  if (!parsedId.success) notFound();

  const contact = await getContactById(parsedId.data);
  if (!contact) notFound();

  return <ContactEditForm contact={contact} />;
}
