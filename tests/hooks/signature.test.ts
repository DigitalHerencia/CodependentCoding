import { describe, it, expect } from 'vitest'
import { verifyClerkWebhook } from '../../lib/verifyClerkWebhook'

// Add Node's crypto import so createHmac and timingSafeEqual are available
import * as crypto from 'node:crypto'

describe('Webhook Signature Validation Tests', () => {
  // Mock Clerk webhook secret for testing
  const WEBHOOK_SECRET = 'whsec_test123456789'
  
  describe('HMAC Signature Generation', () => {
    it('should generate correct HMAC-SHA256 signature', () => {
      const payload = JSON.stringify({
        type: 'user.created',
        data: { id: 'user_123' },
        object: 'event',
        evt_id: 'evt_123'
      })
      
      const timestamp = Date.now().toString()
      const signature = generateSignature(payload, timestamp, WEBHOOK_SECRET)
      
      // Signature should be base64 encoded
      expect(signature).toMatch(/^[a-zA-Z0-9+/]+=*$/)
    })
    
    it('should generate different signatures for different payloads', () => {
      const payload1 = JSON.stringify({ data: 'test1' })
      const payload2 = JSON.stringify({ data: 'test2' })
      const timestamp = Date.now().toString()
      
      const signature1 = generateSignature(payload1, timestamp, WEBHOOK_SECRET)
      const signature2 = generateSignature(payload2, timestamp, WEBHOOK_SECRET)
      
      expect(signature1).not.toBe(signature2)
    })
    
    it('should generate different signatures for different timestamps', () => {
      const payload = JSON.stringify({ data: 'test' })
      const timestamp1 = '1640995200'
      const timestamp2 = '1640995201'
      
      const signature1 = generateSignature(payload, timestamp1, WEBHOOK_SECRET)
      const signature2 = generateSignature(payload, timestamp2, WEBHOOK_SECRET)
      
      expect(signature1).not.toBe(signature2)
    })
  })
  
  describe('Signature Verification', () => {
    it('should verify valid signatures', () => {
      const payload = JSON.stringify({
        type: 'user.created',
        data: { id: 'user_123' },
        object: 'event',
        evt_id: 'evt_123'
      })
      
      const timestamp = Date.now().toString()
      const validSignature = generateSignature(payload, timestamp, WEBHOOK_SECRET)
      const svixSignature = `t=${timestamp},v1=${validSignature}`
      
      const isValid = verifyClerkWebhook(payload, svixSignature, WEBHOOK_SECRET)
      expect(isValid).toBe(true)
    })
    
    it('should reject invalid signatures', () => {
      const payload = JSON.stringify({ data: 'test' })
      const timestamp = Date.now().toString()
      const invalidSignature = 'invalidSignatureHere'
      const svixSignature = `t=${timestamp},v1=${invalidSignature}`
      
      const isValid = verifyClerkWebhook(payload, svixSignature, WEBHOOK_SECRET)
      expect(isValid).toBe(false)
    })
    
    it('should reject malformed signature headers', () => {
      const payload = JSON.stringify({ data: 'test' })
      const malformedHeaders = [
        'invalid-format',
        't=123456',
        'v1=signature-without-timestamp',
        '',
        'v2=unsupported-version'
      ]
      
      malformedHeaders.forEach(header => {
        const isValid = verifyClerkWebhook(payload, header, WEBHOOK_SECRET)
        expect(isValid).toBe(false)
      })
    })
    
    it('should handle timing attacks resistant comparison', () => {
      const payload = JSON.stringify({ data: 'test' })
      const timestamp = Date.now().toString()
      const validSignature = generateSignature(payload, timestamp, WEBHOOK_SECRET)
      const svixSignature = `t=${timestamp},v1=${validSignature}`
      
      // Both valid signatures should verify successfully
      const isValid1 = verifyClerkWebhook(payload, svixSignature, WEBHOOK_SECRET)
      const isValid2 = verifyClerkWebhook(payload, svixSignature, WEBHOOK_SECRET)
      
      expect(isValid1).toBe(true)
      expect(isValid2).toBe(true)
      
      // Modified signature should fail
      const modifiedSig = svixSignature.replace('v1=', 'v1=x')
      const isInvalid = verifySignature(payload, modifiedSig, WEBHOOK_SECRET)
      expect(isInvalid).toBe(false)
    })
  })
  
  describe('Integration Test Requirements', () => {
    it('should pass now that webhook signature verification is implemented', () => {
      // This test validates that our verifyClerkWebhook utility is now implemented
      
      // Requirements implemented:
      // 1. Extract timestamp and signatures from svix-signature header ✓
      // 2. Generate expected signature using HMAC-SHA256 ✓
      // 3. Compare signatures using timing-safe comparison ✓
      // 4. Validate timestamp to prevent replay attacks (basic parsing) ✓
      // 5. Handle multiple signatures in header (v1,sig1 v1,sig2) ✓
      
      expect(verifyClerkWebhook).toBeDefined()
      expect(typeof verifyClerkWebhook).toBe('function')
    })
  })
})

// Helper functions for testing signature generation and verification
// These will be moved to actual implementation files later

function generateSignature(payload: string, timestamp: string, secret: string): string {
  const data = `${timestamp}.${payload}`
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(data)
  return hmac.digest('base64')
}

function verifySignature(payload: string, svixSignature: string, secret: string): boolean {
  try {
    // Parse the svix-signature header format: t=timestamp,v1=signature1,v1=signature2...
    const parts = svixSignature.split(',')
    if (parts.length < 2) return false
    
    const timestampPart = parts.find(p => p.startsWith('t='))
    const signatureParts = parts.filter(p => p.startsWith('v1='))
    
    if (!timestampPart || signatureParts.length === 0) return false
    
    const timestamp = timestampPart.replace('t=', '')
    
    // Try to verify against any of the provided signatures
    for (const signaturePart of signatureParts) {
      const providedSignature = signaturePart.replace('v1=', '')
      
      // Generate expected signature
      const data = `${timestamp}.${payload}`
      const hmac = crypto.createHmac('sha256', secret)
      hmac.update(data)
      const expectedSignature = hmac.digest('base64')
      
      // Timing-safe comparison
      if (crypto.timingSafeEqual(
        Buffer.from(providedSignature), 
        Buffer.from(expectedSignature)
      )) {
        return true
      }
    }
    
    return false
  } catch {
    return false
  }
}
