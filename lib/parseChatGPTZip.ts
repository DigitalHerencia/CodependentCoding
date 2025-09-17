import JSZip from 'jszip'

// Type definitions for ChatGPT export data structures
export interface ChatGPTMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: string
  attachments?: string[]
}

export interface ChatGPTConversation {
  id: string
  title: string
  messages: ChatGPTMessage[]
  created_at: string
  updated_at?: string
  metadata?: Record<string, unknown>
}

export interface ParsedAttachment {
  name: string
  content: Buffer
  contentType: string
  size: number
  relativePath: string
}

export interface ParsedZipResult {
  conversations: ChatGPTConversation[]
  attachments: ParsedAttachment[]
  metadata?: Record<string, unknown>
}

/**
 * Parses a ChatGPT export ZIP file and extracts conversations and attachments
 * @param zipBuffer - The ZIP file as a Buffer
 * @returns Promise<ParsedZipResult> - Parsed conversations and attachments
 */
export async function parseChatGPTZip(zipBuffer: Buffer): Promise<ParsedZipResult> {
  // Input validation
  if (!zipBuffer || zipBuffer.length === 0) {
    throw new Error(zipBuffer === null || zipBuffer === undefined ? 'Invalid input' : 'Empty ZIP file')
  }

  try {
    const zip = new JSZip()
    const zipContent = await zip.loadAsync(zipBuffer)
    
    const conversations: ChatGPTConversation[] = []
    const attachments: ParsedAttachment[] = []
    
    // Process all files in the ZIP
    await Promise.all(
      Object.keys(zipContent.files).map(async (filename) => {
        const file = zipContent.files[filename]
        
        // Skip directories
        if (file.dir) {
          return
        }
        
        try {
          // Handle JSON conversation files
          if (filename.toLowerCase().endsWith('.json') && !filename.includes('/')) {
            // Main conversation files are usually in the root
            const jsonContent = await file.async('text')
            const conversationData = JSON.parse(jsonContent)
            
            // Validate and normalize conversation structure
            const conversation = normalizeConversation(conversationData, filename)
            if (conversation) {
              conversations.push(conversation)
            }
          }
          // Handle attachment files
          else if (isAttachmentFile(filename)) {
            const content = await file.async('nodebuffer')
            const attachment: ParsedAttachment = {
              name: getBasename(filename),
              content,
              contentType: inferContentType(filename),
              size: content.length,
              relativePath: filename
            }
            attachments.push(attachment)
          }
        } catch (error) {
          console.warn(`Failed to process file ${filename}:`, error)
          // Continue processing other files
        }
      })
    )
    
    return {
      conversations,
      attachments,
      metadata: {
        totalFiles: Object.keys(zipContent.files).length,
        processedConversations: conversations.length,
        processedAttachments: attachments.length
      }
    }
  } catch (error) {
    if (error instanceof Error && (
      error.message.includes('Invalid or unsupported zip format') ||
      error.message.includes("Can't find end of central directory")
    )) {
      throw new Error('Invalid ZIP file')
    }
    throw error
  }
}

/**
 * Normalizes conversation data from ChatGPT export format
 */
function normalizeConversation(data: unknown, filename: string): ChatGPTConversation | null {
  try {
    if (!data || typeof data !== 'object') {
      return null
    }
    
    // ChatGPT exports can have different formats, handle common structures
    let conversationData = data as Record<string, unknown>
    
    // If the data has a 'conversation' wrapper
    if (conversationData.conversation && typeof conversationData.conversation === 'object') {
      conversationData = conversationData.conversation as Record<string, unknown>
    }
    
    // Extract basic info
    const id = conversationData.id || conversationData.conversation_id || generateIdFromFilename(filename)
    const title = conversationData.title || conversationData.name || 'Untitled Conversation'
    const created_at = conversationData.create_time || conversationData.created_at || new Date().toISOString()
    
    // Extract and normalize messages
    const messages: ChatGPTMessage[] = []
    const messageData = conversationData.messages || conversationData.mapping || []
    
    if (Array.isArray(messageData)) {
      // Direct messages array
      messageData.forEach((msg: unknown) => {
        const normalizedMsg = normalizeMessage(msg)
        if (normalizedMsg) {
          messages.push(normalizedMsg)
        }
      })
    } else if (messageData && typeof messageData === 'object') {
      // Mapping format (common in ChatGPT exports)
      Object.values(messageData as Record<string, unknown>).forEach((msg: unknown) => {
        if (msg && typeof msg === 'object') {
          const msgObj = msg as Record<string, unknown>
          const normalizedMsg = normalizeMessage(msgObj.message || msg)
          if (normalizedMsg) {
            messages.push(normalizedMsg)
          }
        }
      })
    }
    
    // Only return conversations with messages
    if (messages.length === 0) {
      return null
    }

    return {
      id: id as string,
      title: title as string,
      messages,
      created_at: created_at as string,
      updated_at: (conversationData.update_time || conversationData.updated_at) as string | undefined,
      metadata: {
        originalFilename: filename,
        messageCount: messages.length
      }
    }
  } catch (error) {
    console.warn(`Failed to normalize conversation from ${filename}:`, error)
    return null
  }
}

