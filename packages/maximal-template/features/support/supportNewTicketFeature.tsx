import { SupportUnavailableTemplate } from "@/components/templates/support-templates";
import { SupportNewTicketForm } from "@/features/support/supportNewTicketForm";
import { loadSupportCapabilitiesWorkflow } from "@/lib/workflows/supportWorkflows";

/** Load the authorized new ticket view. */
export async function SupportNewTicketFeature() {
  const result = await loadSupportCapabilitiesWorkflow();
  if (!result.ok)
    return (
      <SupportUnavailableTemplate page="newTicket" code={result.error.code} />
    );
  if (!result.data.canCreateTicket)
    return <SupportUnavailableTemplate page="newTicket" code="FORBIDDEN" />;
  return <SupportNewTicketForm />;
}
