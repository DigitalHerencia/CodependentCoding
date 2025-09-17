/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock @prisma/client before importing the module under test so the module's
// top-level `new PrismaClient()` receives our mocked client.
vi.mock('@prisma/client', () => {
  const mockArchive = {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    delete: vi.fn(),
  }

  class PrismaClient {
    archive = mockArchive
    // keep shape for other possible usage
    $disconnect = vi.fn()
  }

  return { PrismaClient }
})

// Mock revalidatePath from next/cache (it's invoked in create/delete)
vi.mock('next/cache', () => {
  return { revalidatePath: vi.fn() }
})

// Now import the module under test (after mocks are established)
import * as archivesModule from '../../lib/actions/archives'
import { revalidatePath } from 'next/cache'
import { PrismaClient } from '@prisma/client'

describe('archives actions', () => {
  let mockArchive: any

  beforeEach(() => {
    vi.clearAllMocks()
    // get the same mocked archive object the module used at import-time
    const prisma = new PrismaClient()
    mockArchive = prisma.archive
  })

  it('createArchive - creates and returns normalized archive and revalidates path', async () => {
    const now = new Date()
    const created = {
      id: 'abc-123',
      userId: 'mock-user-id',
      title: 'My Title',
      content: 'My content',
      attachments: [
        { name: 'file.txt', size: 12, contentType: 'text/plain', url: 'https://u', checksum: 'c' },
      ],
      createdAt: now,
      updatedAt: now,
    }

    mockArchive.create.mockResolvedValue(created)

    const input = {
      title: 'My Title',
      content: 'My content',
      attachments: created.attachments,
    }

    const result = await archivesModule.createArchive(input)

    expect(mockArchive.create).toHaveBeenCalled()
    expect(result.id).toBe(created.id)
    expect(result.title).toBe(created.title)
    expect(Array.isArray(result.attachments)).toBe(true)
    expect(result.attachments[0].name).toBe('file.txt')
    expect((revalidatePath as any)).toHaveBeenCalledWith('/archives')
  })

  it('getArchives - maps database rows to normalized Archive[]', async () => {
    const row = {
      id: 'row-1',
      userId: 'mock-user-id',
      title: 'T',
      content: 'C',
      attachments: [{ name: 'a', size: 1, contentType: 'text/plain', url: 'u', checksum: 'x' }],
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2020-01-02'),
    }
    mockArchive.findMany.mockResolvedValue([row])

    const list = await archivesModule.getArchives()
    expect(mockArchive.findMany).toHaveBeenCalled()
    expect(list.length).toBe(1)
    expect(list[0].id).toBe(row.id)
    expect(Array.isArray(list[0].attachments)).toBe(true)
    expect(list[0].attachments[0].name).toBe('a')
  })

  it('getArchive - returns null when not found and returns normalized object when found', async () => {
    mockArchive.findUnique.mockResolvedValue(null)
    const notFound = await archivesModule.getArchive('00000000-0000-0000-0000-000000000000')
    expect(notFound).toBeNull()

    const row = {
      id: 'row-2',
      userId: 'mock-user-id',
      title: 'Title2',
      content: 'Content2',
      attachments: [{ name: 'b', size: 2, contentType: 'text/plain', url: 'u2', checksum: 'y' }],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockArchive.findUnique.mockResolvedValue(row)

    const found = await archivesModule.getArchive('00000000-0000-0000-0000-000000000000')
    expect(found).not.toBeNull()
    expect(found?.id).toBe(row.id)
    expect(found?.attachments[0].name).toBe('b')
  })

  it('deleteArchive - calls prisma.delete and revalidates', async () => {
    mockArchive.delete.mockResolvedValue({ id: 'to-delete' })
    await archivesModule.deleteArchive('00000000-0000-0000-0000-000000000000')
    expect(mockArchive.delete).toHaveBeenCalled()
    expect((revalidatePath as any)).toHaveBeenCalledWith('/archives')
  })
})