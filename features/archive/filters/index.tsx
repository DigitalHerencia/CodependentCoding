'use client'

import React, { useState } from 'react'
import { SearchFilters } from './SearchFilters'
import { SearchResults } from './SearchResults'

// Type definitions based on the Archive schema
type Archive = {
  id: string
  userId: string
  title: string
  content: string
  attachments: any[]
  createdAt: string
  updatedAt: string
}

export function ArchiveSearchInterface() {
  const [archives, setArchives] = useState<Archive[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSearchQuery, setLastSearchQuery] = useState<string>('')

  const handleResults = (results: Archive[]) => {
    setArchives(results)
  }

  const handleLoading = (isLoading: boolean) => {
    setLoading(isLoading)
  }

  const handleError = (errorMessage: string | null) => {
    setError(errorMessage)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Archive Search</h1>
        <p className="mt-2 text-gray-600">
          Search through your archived ChatGPT conversations by title, content, or date range.
        </p>
      </div>

      <SearchFilters
        onResults={handleResults}
        onLoading={handleLoading}
        onError={handleError}
      />

      <SearchResults
        archives={archives}
        loading={loading}
        error={error}
        searchQuery={lastSearchQuery}
      />
    </div>
  )
}

// Export individual components as well
export { SearchFilters } from './SearchFilters'
export { SearchResults } from './SearchResults'