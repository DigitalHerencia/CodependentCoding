import { describe, it, expect, beforeEach, vi } from 'vitest'

// Shared mock methods that will be used by the mocked PrismaClient
const mockArchiveMethods = {
  create: vi.fn(),
  findMany: vi.fn(),
  findUnique: vi.fn(),
  delete: vi.fn(),
}
const mockUserMethods = {
  findUnique: vi.fn(),
  create: vi.fn(),
}

// Mock @prisma/client BEFORE the actions module is imported so that
// the actions use the mocked PrismaClient instance.
vi.mock('@prisma/client', () => {
  const PrismaClient = vi.fn().mockImplementation(() => ({
    archive: mockArchiveMethods,
    user: mockUserMethods,
  }))
  return { PrismaClient }
})

describe('Archive CRUD Flow Integration Tests', () => {
  beforeEach(() => {
    // Reset mocked implementations/behavior between tests
    vi.clearAllMocks()
  })

  it('createArchive should validate input and save via prisma', async () => {
    // Arrange: valid input
    const input = {
      title: 'Test conversation',
      content: 'User: Hello\nAssistant: Hi there!',
      attachments: [
        {
          // changed: provide full attachment shape expected by the action's parameter type
          name: 'image.png',
          size: 12345,
          contentType: 'image/png',
          url: 'https://example.com/image.png',
          checksum: 'sha256:abcdef1234567890',
        },
      ],
    }

    const createdAt = new Date()
    const createdFromDb = {
      id: '11111111-1111-1111-1111-111111111111',
      userId: 'mock-user-id',
      title: input.title,
      content: input.content,
      // changed: mirror the full attachment shape in the mocked DB row
      attachments: input.attachments,
      createdAt,
      updatedAt: createdAt,
    }

    // Mock prisma.archive.create to return the created record
    mockArchiveMethods.create.mockResolvedValue(createdFromDb)

    // Dynamically import the actions so the above vi.mock is applied
    const { createArchive } = await import('../../lib/actions/archives')

    // Act
    const result = await createArchive(input)

    // Assert
    expect(result).toBeDefined()
    expect(result.id).toBe(createdFromDb.id)
    expect(result.title).toBe(input.title)
    expect(mockArchiveMethods.create).toHaveBeenCalled()
  })

  it('getArchives should return list from prisma', async () => {
    // Arrange
    const dbRows = [
      {
        id: '22222222-2222-2222-2222-222222222222',
        userId: 'user-1',
        title: 'Archived 1',
        content: 'Some content',
        attachments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    mockArchiveMethods.findMany.mockResolvedValue(dbRows)

    const { getArchives } = await import('../../lib/actions/archives')

    // Act
    const list = await getArchives()

    // Assert
    expect(Array.isArray(list)).toBe(true)
    expect(list.length).toBe(1)
    expect(list[0].id).toBe(dbRows[0].id)
    expect(mockArchiveMethods.findMany).toHaveBeenCalled()
  })

  it('getArchive should return archive when found (and handle null safely)', async () => {
    // Arrange
    const uuid = '33333333-3333-3333-3333-333333333333'
    const dbRow = {
      id: uuid,
      userId: 'user-2',
      title: 'Single Archive',
      content: 'Content here',
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockArchiveMethods.findUnique.mockResolvedValue(dbRow)

    const { getArchive } = await import('../../lib/actions/archives')

    // Act
    const archive = await getArchive(uuid)

    // Guard/narrow: resolve TypeScript "'archive' is possibly 'null'." warning
    expect(archive).not.toBeNull()
    if (!archive) throw new Error('Expected archive to be present')

    // Assert properties after narrowing
    expect(archive.title).toBe(dbRow.title)
    expect(archive.content).toBe(dbRow.content)
    expect(mockArchiveMethods.findUnique).toHaveBeenCalled()
  })

  it('deleteArchive should call prisma.delete with validated id', async () => {
    // Arrange
    const uuid = '44444444-4444-4444-4444-444444444444'
    mockArchiveMethods.delete.mockResolvedValue({})

    const { deleteArchive } = await import('../../lib/actions/archives')

    // Act
    await deleteArchive(uuid)

    // Assert - archives.delete calls Prisma with where: { id: uuid }
    expect(mockArchiveMethods.delete).toHaveBeenCalledWith({ where: { id: uuid } })
  })

  it('createArchive should reject invalid data at runtime (zod validation)', async () => {
    // Import the action first so we can use its parameter type for a safe cast
    const { createArchive } = await import('../../lib/actions/archives')

    // Arrange: missing required 'title' property -> invalid
    // Use the function parameter type to avoid 'any' while still providing malformed input
    const invalidData = {
      content: 'Some content only',
      attachments: [],
    } as unknown as Parameters<typeof createArchive>[0]

    // Act + Assert: should reject with validation error
    await expect(createArchive(invalidData)).rejects.toThrow()
  })

  it('feature and UI modules should be importable (components/pages implemented)', async () => {
    // These modules exist in the repo now — ensure they import without throwing
    // Import using dynamic import to keep tests resilient in environments where ESM/CJS interplay exists
    const ArchiveCard = await import('../../features/archive/ArchiveCard')
    const ArchiveListFeature = await import('../../features/archive/ArchiveList')
    const ArchivesPage = await import('../../app/(dashboard)/archives/page')
    const ArchiveDetailPage = await import('../../app/(dashboard)/archives/[id]/page')

    expect(ArchiveCard).toBeDefined()
    expect(ArchiveListFeature).toBeDefined()
    expect(ArchivesPage).toBeDefined()
    expect(ArchiveDetailPage).toBeDefined()
  })
})