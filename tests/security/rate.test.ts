import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
import { 
  createRateLimit, 
  createUserKeyGenerator, 
  rateLimitConfigs, 
  clearRateLimit,
  getRateLimitStatus,
  addRateLimitHeaders
} from '@/lib/middleware/rateLimit'

// Mock NextRequest for testing
function createMockRequest(headers: Record<string, string> = {}, ip = '127.0.0.1'): NextRequest {
  const url = 'http://localhost:3000/api/test'
  const request = new NextRequest(url, {
    method: 'POST',
    headers: new Headers(headers)
  })
  
  // Mock IP
  Object.defineProperty(request, 'ip', {
    value: ip,
    writable: false
  })
  
  return request
}

describe('Rate Limiting Middleware', () => {
  beforeEach(() => {
    // Clear rate limit store before each test
    clearRateLimit()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Basic Rate Limiting', () => {
    it('should allow requests within the limit', async () => {
      const rateLimit = createRateLimit({
        maxRequests: 5,
        windowMs: 60 * 1000 // 1 minute
      })

      const req = createMockRequest({ 'x-user-id': 'user123' })
      
      // First 5 requests should be allowed
      for (let i = 0; i < 5; i++) {
        const result = await rateLimit(req)
        expect(result).toBeNull() // null means request is allowed
      }
    })

    it('should block requests when limit exceeded', async () => {
      const rateLimit = createRateLimit({
        maxRequests: 3,
        windowMs: 60 * 1000,
        message: 'Test rate limit exceeded'
      })

      const req = createMockRequest({ 'x-user-id': 'user123' })
      
      // First 3 requests should be allowed
      for (let i = 0; i < 3; i++) {
        const result = await rateLimit(req)
        expect(result).toBeNull()
      }

      // 4th request should be blocked
      const blockedResult = await rateLimit(req)
      expect(blockedResult).not.toBeNull()
      expect(blockedResult!.status).toBe(429)
      
      const responseBody = await blockedResult!.json()
      expect(responseBody.error).toBe('Test rate limit exceeded')
      expect(responseBody.retryAfter).toBeGreaterThan(0)
    })

    it('should reset rate limit after window expires', async () => {
      const windowMs = 60 * 1000
      const rateLimit = createRateLimit({
        maxRequests: 2,
        windowMs
      })

      const req = createMockRequest({ 'x-user-id': 'user123' })
      
      // Use up the rate limit
      await rateLimit(req)
      await rateLimit(req)
      
      // Next request should be blocked
      const blockedResult = await rateLimit(req)
      expect(blockedResult!.status).toBe(429)

      // Fast forward time past the window
      vi.advanceTimersByTime(windowMs + 1000)

      // Request should now be allowed again
      const allowedResult = await rateLimit(req)
      expect(allowedResult).toBeNull()
    })

    it('should include proper rate limit headers in 429 response', async () => {
      const maxRequests = 2
      const rateLimit = createRateLimit({
        maxRequests,
        windowMs: 60 * 1000
      })

      const req = createMockRequest({ 'x-user-id': 'user123' })
      
      // Use up the rate limit
      await rateLimit(req)
      await rateLimit(req)
      
      // Next request should be blocked with headers
      const blockedResult = await rateLimit(req)
      expect(blockedResult!.status).toBe(429)
      
      const headers = blockedResult!.headers
      expect(headers.get('X-RateLimit-Limit')).toBe(maxRequests.toString())
      expect(headers.get('X-RateLimit-Remaining')).toBe('0')
      expect(headers.get('Retry-After')).toBeTruthy()
      expect(headers.get('X-RateLimit-Reset')).toBeTruthy()
    })
  })

  describe('User-Specific Rate Limiting', () => {
    it('should rate limit per user ID', async () => {
      const rateLimit = createRateLimit({
        maxRequests: 2,
        windowMs: 60 * 1000
      })

      const user1Req = createMockRequest({ 'x-user-id': 'user1' })
      const user2Req = createMockRequest({ 'x-user-id': 'user2' })

      // User 1: use up rate limit
      await rateLimit(user1Req)
      await rateLimit(user1Req)
      
      // User 1: should be blocked
      const user1Blocked = await rateLimit(user1Req)
      expect(user1Blocked!.status).toBe(429)

      // User 2: should still be allowed
      const user2Allowed = await rateLimit(user2Req)
      expect(user2Allowed).toBeNull()
    })

    it('should fall back to IP-based rate limiting when no user ID', async () => {
      const rateLimit = createRateLimit({
        maxRequests: 2,
        windowMs: 60 * 1000
      })

      const req1 = createMockRequest({}, '192.168.1.1')
      const req2 = createMockRequest({}, '192.168.1.2')

      // Same IP: use up rate limit
      await rateLimit(req1)
      await rateLimit(req1)
      
      // Same IP: should be blocked
      const sameIpBlocked = await rateLimit(req1)
      expect(sameIpBlocked!.status).toBe(429)

      // Different IP: should be allowed
      const differentIpAllowed = await rateLimit(req2)
      expect(differentIpAllowed).toBeNull()
    })

    it('should use custom key generator', async () => {
      const getUserId = vi.fn((req: NextRequest) => {
        const auth = req.headers.get('authorization')
        return auth ? auth.replace('Bearer ', '') : null
      })

      const customKeyGen = createUserKeyGenerator(getUserId)
      const rateLimit = createRateLimit({
        maxRequests: 2,
        windowMs: 60 * 1000,
        keyGenerator: customKeyGen
      })

      const req = createMockRequest({ 'authorization': 'Bearer token123' })
      
      await rateLimit(req)
      expect(getUserId).toHaveBeenCalledWith(req)
      
      // Should use user:token123 as key
      const status = getRateLimitStatus('user:token123')
      expect(status).toBeTruthy()
      expect(status!.count).toBe(1)
    })
  })

  describe('Predefined Rate Limit Configurations', () => {
    it('should have upload rate limit config', () => {
      const uploadConfig = rateLimitConfigs.upload
      expect(uploadConfig.maxRequests).toBe(10)
      expect(uploadConfig.windowMs).toBe(15 * 60 * 1000) // 15 minutes
      expect(uploadConfig.message).toContain('Upload rate limit exceeded')
    })

    it('should have webhook rate limit config', () => {
      const webhookConfig = rateLimitConfigs.webhook
      expect(webhookConfig.maxRequests).toBe(100)
      expect(webhookConfig.windowMs).toBe(60 * 1000) // 1 minute
      expect(webhookConfig.message).toContain('Webhook rate limit exceeded')
    })

    it('should have API rate limit config', () => {
      const apiConfig = rateLimitConfigs.api
      expect(apiConfig.maxRequests).toBe(60)
      expect(apiConfig.windowMs).toBe(60 * 1000) // 1 minute
      expect(apiConfig.message).toContain('API rate limit exceeded')
    })
  })

  describe('Upload Rate Limiting', () => {
    it('should enforce upload rate limits', async () => {
      const uploadRateLimit = createRateLimit(rateLimitConfigs.upload)
      const req = createMockRequest({ 'x-user-id': 'user123' })

      // Should allow up to 10 uploads
      for (let i = 0; i < 10; i++) {
        const result = await uploadRateLimit(req)
        expect(result).toBeNull()
      }

      // 11th upload should be blocked
      const blockedResult = await uploadRateLimit(req)
      expect(blockedResult!.status).toBe(429)
      
      const responseBody = await blockedResult!.json()
      expect(responseBody.error).toContain('Upload rate limit exceeded')
    })
  })

  describe('Webhook Rate Limiting', () => {
    it('should enforce webhook rate limits', async () => {
      const webhookRateLimit = createRateLimit(rateLimitConfigs.webhook)
      const req = createMockRequest({ 'x-forwarded-for': '192.168.1.100' })

      // Should allow up to 100 webhook calls per minute
      for (let i = 0; i < 100; i++) {
        const result = await webhookRateLimit(req)
        expect(result).toBeNull()
      }

      // 101st call should be blocked
      const blockedResult = await webhookRateLimit(req)
      expect(blockedResult!.status).toBe(429)
      
      const responseBody = await blockedResult!.json()
      expect(responseBody.error).toContain('Webhook rate limit exceeded')
    })
  })

  describe('Rate Limit Headers', () => {
    it('should add rate limit headers to successful responses', () => {
      const mockResponse = new Response('OK')
      const nextResponse = NextResponse.next({ 
        request: { headers: new Headers() } 
      })
      
      // Simulate rate limit entry
      const key = 'user:test123'
      const maxRequests = 10
      
      // Create a rate limit entry manually for testing
      const rateLimit = createRateLimit({ maxRequests, windowMs: 60000 })
      const req = createMockRequest({ 'x-user-id': 'test123' })
      
      // Use the rate limit once to create an entry
      rateLimit(req)
      
      const responseWithHeaders = addRateLimitHeaders(nextResponse, key, maxRequests)
      
      expect(responseWithHeaders.headers.get('X-RateLimit-Limit')).toBeTruthy()
    })
  })

  describe('Memory Cleanup', () => {
    it('should clean up expired entries', async () => {
      const windowMs = 1000 // 1 second for quick testing
      const rateLimit = createRateLimit({
        maxRequests: 5,
        windowMs
      })

      const req = createMockRequest({ 'x-user-id': 'cleanup-test' })
      
      // Make a request to create an entry
      await rateLimit(req)
      
      // Verify entry exists
      let status = getRateLimitStatus('user:cleanup-test')
      expect(status).toBeTruthy()
      
      // Fast forward past window expiration
      vi.advanceTimersByTime(windowMs + 1000)
      
      // Make another request to trigger cleanup
      await rateLimit(req)
      
      // The old entry should have been cleaned up and a new one created
      status = getRateLimitStatus('user:cleanup-test')
      expect(status!.count).toBe(1) // Should be reset
    })

    it('should handle clearRateLimit function', () => {
      const req = createMockRequest({ 'x-user-id': 'clear-test' })
      const rateLimit = createRateLimit({ maxRequests: 5, windowMs: 60000 })
      
      // Create some entries
      rateLimit(req)
      
      let status = getRateLimitStatus('user:clear-test')
      expect(status).toBeTruthy()
      
      // Clear all entries
      clearRateLimit()
      
      status = getRateLimitStatus('user:clear-test')
      expect(status).toBeNull()
    })
  })

  describe('Edge Cases', () => {
    it('should handle requests without user ID or IP', async () => {
      const rateLimit = createRateLimit({
        maxRequests: 5,
        windowMs: 60 * 1000
      })

      // Create request with minimal headers and no IP
      const url = 'http://localhost:3000/api/test'
      const req = new NextRequest(url, {
        method: 'POST',
        headers: new Headers()
      })

      const result = await rateLimit(req)
      expect(result).toBeNull() // Should still work with fallback
      
      // Should use 'unknown' as IP fallback
      const status = getRateLimitStatus('ip:unknown')
      expect(status).toBeTruthy()
    })

    it('should handle concurrent requests properly', async () => {
      const rateLimit = createRateLimit({
        maxRequests: 3,
        windowMs: 60 * 1000
      })

      const req = createMockRequest({ 'x-user-id': 'concurrent-test' })

      // Simulate concurrent requests
      const promises = Array(5).fill(null).map(() => rateLimit(req))
      const results = await Promise.all(promises)

      // First 3 should be allowed, last 2 should be blocked
      const allowedCount = results.filter(r => r === null).length
      const blockedCount = results.filter(r => r !== null).length

      expect(allowedCount).toBe(3)
      expect(blockedCount).toBe(2)
    })
  })
})