/**
 * Normalizes message data from ChatGPT export format
 */
function normalizeMessage(msg: unknown): ChatGPTMessage | null {
  if (!msg || typeof msg !== 'object') {
    return null
  }
  
  const msgObj = msg as Record<string, unknown>
  
  if (!msgObj.content) {
    return null
  }
  
  // Handle different message content formats
  let content = ''
  let role: 'user' | 'assistant' | 'system' = 'user'
  
  // Extract role
  if (typeof msgObj.role === 'string' && ['user', 'assistant', 'system'].includes(msgObj.role)) {
    role = msgObj.role as 'user' | 'assistant' | 'system'
  } else if (msgObj.author && typeof msgObj.author === 'object') {
    const authorObj = msgObj.author as Record<string, unknown>
    if (typeof authorObj.role === 'string' && ['user', 'assistant', 'system'].includes(authorObj.role)) {
      role = authorObj.role as 'user' | 'assistant' | 'system'
    }
  }
  
  // Extract content
  if (typeof msgObj.content === 'string') {
    content = msgObj.content
  } else if (msgObj.content && typeof msgObj.content === 'object') {
    const contentObj = msgObj.content as Record<string, unknown>
    if (contentObj.parts && Array.isArray(contentObj.parts)) {
      content = contentObj.parts.filter(part => typeof part === 'string').join(' ')
    } else if (typeof contentObj.text === 'string') {
      content = contentObj.text
    }
  }
  
  if (!content || content.trim().length === 0) {
    return null
  }
  
  return {
    role,
    content: content.trim(),
    timestamp: typeof msgObj.create_time === 'string' ? msgObj.create_time : (typeof msgObj.timestamp === 'string' ? msgObj.timestamp : undefined),
    attachments: Array.isArray(msgObj.attachments) ? msgObj.attachments.filter(att => typeof att === 'string') : []
  }
}

/**
 * Check if a file is an attachment (not a JSON conversation file)
 */
function isAttachmentFile(filename: string): boolean {
  const lowerFilename = filename.toLowerCase()
  
  // Skip JSON files (these are conversations)
  if (lowerFilename.endsWith('.json')) {
    return false
  }
  
  // Skip system/meta files
  if (lowerFilename.includes('__macosx') || lowerFilename.startsWith('.')) {
    return false
  }
  
  // Common attachment file types
  const attachmentExtensions = [
    '.pdf', '.doc', '.docx', '.txt', '.md',
    '.jpg', '.jpeg', '.png', '.gif', '.webp',
    '.mp4', '.mov', '.avi', '.mp3', '.wav',
    '.zip', '.tar', '.gz', '.csv', '.xlsx'
  ]
  
  return attachmentExtensions.some(ext => lowerFilename.endsWith(ext))
}

/**
 * Infer content type from filename
 */
function inferContentType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop()
  
  const mimeTypes: Record<string, string> = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'txt': 'text/plain',
    'md': 'text/markdown',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'mp4': 'video/mp4',
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'zip': 'application/zip',
    'csv': 'text/csv',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }
  
  return mimeTypes[ext || ''] || 'application/octet-stream'
}

/**
 * Get basename from filepath
 */
function getBasename(filepath: string): string {
  return filepath.split('/').pop() || filepath
}

/**
 * Generate ID from filename if no ID is provided
 */
function generateIdFromFilename(filename: string): string {
  return filename.replace('.json', '').replace(/[^a-zA-Z0-9]/g, '_')
}