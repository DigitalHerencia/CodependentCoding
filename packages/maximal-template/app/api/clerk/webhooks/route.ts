import { handleClerkWebhookWorkflow } from "@/lib/workflows/authWorkflows";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return handleClerkWebhookWorkflow(request);
}
