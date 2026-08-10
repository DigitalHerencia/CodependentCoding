import { NextResponse } from "next/server"

import { getOptionalEnv } from "@/lib/env"
import { verifyCloudinaryNotification } from "@/lib/integrations/cloudinary/signatures"
import { reconcileCloudinaryWebhook } from "@/lib/webhooks/cloudinaryWebhookWorkflow"
import { cloudinaryNotificationSchema } from "@/schemas/capabilitySchemas"

export async function POST(request: Request) {
  const apiSecret = getOptionalEnv("CLOUDINARY_API_SECRET")
  const signature = request.headers.get("x-cld-signature")
  const timestamp = request.headers.get("x-cld-timestamp")
  if (!apiSecret) return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 })
  if (!signature || !timestamp)
    return NextResponse.json({ error: "Invalid webhook request." }, { status: 400 })
  const rawBody = await request.text()
  const algorithm =
    getOptionalEnv("CLOUDINARY_SIGNATURE_ALGORITHM") === "sha256" ? "sha256" : "sha1"
  if (!verifyCloudinaryNotification({ rawBody, timestamp, signature, apiSecret, algorithm })) {
    return NextResponse.json({ error: "Invalid webhook request." }, { status: 400 })
  }
  let payload: unknown
  try {
    payload = JSON.parse(rawBody) as unknown
  } catch {
    return NextResponse.json({ error: "Malformed webhook payload." }, { status: 400 })
  }
  const parsed = cloudinaryNotificationSchema.safeParse(payload)
  if (!parsed.success)
    return NextResponse.json({ error: "Malformed webhook payload." }, { status: 400 })
  const result = await reconcileCloudinaryWebhook(parsed.data, { providerEventId: signature })
  return NextResponse.json(result, { status: result.ok ? 200 : 500 })
}
