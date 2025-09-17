import { describe, it, expect } from 'vitest'
import JSZip from 'jszip'
import { parseChatGPTZip } from '../../lib/utils/parseChatGPTZip'

describe('parseChatGPTZip', () => {
  it('parses a ZIP with a JSON conversation and an attachment', async () => {
    const zip = new JSZip()

    // Conversation using a messages array and mixed content shapes
    const conversation = {
      id: 'conv-1',
      title: 'Test Conversation',
      create_time: '2025-01-01T00:00:00Z',
      messages: [
        // simple string content
        { role: 'user', content: 'Hello', create_time: '2025-01-01T00:00:01Z' },
        // content as object with parts
        { role: 'assistant', content: { parts: ['Hi', 'there'] }, timestamp: '2025-01-01T00:00:02Z' },
      ],
    }

    zip.file('conv1.json', JSON.stringify(conversation))

    // Add an attachment (binary)
    zip.file('images/pic.png', Buffer.from([0x89, 0x50, 0x4e, 0x47]))

    const buf = await zip.generateAsync({ type: 'nodebuffer' })

    const result = await parseChatGPTZip(buf)

    expect(result.conversations.length).toBe(1)
    const conv = result.conversations[0]
    expect(conv.id).toBe('conv-1')
    expect(conv.messages.length).toBe(2)
    expect(conv.messages[0].content).toBe('Hello')
    expect(conv.messages[1].content).toContain('Hi')

    expect(result.attachments.length).toBe(1)
    expect(result.attachments[0].name).toBe('pic.png')
    expect(result.attachments[0].size).toBeGreaterThan(0)
  })

  it('throws on empty buffer', async () => {
    const empty = Buffer.alloc(0)
    await expect(parseChatGPTZip(empty)).rejects.toThrow(/Empty ZIP file/)
  })

  it('throws on invalid ZIP data', async () => {
    const notZip = Buffer.from('this is not a zip')
    await expect(parseChatGPTZip(notZip)).rejects.toThrow()
  })
})