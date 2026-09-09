"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  replyToSupportTicket,
  updateSupportTicketStatus,
} from "@/lib/actions/supportActions";
import { TicketStatus } from "@/schemas/supportSchemas";
import type { SupportTicketDTO } from "@/types/supportTypes";
export function TicketFeatureClient({ ticket }: { ticket: SupportTicketDTO }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  return (
    <div className="space-y-5">
      <form
        className="space-y-3"
        action={(data) =>
          startTransition(async () => {
            setMessage("");
            try {
              await replyToSupportTicket({
                ticketId: ticket.id,
                body: data.get("body"),
              });
              setMessage("Reply saved.");
              router.refresh();
            } catch {
              setMessage(
                "Reply could not be saved. Check access and try again.",
              );
            }
          })
        }
      >
        <Label htmlFor="ticket-reply">Reply to conversation</Label>
        <textarea
          id="ticket-reply"
          name="body"
          className="control-field min-h-32 w-full"
          required
          maxLength={30000}
        />
        <Button disabled={pending} type="submit">
          Save reply
        </Button>
      </form>
      <form
        className="flex flex-wrap gap-3"
        action={(data) =>
          startTransition(async () => {
            setMessage("");
            try {
              await updateSupportTicketStatus({
                ticketId: ticket.id,
                expectedVersion: ticket.version,
                status: data.get("status"),
              });
              setMessage("Ticket status updated.");
              router.refresh();
            } catch {
              setMessage(
                "Status could not be changed. Check access, transition, or reload the latest ticket.",
              );
            }
          })
        }
      >
        <select
          aria-label="Ticket status"
          className="control-field"
          defaultValue={ticket.status}
          name="status"
        >
          {Object.values(TicketStatus).map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
        <Button disabled={pending} type="submit">
          Update status
        </Button>
      </form>
      <p role="status">{message}</p>
    </div>
  );
}
