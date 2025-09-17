import { NextRequest, NextResponse } from 'next/server'
import { verifyClerkWebhook } from '@/lib/utils/verifyClerkWebhook'
import { prisma } from '@/lib/db/prisma'

// Clerk webhook event types
interface ClerkWebhookEvent {
  type: string
  data: {
    id: string
    email_addresses: Array<{
      email_address: string
      id: string
    }>
    first_name: string | null
    last_name: string | null
    created_at: number
    updated_at: number
  }
  object: 'event'
  evt_id: string
}

export async function POST(request: NextRequest) {
  try {
    // Get the raw body and signature
    const body = await request.text()
    const svixSignature = request.headers.get('svix-signature')
    
    if (!svixSignature) {
      return new NextResponse('Missing svix-signature header', { status: 400 })
    }

    // Get webhook secret from environment
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || process.env.CLERK_PRODUCTION_WEBHOOK_SECRET
    
    if (!webhookSecret) {
      console.error('Missing CLERK_WEBHOOK_SECRET environment variable')
      return new NextResponse('Internal server error', { status: 500 })
    }

    // Verify the webhook signature
    const isValid = verifyClerkWebhook(body, svixSignature, webhookSecret)
    
    if (!isValid) {
      return new NextResponse('Invalid signature', { status: 401 })
    }

    // Parse the webhook payload
    let event: ClerkWebhookEvent
    try {
      event = JSON.parse(body)
    } catch (error) {
      return new NextResponse('Invalid JSON payload', { status: 400 })
    }

    // Handle the webhook event
    switch (event.type) {
      case 'user.created':
      case 'user.updated':
        await upsertUser(event.data)
        break
      
      case 'user.deleted':
        await deleteUser(event.data.id)
        break
      
      default:
        // For unsupported events, we still return 200 to acknowledge receipt
        console.log(`Unhandled webhook event type: ${event.type}`)
    }

    return new NextResponse('OK', { status: 200 })
    
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}

async function upsertUser(userData: ClerkWebhookEvent['data']) {
  const primaryEmail = userData.email_addresses?.find(email => email.email_address)?.email_address

  await prisma.user.upsert({
    where: { clerkId: userData.id },
    update: {
      email: primaryEmail,
      firstName: userData.first_name,
      lastName: userData.last_name,
      updatedAt: new Date(),
    },
    create: {
      clerkId: userData.id,
      email: primaryEmail,
      firstName: userData.first_name,
      lastName: userData.last_name,
    }
  })
}

async function deleteUser(clerkId: string) {
  await prisma.user.delete({
    where: { clerkId }
  })
}