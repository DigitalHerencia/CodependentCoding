"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { cloneElement, type ReactElement, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createContact } from "@/lib/actions/crmActions";
import { contactFormSchema } from "@/schemas/crmSchemas";
import type { ContactFormValues } from "@/types/crmTypes";

export function ContactNewForm() {
  const router = useRouter();
  const [actionError, setActionError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      title: "",
      status: "LEAD",
    },
  });

  const submit = handleSubmit(async (values) => {
    setActionError(null);
    try {
      const contact = await createContact(values);
      router.push(`/crm/contacts/${contact.id}`);
      router.refresh();
    } catch (cause) {
      setActionError(
        cause instanceof Error
          ? cause.message
          : "Unable to create the contact.",
      );
    }
  });

  return (
    <form
      onSubmit={(event) => void submit(event)}
      className="max-w-2xl space-y-5 border-3 border-foreground bg-card p-6 shadow-[6px_6px_0px_hsl(var(--shadow-color))]"
    >
      <h1 className="text-2xl font-black uppercase">New CRM contact</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <ContactTextField
          label="First name"
          error={errors.firstName?.message}
          input={<Input {...register("firstName")} />}
        />
        <ContactTextField
          label="Last name"
          error={errors.lastName?.message}
          input={<Input {...register("lastName")} />}
        />
        <ContactTextField
          label="Email"
          error={errors.email?.message}
          input={<Input type="email" {...register("email")} />}
        />
        <ContactTextField
          label="Phone"
          error={errors.phone?.message}
          input={<Input {...register("phone")} />}
        />
        <ContactTextField
          label="Title"
          error={errors.title?.message}
          input={<Input {...register("title")} />}
        />
        <div className="space-y-2">
          <Label htmlFor="contact-new-status">Status</Label>
          <select
            id="contact-new-status"
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
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating…" : "Create contact"}
      </Button>
    </form>
  );
}

function ContactTextField({
  label,
  input,
  error,
}: {
  label: string;
  input: ReactElement<{ id?: string }>;
  error?: string;
}) {
  const id = `contact-new-${label.toLowerCase().replaceAll(" ", "-")}`;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {cloneElement(input, { id })}
      {error ? (
        <p className="text-xs font-bold text-destructive">{error}</p>
      ) : null}
    </div>
  );
}
