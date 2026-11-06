import { handleClerkWebhookWorkflow } from "@/lib/workflows/authWebhookWorkflows";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return handleClerkWebhookWorkflow(request);
}
