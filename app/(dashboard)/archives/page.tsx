import { Suspense } from 'react'
import { getArchives } from '../../../lib/actions/archives'
import ArchiveList from '../../../features/archive/ArchiveList'

export default async function ArchivesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Archives</h1>
        <p className="text-gray-600 mt-2">Browse and manage your ChatGPT conversation archives</p>
      </div>

      <Suspense fallback={<ArchiveListSkeleton />}>
        <ArchiveListServer />
      </Suspense>
    </div>
  )
}

async function ArchiveListServer() {
  const archives = await getArchives()
  return <ArchiveList archives={archives} />
}

function ArchiveListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  )
}