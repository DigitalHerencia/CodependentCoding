import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { generateSignature } from '../../lib/verifyClerkWebhook'

// Mock Prisma
vi.mock('../../lib/prisma', () => {
  const mockUpsert = vi.fn()
  const mockDelete = vi.fn()
  
  return {
    prisma: {
      user: {
        upsert: mockUpsert,
        delete: mockDelete,
      }
    }
  }
})

describe('Webhook Handler Tests', () => {
  const TEST_SECRET = 'whsec_test123456789'
  const mockClerkUserData = {
    id: 'user_2ABC123DEF456',
    email_addresses: [
      {
        email_address: 'test@example.com',
        id: 'idn_123'
      }
    ],
    first_name: 'John',
    last_name: 'Doe',
    created_at: 1640995200,
    updated_at: 1640995200
  }

  beforeEach(async () => {
    // Get the mocked functions from the mocked module
    const { prisma } = await import('../../lib/prisma')
    const mockUpsert = prisma.user.upsert as any
    const mockDelete = prisma.user.delete as any
    
    vi.clearAllMocks()
    mockUpsert.mockClear()
    mockDelete.mockClear()
    
    // Set up environment variable for tests
    process.env.CLERK_WEBHOOK_SECRET = TEST_SECRET
  })

  describe('Request Validation', () => {
    it('should return 400 if svix-signature header is missing', async () => {
      const { POST } = await import('../../app/api/clerk/webhook-handler/route')
      
      const request = new NextRequest('http://localhost/api/clerk/webhook-handler', {
        method: 'POST',
        body: JSON.stringify({ type: 'user.created', data: mockClerkUserData })
      })

      const response = await POST(request)
      
      expect(response.status).toBe(400)
      expect(await response.text()).toBe('Missing svix-signature header')
    })

    it('should return 401 for invalid signature', async () => {
      const { POST } = await import('../../app/api/clerk/webhook-handler/route')
      
      const payload = JSON.stringify({
        type: 'user.created',
        data: mockClerkUserData,
        object: 'event',
        evt_id: 'evt_123'
      })

      const request = new NextRequest('http://localhost/api/clerk/webhook-handler', {
        method: 'POST',
        body: payload,
        headers: {
          'svix-signature': 't=1640995200,v1=invalidSignature'
        }
      })

      const response = await POST(request)
      
      expect(response.status).toBe(401)
      expect(await response.text()).toBe('Invalid signature')
    })

    it('should return 400 for invalid JSON payload', async () => {
      const { POST } = await import('../../app/api/clerk/webhook-handler/route')
      
      const invalidPayload = 'invalid json'
      const timestamp = Date.now().toString()
      const signature = generateSignature(invalidPayload, timestamp, TEST_SECRET)

      const request = new NextRequest('http://localhost/api/clerk/webhook-handler', {
        method: 'POST',
        body: invalidPayload,
        headers: {
          'svix-signature': `t=${timestamp},${signature}`
        }
      })

      const response = await POST(request)
      
      expect(response.status).toBe(400)
      expect(await response.text()).toBe('Invalid JSON payload')
    })
  })

  describe('Valid Webhook Processing', () => {
    it('should process user.created event and upsert user', async () => {
      const { POST } = await import('../../app/api/clerk/webhook-handler/route')
      const { prisma } = await import('../../lib/prisma')
      const mockUpsert = prisma.user.upsert as any
      
      const payload = JSON.stringify({
        type: 'user.created',
        data: mockClerkUserData,
        object: 'event',
        evt_id: 'evt_123'
      })
      
      const timestamp = Date.now().toString()
      const signature = generateSignature(payload, timestamp, TEST_SECRET)

      const request = new NextRequest('http://localhost/api/clerk/webhook-handler', {
        method: 'POST',
        body: payload,
        headers: {
          'svix-signature': `t=${timestamp},${signature}`
        }
      })

      mockUpsert.mockResolvedValue({})

      const response = await POST(request)
      
      expect(response.status).toBe(200)
      expect(await response.text()).toBe('OK')
      
      expect(mockUpsert).toHaveBeenCalledWith({
        where: { clerkId: mockClerkUserData.id },
        update: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          updatedAt: expect.any(Date),
        },
        create: {
          clerkId: mockClerkUserData.id,
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
        }
      })
    })

    it('should process user.updated event and upsert user', async () => {
      const { POST } = await import('../../app/api/clerk/webhook-handler/route')
      const { prisma } = await import('../../lib/prisma')
      const mockUpsert = prisma.user.upsert as any
      
      const updatedUserData = {
        ...mockClerkUserData,
        first_name: 'Jane',
        last_name: 'Smith'
      }

      const payload = JSON.stringify({
        type: 'user.updated',
        data: updatedUserData,
        object: 'event',
        evt_id: 'evt_456'
      })
      
      const timestamp = Date.now().toString()
      const signature = generateSignature(payload, timestamp, TEST_SECRET)

      const request = new NextRequest('http://localhost/api/clerk/webhook-handler', {
        method: 'POST',
        body: payload,
        headers: {
          'svix-signature': `t=${timestamp},${signature}`
        }
      })

      mockUpsert.mockResolvedValue({})

      const response = await POST(request)
      
      expect(response.status).toBe(200)
      expect(mockUpsert).toHaveBeenCalledWith({
        where: { clerkId: updatedUserData.id },
        update: {
          email: 'test@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          updatedAt: expect.any(Date),
        },
        create: {
          clerkId: updatedUserData.id,
          email: 'test@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
        }
      })
    })

    it('should process user.deleted event and delete user', async () => {
      const { POST } = await import('../../app/api/clerk/webhook-handler/route')
      const { prisma } = await import('../../lib/prisma')
      const mockDelete = prisma.user.delete as any
      
      const payload = JSON.stringify({
        type: 'user.deleted',
        data: mockClerkUserData,
        object: 'event',
        evt_id: 'evt_789'
      })
      
      const timestamp = Date.now().toString()
      const signature = generateSignature(payload, timestamp, TEST_SECRET)

      const request = new NextRequest('http://localhost/api/clerk/webhook-handler', {
        method: 'POST',
        body: payload,
        headers: {
          'svix-signature': `t=${timestamp},${signature}`
        }
      })

      mockDelete.mockResolvedValue({})

      const response = await POST(request)
      
      expect(response.status).toBe(200)
      expect(mockDelete).toHaveBeenCalledWith({
        where: { clerkId: mockClerkUserData.id }
      })
    })

    it('should acknowledge unsupported event types', async () => {
      const { POST } = await import('../../app/api/clerk/webhook-handler/route')
      const { prisma } = await import('../../lib/prisma')
      const mockUpsert = prisma.user.upsert as any
      const mockDelete = prisma.user.delete as any
      
      const payload = JSON.stringify({
        type: 'user.unknown_event',
        data: mockClerkUserData,
        object: 'event',
        evt_id: 'evt_999'
      })
      
      const timestamp = Date.now().toString()
      const signature = generateSignature(payload, timestamp, TEST_SECRET)

      const request = new NextRequest('http://localhost/api/clerk/webhook-handler', {
        method: 'POST',
        body: payload,
        headers: {
          'svix-signature': `t=${timestamp},${signature}`
        }
      })

      const response = await POST(request)
      
      expect(response.status).toBe(200)
      expect(await response.text()).toBe('OK')
      
      // Should not call any database operations
      expect(mockUpsert).not.toHaveBeenCalled()
      expect(mockDelete).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should return 500 if CLERK_WEBHOOK_SECRET is not set', async () => {
      const { POST } = await import('../../app/api/clerk/webhook-handler/route')
      
      delete process.env.CLERK_WEBHOOK_SECRET
      delete process.env.CLERK_PRODUCTION_WEBHOOK_SECRET

      const payload = JSON.stringify({
        type: 'user.created',
        data: mockClerkUserData,
        object: 'event',
        evt_id: 'evt_123'
      })

      const request = new NextRequest('http://localhost/api/clerk/webhook-handler', {
        method: 'POST',
        body: payload,
        headers: {
          'svix-signature': 't=1640995200,v1=someSignature'
        }
      })

      const response = await POST(request)
      
      expect(response.status).toBe(500)
      expect(await response.text()).toBe('Internal server error')
    })

    it('should return 500 if database operation fails', async () => {
      const { POST } = await import('../../app/api/clerk/webhook-handler/route')
      const { prisma } = await import('../../lib/prisma')
      const mockUpsert = prisma.user.upsert as any
      
      const payload = JSON.stringify({
        type: 'user.created',
        data: mockClerkUserData,
        object: 'event',
        evt_id: 'evt_123'
      })
      
      const timestamp = Date.now().toString()
      const signature = generateSignature(payload, timestamp, TEST_SECRET)

      const request = new NextRequest('http://localhost/api/clerk/webhook-handler', {
        method: 'POST',
        body: payload,
        headers: {
          'svix-signature': `t=${timestamp},${signature}`
        }
      })

      mockUpsert.mockRejectedValue(new Error('Database error'))

      const response = await POST(request)
      
      expect(response.status).toBe(500)
      expect(await response.text()).toBe('Internal server error')
    })
  })
})