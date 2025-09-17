'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface UploadedFile {
  file: File
  content: ArrayBuffer
}

interface UploadDropzoneProps {
  onUpload?: (files: UploadedFile[]) => void
  maxFiles?: number
  acceptedFileTypes?: Record<string, string[]>
  className?: string
}

export function UploadDropzone({
  onUpload,
  maxFiles = 1,
  acceptedFileTypes = {
    'application/zip': ['.zip']
  },
  className = ''
}: UploadDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true)
    setUploadError(null)

    try {
      const uploadedFiles: UploadedFile[] = []
      
      for (const file of acceptedFiles) {
        // Validate file type
        if (!file.name.toLowerCase().endsWith('.zip')) {
          throw new Error('Only ZIP files are supported')
        }
        
        // Read file content
        const content = await file.arrayBuffer()
        
        uploadedFiles.push({
          file,
          content
        })
      }

      // Call the upload callback
      if (onUpload) {
        await onUpload(uploadedFiles)
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept: acceptedFileTypes,
    disabled: isUploading
  })

  return (
    <div className={`upload-dropzone ${className}`}>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="text-4xl">📁</div>
          
          {isUploading ? (
            <div className="space-y-2">
              <div className="text-lg font-medium text-gray-600">Processing...</div>
              <div className="text-sm text-gray-500">Please wait while we process your file</div>
            </div>
          ) : isDragActive ? (
            <div className="space-y-2">
              <div className="text-lg font-medium text-blue-600">Drop your ZIP file here</div>
              <div className="text-sm text-gray-500">Release to upload</div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-lg font-medium text-gray-700">
                Drag & drop your ChatGPT export ZIP file here
              </div>
              <div className="text-sm text-gray-500">
                or <span className="text-blue-600 font-medium">click to browse</span>
              </div>
              <div className="text-xs text-gray-400">
                Only ZIP files are supported (max {maxFiles} file{maxFiles > 1 ? 's' : ''})
              </div>
            </div>
          )}
        </div>
      </div>
      
      {uploadError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="text-sm text-red-600">
            <span className="font-medium">Upload failed: </span>
            {uploadError}
          </div>
        </div>
      )}
    </div>
  )
}

export default UploadDropzone