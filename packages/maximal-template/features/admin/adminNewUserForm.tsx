/** The admin new-user entry delegates RHF and invitation application logic to invitations. */
import { AdminNewUserTemplate } from "@/components/templates/admin-templates";
import { InvitationsNewMemberForm } from "@/features/invitations/invitationsNewMemberForm";

/** Share one invitation form with settings instead of maintaining an approval-only duplicate. */
export function AdminNewUserForm() {
  return (
    <AdminNewUserTemplate>
      <InvitationsNewMemberForm />
    </AdminNewUserTemplate>
  );
}
