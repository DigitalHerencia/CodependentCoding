import { adminSessionCopy } from "@/content/admin";
import { verifyAdminSession } from "@/lib/actions/adminActions";
import {
  useAdminReverification,
  useClerkAccount,
} from "@/lib/auth/clerkAccount";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function getAdminAuditNavigationWorkflow(query: string) {
  return "/admin/audit?" + new URLSearchParams({ query }).toString();
}
export function getAdminUsersNavigationWorkflow(query: string) {
  return "/admin/users?" + new URLSearchParams({ query }).toString();
}

export function useAdminVerificationWorkflow() {
  const router = useRouter();
  const verify = useAdminReverification(verifyAdminSession);
  const { openUserProfile } = useClerkAccount();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const onVerify = async () => {
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
  };
  return {
    pending,
    message,
    onVerify,
    onManageAccount: () => openUserProfile(),
  };
}
