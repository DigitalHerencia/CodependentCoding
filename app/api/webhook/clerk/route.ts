import { NextRequest, NextResponse } from 'next/server'
import { createRateLimit, rateLimitConfigs, addRateLimitHeaders } from '../../../../lib/middleware/rateLimit'

// Create rate limiting middleware for webhooks
const webhookRateLimit = createRateLimit(rateLimitConfigs.webhook)

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await webhookRateLimit(request)
  if (rateLimitResponse) {
    return rateLimitResponse // Return 429 if rate limited
  }

  try {
    // Get raw body for signature verification
    const body = await request.text()
    const signature = request.headers.get('svix-signature') || 
                     request.headers.get('clerk-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing webhook signature' },
        { status: 400 }
      )
    }

    // Parse webhook payload
    let webhookData
    try {
      webhookData = JSON.parse(body)
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      )
    }

    // Validate required webhook fields
    if (!webhookData.type || !webhookData.data) {
      return NextResponse.json(
        { error: 'Invalid webhook payload structure' },
        { status: 400 }
      )
    }

    // Handle different webhook events
    switch (webhookData.type) {
      case 'user.created':
        console.log('User created:', webhookData.data.id)
        // TODO: Upsert user to database
        break
      
      case 'user.updated':
        console.log('User updated:', webhookData.data.id)
        // TODO: Update user in database
        break
      
      case 'user.deleted':
        console.log('User deleted:', webhookData.data.id)
        // TODO: Handle user deletion (archive/anonymize data)
        break
      
      default:
        console.log('Unhandled webhook event:', webhookData.type)
        break
    }

    // Create success response with rate limit headers
    const response = NextResponse.json(
      {
        success: true,
        processed: webhookData.type,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    )

    // Add rate limit headers (use IP-based key for webhooks)
    // NextRequest doesn't have `ip`. Derive client IP from proxy headers.
    const forwarded =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      null
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
    const key = `ip:${ip}`
    
    return addRateLimitHeaders(response, key, rateLimitConfigs.webhook.maxRequests)

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Webhook endpoints typically don't need other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}