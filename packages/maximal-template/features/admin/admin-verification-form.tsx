"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { adminSessionCopy } from "@/content/admin";
import { verifyAdminSession } from "@/lib/actions/adminActions";
import {
  useAdminReverification,
  useClerkAccount,
} from "@/lib/auth/clerkAccount";
export function AdminVerificationForm({
  needsEnrollment,
}: {
  needsEnrollment: boolean;
}) {
  const router = useRouter();
  const verify = useAdminReverification(verifyAdminSession);
  const { openUserProfile } = useClerkAccount();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <form
      className="mx-auto max-w-lg space-y-4 p-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setMessage("");
        try {
          const result = await verify();
          if (result.ok) router.refresh();
          else setMessage(result.error.message);
        } catch {
          setMessage(adminSessionCopy.cancelled);
        } finally {
          setPending(false);
        }
      }}
    >
      <h1 className="type-title">{adminSessionCopy.title}</h1>
      <p>
        {needsEnrollment
          ? adminSessionCopy.enrollment
          : adminSessionCopy.verification}
      </p>
      {needsEnrollment && (
        <Button
          type="button"
          variant="outline"
          onClick={() => openUserProfile()}
        >
          {adminSessionCopy.account}
        </Button>
      )}
      <Button type="submit" disabled={pending}>
        {adminSessionCopy.verify}
      </Button>
      <p role="status">{message}</p>
    </form>
  );
}
