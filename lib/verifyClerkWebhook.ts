import crypto from 'crypto'

/**
 * Verifies a Clerk webhook signature using timing-safe HMAC comparison
 * 
 * @param rawBody - The raw request body as a string
 * @param svixSignature - The svix-signature header value
 * @param secret - The webhook secret (should start with 'whsec_')
 * @returns true if the signature is valid, false otherwise
 */
export function verifyClerkWebhook(
  rawBody: string,
  svixSignature: string,
  secret: string
): boolean {
  try {
    // Parse the svix-signature header format: t=timestamp,v1=signature1,v1=signature2,...
    const parts = svixSignature.split(',')
    if (parts.length < 2) return false
    
    const timestampPart = parts.find(p => p.startsWith('t='))
    if (!timestampPart) return false
    
    const timestamp = timestampPart.replace('t=', '')
    
    // Extract all v1 signatures
    const v1Signatures = parts
      .filter(p => p.startsWith('v1='))
      .map(p => p.replace('v1=', ''))
    
    if (v1Signatures.length === 0) return false
    
    // Remove 'whsec_' prefix from secret if present
    const cleanSecret = secret.startsWith('whsec_') ? secret.slice(6) : secret
    
    // Generate expected signature
    const data = `${timestamp}.${rawBody}`
    const expectedSignature = crypto
      .createHmac('sha256', cleanSecret)
      .update(data)
      .digest('base64')
    
    // Check if any of the provided signatures match using timing-safe comparison
    for (const providedSignature of v1Signatures) {
      try {
        if (crypto.timingSafeEqual(
          Buffer.from(providedSignature),
          Buffer.from(expectedSignature)
        )) {
          return true
        }
      } catch {
        // Continue to next signature if buffer lengths don't match
        continue
      }
    }
    
    return false
  } catch {
    return false
  }
}

/**
 * Generates a signature for testing purposes
 * @param payload - The payload to sign
 * @param timestamp - The timestamp as a string
 * @param secret - The webhook secret
 * @returns The signature in v1=base64 format (not v1,base64)
 */
export function generateSignature(payload: string, timestamp: string, secret: string): string {
  const cleanSecret = secret.startsWith('whsec_') ? secret.slice(6) : secret
  const data = `${timestamp}.${payload}`
  const signature = crypto
    .createHmac('sha256', cleanSecret)
    .update(data)
    .digest('base64')
  return `v1=${signature}`
}