import Link from 'next/link'
import { Archive } from '../../lib/actions/archives'

interface ArchiveCardProps {
  archive: Archive
}

export default function ArchiveCard({ archive }: ArchiveCardProps) {
  // Format the date
  const formattedDate = new Date(archive.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  // Truncate content for preview
  const previewContent = archive.content.length > 150 
    ? archive.content.substring(0, 150) + '...'
    : archive.content

  // Count attachments
  const attachmentCount = Array.isArray(archive.attachments) ? archive.attachments.length : 0

  return (
    <Link href={`/archives/${archive.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 h-full">
        <div className="flex flex-col h-full">
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 line-clamp-2 mb-2">
              {archive.title}
            </h3>
            
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
              {previewContent}
            </p>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
            <span>{formattedDate}</span>
            
            {attachmentCount > 0 && (
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <span>{attachmentCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}