'use client'

import { UploadDropzone } from "../../components/upload/UploadDropzone"
import { parseChatGPTZip } from "../../lib/utils/parseChatGPTZip"

interface UploadedFile {
  file: File
  content: ArrayBuffer
}

export default function UploadTestPage() {
  const handleUpload = async (files: UploadedFile[]) => {
    console.log('Files uploaded:', files)
    
    try {
      for (const { file, content } of files) {
        console.log(`Processing file: ${file.name} (${file.size} bytes)`)
        
        // Parse the ZIP file
        const result = await parseChatGPTZip(Buffer.from(content))
        
        console.log('Parse result:', {
          conversations: result.conversations.length,
          attachments: result.attachments.length,
          metadata: result.metadata
        })
        
        // Log first conversation details
        if (result.conversations.length > 0) {
          console.log('First conversation:', {
            id: result.conversations[0].id,
            title: result.conversations[0].title,
            messageCount: result.conversations[0].messages.length
          })
        }
      }
    } catch (error) {
      console.error('Error processing upload:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ChatGPT Archive Upload
          </h1>
          <p className="text-gray-600">
            Test the upload functionality
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <UploadDropzone 
            onUpload={handleUpload}
            maxFiles={1}
            className="mb-4"
          />
          
          <div className="text-sm text-gray-500 mt-4">
            <p><strong>Instructions:</strong></p>
            <ol className="list-decimal list-inside space-y-1 mt-2">
              <li>Export your ChatGPT conversations as a ZIP file</li>
              <li>Drag and drop the ZIP file above, or click to select</li>
              <li>Check the browser console for processing results</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}