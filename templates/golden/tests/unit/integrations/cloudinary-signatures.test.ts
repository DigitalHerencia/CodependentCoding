import { createHash } from "node:crypto"
import { describe, expect, it } from "vitest"

import {
  signCloudinaryParameters,
  verifyCloudinaryNotification,
} from "@/lib/integrations/cloudinary/signatures"

describe("Cloudinary signatures", () => {
  it("sorts upload parameters and defaults to SHA-1", () => {
    const expected = createHash("sha1").update("public_id=asset&timestamp=123secret").digest("hex")
    expect(signCloudinaryParameters({ timestamp: 123, public_id: "asset" }, "secret")).toBe(
      expected
    )
  })

  it("verifies the raw notification body and rejects stale timestamps", () => {
    const rawBody = '{"asset_id":"asset"}'
    const timestamp = "1000"
    const signature = createHash("sha1").update(`${rawBody}${timestamp}secret`).digest("hex")
    expect(
      verifyCloudinaryNotification({
        rawBody,
        timestamp,
        signature,
        apiSecret: "secret",
        now: 1_000_000,
      })
    ).toBe(true)
    expect(
      verifyCloudinaryNotification({
        rawBody,
        timestamp,
        signature,
        apiSecret: "secret",
        now: 10_000_000,
      })
    ).toBe(false)
  })
})
