"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { cloneElement, type ReactElement, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { archiveContact, updateContact } from "@/lib/actions/crmActions";
import { contactFormSchema } from "@/schemas/crmSchemas";
import type {
  ContactFormValues,
  ContactStatus,
  CrmContactDTO,
  EditableContactStatus,
} from "@/types/crmTypes";

export function ContactEditForm({ contact }: { contact: CrmContactDTO }) {
  const router = useRouter();
  const [actionError, setActionError] = useState<string | null>(null);
  const [currentUpdatedAt, setCurrentUpdatedAt] = useState(contact.updatedAt);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email ?? "",
      phone: contact.phone ?? "",
      title: contact.title ?? "",
      status: toEditableStatus(contact.status),
    },
  });

  const submit = handleSubmit(async (values) => {
    setActionError(null);
    try {
      const updated = await updateContact({
        ...values,
        contactId: contact.id,
        expectedUpdatedAt: currentUpdatedAt,
      });
      setCurrentUpdatedAt(updated.updatedAt);
      reset({
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email ?? "",
        phone: updated.phone ?? "",
        title: updated.title ?? "",
        status: toEditableStatus(updated.status),
      });
      router.push(`/crm/contacts/${updated.id}`);
      router.refresh();
    } catch (cause) {
      setActionError(
        cause instanceof Error
          ? cause.message
          : "Unable to update the contact.",
      );
    }
  });

  const archive = async () => {
    setActionError(null);
    try {
      await archiveContact({
        contactId: contact.id,
        expectedUpdatedAt: currentUpdatedAt,
      });
      router.push("/crm/contacts");
      router.refresh();
    } catch (cause) {
      setActionError(
        cause instanceof Error
          ? cause.message
          : "Unable to archive the contact.",
      );
    }
  };

  return (
    <form
      onSubmit={(event) => void submit(event)}
      className="max-w-2xl space-y-5 border-3 border-foreground bg-card p-6 shadow-[6px_6px_0px_hsl(var(--shadow-color))]"
    >
      <h1 className="text-2xl font-black uppercase">Edit CRM contact</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <ContactTextField
          id="contact-edit-first-name"
          label="First name"
          error={errors.firstName?.message}
        >
          <Input {...register("firstName")} />
        </ContactTextField>
        <ContactTextField
          id="contact-edit-last-name"
          label="Last name"
          error={errors.lastName?.message}
        >
          <Input {...register("lastName")} />
        </ContactTextField>
        <ContactTextField
          id="contact-edit-email"
          label="Email"
          error={errors.email?.message}
        >
          <Input type="email" {...register("email")} />
        </ContactTextField>
        <ContactTextField
          id="contact-edit-phone"
          label="Phone"
          error={errors.phone?.message}
        >
          <Input {...register("phone")} />
        </ContactTextField>
        <ContactTextField
          id="contact-edit-title"
          label="Title"
          error={errors.title?.message}
        >
          <Input {...register("title")} />
        </ContactTextField>
        <div className="space-y-2">
          <Label htmlFor="contact-edit-status">Status</Label>
          <select
            id="contact-edit-status"
            className="h-11 w-full border-3 border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            {...register("status")}
          >
            <option value="LEAD">Lead</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>
      {actionError ? (
        <p role="alert" className="text-sm font-bold text-destructive">
          {actionError}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="destructive"
          disabled={isSubmitting}
          onClick={() => void archive()}
        >
          Archive contact
        </Button>
      </div>
    </form>
  );
}

function ContactTextField({
  id,
  label,
  children,
  error,
}: {
  id: string;
  label: string;
  children: ReactElement<{ id?: string }>;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {cloneElement(children, { id })}
      {error ? (
        <p className="text-xs font-bold text-destructive">{error}</p>
      ) : null}
    </div>
  );
}

function toEditableStatus(status: ContactStatus): EditableContactStatus {
  return status === "ARCHIVED" ? "INACTIVE" : status;
}
