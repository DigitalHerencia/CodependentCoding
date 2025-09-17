import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  keyGenerator?: (req: NextRequest) => string
  message?: string
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// In-memory store for rate limiting (for development/testing)
// In production, consider using Redis or similar persistent store
const store: RateLimitStore = {}

/**
 * Creates a rate limiting middleware for Next.js API routes
 * Implements per-user rate limiting with configurable limits
 */
export function createRateLimit(config: RateLimitConfig) {
  const {
    maxRequests,
    windowMs,
    keyGenerator = defaultKeyGenerator,
    message = 'Rate limit exceeded. Too many requests.'
  } = config

  return async function rateLimit(req: NextRequest): Promise<NextResponse | null> {
    const key = keyGenerator(req)
    const now = Date.now()
    
    // Clean up expired entries
    cleanupExpiredEntries(now)
    
    // Get or create rate limit entry
    const entry = store[key] || { count: 0, resetTime: now + windowMs }
    
    // Reset if window has expired
    if (now > entry.resetTime) {
      entry.count = 0
      entry.resetTime = now + windowMs
    }
    
    // Check if rate limit exceeded
    if (entry.count >= maxRequests) {
      const resetIn = Math.ceil((entry.resetTime - now) / 1000)
      
      return new NextResponse(
        JSON.stringify({ 
          error: message,
          retryAfter: resetIn 
        }), 
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': resetIn.toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': entry.resetTime.toString()
          }
        }
      )
    }
    
    // Increment counter and store
    entry.count++
    store[key] = entry
    
    return null // Allow request to proceed
  }
}

/**
 * Default key generator using user ID from request headers or IP as fallback
 */
function defaultKeyGenerator(req: NextRequest): string {
  // Try to get user ID from common auth headers
  const userIdHeader =
    req.headers.get('x-user-id') ||
    req.headers.get('x-clerk-user-id')

  if (userIdHeader) {
    return `user:${userIdHeader}`
  }

  // Safely parse Authorization header (e.g. "Bearer <token>")
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
  if (authHeader) {
    const parts = authHeader.split(' ').filter(Boolean)
    if (parts.length > 0) {
      const tokenOrId = parts[parts.length - 1]
      if (tokenOrId) {
        return `user:${tokenOrId}`
      }
    }
  }

  // Fallback to IP if no user identifier found
  const forwarded =
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    req.headers.get('cf-connecting-ip') ||
    null
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  return `ip:${ip}`
}

/**
 * Creates a rate limit key generator for user-specific rate limiting
 */
export function createUserKeyGenerator(getUserId: (req: NextRequest) => string | null) {
  return function userKeyGenerator(req: NextRequest): string {
    const userId = getUserId(req)
    if (userId) {
      return `user:${userId}`
    }
    
    // Fallback to IP if user ID not available
    return defaultKeyGenerator(req)
  }
}

/**
 * Predefined rate limit configurations for common use cases
 */
export const rateLimitConfigs = {
  // For file uploads - more restrictive
  upload: {
    maxRequests: 10,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Upload rate limit exceeded. Please wait before uploading more files.'
  },
  
  // For webhooks - moderate limits
  webhook: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
    message: 'Webhook rate limit exceeded.'
  },
  
  // For general API - more permissive
  api: {
    maxRequests: 60,
    windowMs: 60 * 1000, // 1 minute
    message: 'API rate limit exceeded.'
  }
} as const

/**
 * Helper function to add rate limit headers to a response
 */
export function addRateLimitHeaders(
  response: NextResponse, 
  key: string, 
  maxRequests: number
): NextResponse {
  const entry = store[key]
  if (!entry) return response
  
  const remaining = Math.max(0, maxRequests - entry.count)
  
  response.headers.set('X-RateLimit-Limit', maxRequests.toString())
  response.headers.set('X-RateLimit-Remaining', remaining.toString())
  response.headers.set('X-RateLimit-Reset', entry.resetTime.toString())
  
  return response
}

/**
 * Cleanup expired entries from the in-memory store
 */
function cleanupExpiredEntries(now: number): void {
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  }
}

/**
 * Clear all rate limit data (for testing purposes)
 */
export function clearRateLimit(): void {
  for (const key in store) {
    delete store[key]
  }
}

/**
 * Get current rate limit status for a key (for testing/debugging)
 */
export function getRateLimitStatus(key: string) {
  return store[key] || null
}