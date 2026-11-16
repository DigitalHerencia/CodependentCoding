import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { invitationContent as copy } from "@/content/invitations";
import { invitableRoles } from "@/lib/authz/roles";
import type {
  InvitationCreateProps,
  InvitationFormProps,
  InvitationListProps,
} from "@/types/invitationTypes";
import type { ComponentProps } from "react";

/** Adapt BoldKit's labelled form surfaces; RHF and real invitation commands live in features/workflows. */
export function InvitationEmailFieldBlock({
  error,
  ...input
}: ComponentProps<"input"> & { error?: string | undefined }) {
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor="invite-email">{copy.email}</FieldLabel>
      <Input
        {...input}
        id="invite-email"
        type="email"
        autoComplete="email"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "invite-email-error" : undefined}
      />
      {error && <FieldError id="invite-email-error">{error}</FieldError>}
    </Field>
  );
}

export function InvitationRoleFieldBlock({
  error,
  ...input
}: ComponentProps<"select"> & { error?: string | undefined }) {
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor="invite-role">{copy.role}</FieldLabel>
      <NativeSelect
        {...input}
        id="invite-role"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "invite-role-error" : undefined}
      >
        {invitableRoles.map((role) => (
          <NativeSelectOption key={role} value={role}>
            {role}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      {error && <FieldError id="invite-role-error">{error}</FieldError>}
    </Field>
  );
}

export function InvitationCreateBlock({
  onSubmit,
  busy,
  children,
  error,
  link,
}: InvitationCreateProps) {
  return (
    <form
      method="post"
      onSubmit={onSubmit}
      noValidate
      className="space-y-3 surface-card p-5"
      aria-busy={busy}
    >
      <h2 className="type-heading">{copy.title}</h2>
      <p>{copy.instructions}</p>
      <fieldset disabled={busy} className="space-y-3">
        {children}
      </fieldset>
      {error && <FieldError>{error}</FieldError>}
      {link && (
        <p role="status">
          {copy.share} <code className="break-all">{link}</code>
        </p>
      )}
      <Button type="submit" disabled={busy}>
        {copy.submit}
      </Button>
    </form>
  );
}

/** A token is retained in RHF state, never copied into visible presentation or error messages. */
export function InvitationAcceptanceBlock({
  onSubmit,
  busy,
  error,
}: InvitationFormProps) {
  return (
    <form
      method="post"
      onSubmit={onSubmit}
      noValidate
      className="mx-auto max-w-lg space-y-4 surface-card p-5"
      aria-busy={busy}
    >
      <h1 className="type-title">{copy.joinTitle}</h1>
      <p>{copy.joinDescription}</p>
      {error && <FieldError>{error}</FieldError>}
      <Button type="submit" disabled={busy}>
        {copy.accept}
      </Button>
    </form>
  );
}

export function InvitationsBlock({
  invitations,
  pending,
  error,
  onRevoke,
}: InvitationListProps) {
  return (
    <div className="space-y-2">
      {invitations.length === 0 ? (
        <p>{copy.noInvitations}</p>
      ) : (
        <ul className="divide-y divide-border border border-border">
          {invitations.map((invitation) => (
            <li
              className="flex flex-wrap items-center justify-between gap-2 p-3"
              key={invitation.id}
            >
              <span>
                {invitation.email} {copy.separator} {invitation.role}{" "}
                {copy.expires}{" "}
                {new Date(invitation.expiresAt).toLocaleDateString()}
              </span>
              <Button
                disabled={pending}
                onClick={() => onRevoke(invitation.id)}
                type="button"
                variant="outline"
              >
                {copy.revoke}
              </Button>
            </li>
          ))}
        </ul>
      )}
      {error && <p role="alert">{error}</p>}
    </div>
  );
}

export function InvitationLoadingBlock() {
  return (
    <div role="status" aria-label={copy.loading} className="space-y-4">
      <span className="sr-only">{copy.loading}</span>
      <div aria-hidden className="space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
