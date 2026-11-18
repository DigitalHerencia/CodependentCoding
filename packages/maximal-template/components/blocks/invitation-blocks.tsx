/** Invitation blocks contracts and composition for the owning application slice. */
import { formResultCopy } from "@/content/application";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { invitationContent as copy } from "@/content/invitations";
import type {
  InvitationCreateProps,
  InvitationEmailFieldProps,
  InvitationRoleFieldProps,
  InvitationFormProps,
  InvitationListProps,
} from "@/types/invitationTypes";

/** Adapt BoldKit's labelled form surfaces; RHF and real invitation commands live in features/workflows. */
export function InvitationEmailFieldBlock({
  error,
  ...input
}: InvitationEmailFieldProps) {
  const id = input.id ?? "invite-email";
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>{copy.email}</FieldLabel>
      <Input
        {...input}
        id={id}
        type="email"
        autoComplete="email"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </Field>
  );
}

/** Render the supported invitation roles using the form-owned native binding. */
export function InvitationRoleFieldBlock({
  error,
  roles,
  ...input
}: InvitationRoleFieldProps) {
  const id = input.id ?? "invite-role";
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>{copy.role}</FieldLabel>
      <NativeSelect
        {...input}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        {roles.map((role) => (
          <NativeSelectOption key={role} value={role}>
            {role}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </Field>
  );
}

/** Present a create or edit invitation form while the feature owns form state. */
export function InvitationCreateBlock({
  failure,
  onSubmit,
  busy,
  children,
  error,
  link,
  editing,
  onCancel,
}: InvitationCreateProps) {
  return (
    <form
      method="post"
      onSubmit={onSubmit}
      noValidate
      className="space-y-3 surface-card p-5"
      aria-busy={busy}
    >
      <h2 className="type-heading">{editing ? copy.editTitle : copy.title}</h2>
      <p>{editing ? copy.editInstructions : copy.instructions}</p>
      <fieldset disabled={busy} className="space-y-3">
        {children}
      </fieldset>
      {(failure || error) && (
        <FieldError>
          {failure === "invalid"
            ? copy.invalid
            : failure === "failed"
              ? formResultCopy.failed
              : error}
        </FieldError>
      )}
      {link && (
        <p role="status">
          {copy.share} <code className="break-all">{link}</code>
        </p>
      )}
      <Button type="submit" disabled={busy}>
        {editing ? copy.save : copy.submit}
      </Button>
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={onCancel}
        >
          {copy.cancelEdit}
        </Button>
      )}
    </form>
  );
}

/** A token is retained in RHF state, never copied into visible presentation or error messages. */
export function InvitationAcceptanceBlock({
  failure,
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
      {(failure || error) && (
        <FieldError>
          {failure === "invalid"
            ? copy.invalid
            : failure === "failed"
              ? formResultCopy.failed
              : error}
        </FieldError>
      )}
      <Button type="submit" disabled={busy}>
        {copy.accept}
      </Button>
    </form>
  );
}

/** Render live pending invitations with edit and cancel commands. */
export function InvitationsBlock({
  invitations,
  pending,
  error,
  onRevoke,
  onEdit,
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
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() => onEdit(invitation)}
              >
                {copy.edit}
              </Button>
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
      {error && <p role="alert">{copy.revokeFailed}</p>}
    </div>
  );
}

/** Render the invitation skeleton directly for Suspense boundaries. */
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
