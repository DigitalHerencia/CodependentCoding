/** Invitation Presentation.test contracts for the owning application slice. */
import { InvitationLoadingBlock } from "@/components/blocks/invitation-blocks";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import {
  InvitationAcceptanceTemplate,
  InvitationCreateTemplate,
} from "@/components/templates/invitation-templates";
import { invitableRoles } from "@/lib/authz/roles";
import { InvitationRoleFieldBlock } from "@/components/blocks/invitation-blocks";

test("the role picker contains ADMIN/MEMBER/VIEWER and never OWNER", () => {
  const html = renderToStaticMarkup(
    createElement(InvitationRoleFieldBlock, {
      name: "role",
      roles: invitableRoles,
      defaultValue: "MEMBER",
    }),
  );
  for (const role of ["ADMIN", "MEMBER", "VIEWER"])
    expect(html).toContain(`value="${role}"`);
  expect(html).not.toContain("OWNER");
});

test("acceptance renders safe errors and disables duplicate submissions", () => {
  const html = renderToStaticMarkup(
    createElement(InvitationAcceptanceTemplate, {
      onSubmit: () => {},
      busy: true,
      error: "This invitation is not valid for your account.",
    }),
  );
  expect(html).toContain('method="post"');
  expect(html).toContain('aria-busy="true"');
  expect(html).toContain('disabled=""');
  expect(html).toContain("This invitation is not valid for your account.");
  expect(html).not.toContain("tokenHash");
});

test("creation exposes only the one-time path returned by the authorized workflow", () => {
  const html = renderToStaticMarkup(
    InvitationCreateTemplate({
      onSubmit: () => {},
      busy: false,
      link: "https://example.test/invitations/fixture",
      emailField: {
        id: "invite-email",
        name: "email",
        onChange: async () => {},
        onBlur: async () => {},
        ref: () => {},
      },
      roleField: {
        id: "invite-role",
        name: "role",
        onChange: async () => {},
        onBlur: async () => {},
        ref: () => {},
      },
      roles: invitableRoles,
    }),
  );
  expect(html).toContain('role="status"');
  expect(html).toContain("https://example.test/invitations/fixture");
});

test("the invitation route's independent loading state is announced", () => {
  const html = renderToStaticMarkup(createElement(InvitationLoadingBlock));
  expect(html).toContain('aria-label="Loading invitation"');
  expect(html).toContain('aria-hidden="true"');
});
