"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createSupportTicket } from "@/lib/actions/supportActions";
import { TicketPriority } from "@/schemas/supportSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export function TicketNewForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ subject: string; description: string; priority: string }>({
    defaultValues: { priority: "NORMAL" },
  });
  return (
    <form
      className="mx-auto max-w-3xl space-y-5 surface-card p-5"
      onSubmit={handleSubmit(async (values) => {
        setError("");
        try {
          const ticket = await createSupportTicket(values);
          router.push(`/support/tickets/${ticket.id}`);
          router.refresh();
        } catch {
          setError(
            "Ticket could not be saved. Check your input and permissions.",
          );
        }
      })}
    >
      <h1 className="type-title">Request support</h1>
      <div className="form-field">
        <Label htmlFor="ticket-subject">Subject</Label>
        <Input
          id="ticket-subject"
          required
          maxLength={300}
          {...register("subject")}
        />
      </div>
      <div className="form-field">
        <Label htmlFor="ticket-description">
          What happened, and what did you expect?
        </Label>
        <textarea
          id="ticket-description"
          className="control-field min-h-48"
          maxLength={30000}
          {...register("description")}
        />
      </div>
      <div className="form-field">
        <Label htmlFor="ticket-priority">Priority</Label>
        <select
          id="ticket-priority"
          className="control-field"
          {...register("priority")}
        >
          {Object.values(TicketPriority).map((priority) => (
            <option key={priority}>{priority}</option>
          ))}
        </select>
      </div>
      {error && <p role="alert">{error}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Create ticket"}
      </Button>
    </form>
  );
}
