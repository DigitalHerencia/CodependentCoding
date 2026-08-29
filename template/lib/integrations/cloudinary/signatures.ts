import "server-only"

import { createHash, timingSafeEqual } from "node:crypto"

export type CloudinarySignatureAlgorithm = "sha1" | "sha256"

function hash(value: string, algorithm: CloudinarySignatureAlgorithm): string {
  return createHash(algorithm).update(value).digest("hex")
}

export function signCloudinaryParameters(
  parameters: Record<string, string | number>,
  apiSecret: string,
  algorithm: CloudinarySignatureAlgorithm = "sha1"
): string {
  const serialized = Object.entries(parameters)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&")
  return hash(`${serialized}${apiSecret}`, algorithm)
}

export function verifyCloudinaryNotification(input: {
  rawBody: string
  timestamp: string
  signature: string
  apiSecret: string
  now?: number
  algorithm?: CloudinarySignatureAlgorithm
}): boolean {
  const timestamp = Number(input.timestamp)
  if (
    !Number.isFinite(timestamp) ||
    Math.abs((input.now ?? Date.now()) / 1000 - timestamp) > 3600
  ) {
    return false
  }
  const expected = Buffer.from(
    hash(`${input.rawBody}${input.timestamp}${input.apiSecret}`, input.algorithm ?? "sha1")
  )
  const received = Buffer.from(input.signature)
  return expected.length === received.length && timingSafeEqual(expected, received)
}
