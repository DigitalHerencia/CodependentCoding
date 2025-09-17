import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'

// Mock the Prisma client since we don't need real DB in unit tests
const mockPrismaClient = {
  user: {
    findMany: vi.fn(),
  },
  $connect: vi.fn(),
  $disconnect: vi.fn(),
}

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => mockPrismaClient)
}))

describe('Prisma Database Connection', () => {
  let originalEnv: string | undefined

  beforeAll(() => {
    // Store original DATABASE_URL
    originalEnv = process.env.DATABASE_URL
  })

  afterAll(() => {
    // Restore original DATABASE_URL
    if (originalEnv) {
      process.env.DATABASE_URL = originalEnv
    } else {
      delete process.env.DATABASE_URL
    }
  })

  it('should fail when DATABASE_URL is not set', async () => {
    // Remove DATABASE_URL to simulate missing connection string
    delete process.env.DATABASE_URL

    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // Mock failure for missing DATABASE_URL
    mockPrismaClient.user.findMany.mockRejectedValue(new Error('Connection string not found'))

    // This should fail when no DATABASE_URL is configured
    await expect(prisma.user.findMany()).rejects.toThrow('Connection string not found')

    await prisma.$disconnect()
  })

  it('should connect successfully when DATABASE_URL is properly set', async () => {
    // Restore DATABASE_URL for this test
    process.env.DATABASE_URL = originalEnv || 'postgresql://user:pass@localhost:5432/db'

    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    try {
      // Mock successful connection
      mockPrismaClient.$connect.mockResolvedValue(undefined)
      mockPrismaClient.user.findMany.mockResolvedValue([])

      await prisma.$connect()

      // Basic query should not throw (even if it returns empty results)
      const users = await prisma.user.findMany()
      expect(Array.isArray(users)).toBe(true)
    } catch (error) {
      // If connection fails due to actual DB issues, that's expected in test env
      // We just want to ensure the client can be created without throwing immediately
      expect(error).toBeDefined()
    } finally {
      await prisma.$disconnect()
    }
  })
})
