import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getArchive } from '../../../../lib/actions/archives'
import ArchiveDetail from '../../../../features/archive/ArchiveDetail'

interface ArchivePageProps {
  params: Promise<{ id: string }>
}

export default async function ArchivePage({ params }: ArchivePageProps) {
  const { id } = await params

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ArchiveDetailSkeleton />}>
        <ArchiveDetailServer id={id} />
      </Suspense>
    </div>
  )
}

async function ArchiveDetailServer({ id }: { id: string }) {
  const archive = await getArchive(id)

  if (!archive) {
    notFound()
  }

  return <ArchiveDetail archive={archive} />
}

function ArchiveDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  )
}