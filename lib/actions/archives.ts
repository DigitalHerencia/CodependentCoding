'use server'

import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// Validation schemas using Zod as required by the architecture
const AttachmentSchema = z.object({
  name: z.string(),
  size: z.number(),
  contentType: z.string(),
  url: z.string(),
  checksum: z.string(),
})

const CreateArchiveSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  attachments: z.array(AttachmentSchema).default([]),
})

const ArchiveIdSchema = z.string().uuid('Invalid archive ID')

export type CreateArchiveInput = z.infer<typeof CreateArchiveSchema>
export type Attachment = {
  name: string
  size: number
  contentType: string
  url: string
  checksum: string
}

export type Archive = {
  id: string
  userId: string
  title: string
  content: string
  attachments: Attachment[]
  createdAt: Date
  updatedAt: Date
}

/**
 * Safely parse/normalize attachments that come from Prisma (JsonValue | null | unknown)
 * Returns an array of Attachment objects or an empty array on invalid input.
 */
function parseAttachments(raw: unknown): Attachment[] {
  const parsed = z.array(AttachmentSchema).safeParse(raw ?? [])
  return parsed.success ? parsed.data : []
}

export async function createArchive(input: CreateArchiveInput): Promise<Archive> {
  const validatedInput = CreateArchiveSchema.parse(input)

  // For now, we'll use a mock user ID since Clerk auth isn't set up yet
  const mockUserId = 'mock-user-id'

  const created = await prisma.archive.create({
    data: {
      userId: mockUserId,
      title: validatedInput.title,
      content: validatedInput.content,
      // Prisma expects JSON for JSON columns; passing the typed array is fine
      attachments: validatedInput.attachments,
    },
  })

  revalidatePath('/archives')

  // Normalize attachments to the strongly-typed Attachment[]
  const normalized: Archive = {
    id: created.id,
    userId: created.userId,
    title: created.title,
    content: created.content,
    attachments: parseAttachments((created as { attachments?: unknown }).attachments),
    createdAt: created.createdAt,
    updatedAt: created.updatedAt,
  }

  return normalized
}

export async function getArchives(): Promise<Archive[]> {
  // For now, we'll get all archives. In a real app, this would be filtered by user
  const archives = await prisma.archive.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Map/normalize attachments to Attachment[]
  return archives.map((a) => ({
    id: a.id,
    userId: a.userId,
    title: a.title,
    content: a.content,
    attachments: parseAttachments((a as { attachments?: unknown }).attachments),
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  }))
}

export async function getArchive(id: string): Promise<Archive | null> {
  const validatedId = ArchiveIdSchema.parse(id)

  const archive = await prisma.archive.findUnique({
    where: {
      id: validatedId,
    },
  })

  if (!archive) return null

  return {
    id: archive.id,
    userId: archive.userId,
    title: archive.title,
    content: archive.content,
    attachments: parseAttachments((archive as { attachments?: unknown }).attachments),
    createdAt: archive.createdAt,
    updatedAt: archive.updatedAt,
  }
}

export async function deleteArchive(id: string): Promise<void> {
  const validatedId = ArchiveIdSchema.parse(id)

  await prisma.archive.delete({
    where: {
      id: validatedId,
    },
  })

  revalidatePath('/archives')
}