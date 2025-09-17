'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { z } from 'zod'

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

type SearchFilters = {
  q?: string
  startDate?: string
  endDate?: string
}

interface SearchFiltersProps {
  onResults: (archives: Archive[]) => void
  onLoading: (loading: boolean) => void
  onError: (error: string | null) => void
}

const searchParamsSchema = z.object({
  q: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export function SearchFilters({ onResults, onLoading, onError }: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>({})
  const [isLoading, setIsLoading] = useState(false)

  const performSearch = useCallback(async (searchFilters: SearchFilters) => {
    setIsLoading(true)
    onLoading(true)
    onError(null)

    try {
      // Build query parameters
      const params = new URLSearchParams()
      
      if (searchFilters.q?.trim()) {
        params.append('q', searchFilters.q.trim())
      }
      if (searchFilters.startDate) {
        params.append('startDate', searchFilters.startDate)
      }
      if (searchFilters.endDate) {
        params.append('endDate', searchFilters.endDate)
      }

      const response = await fetch(`/api/search?${params.toString()}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Search failed with status ${response.status}`)
      }

      const archives: Archive[] = await response.json()
      onResults(archives)
    } catch (error) {
      console.error('Search error:', error)
      onError(error instanceof Error ? error.message : 'Search failed')
      onResults([])
    } finally {
      setIsLoading(false)
      onLoading(false)
    }
  }, [onResults, onLoading, onError])

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
  }

  const handleSearch = () => {
    performSearch(filters)
  }

  const handleReset = () => {
    setFilters({})
    performSearch({})
  }

  // Auto-search when filters change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(filters)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [filters, performSearch])

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Search & Filters</h3>
      
      {/* Search Query */}
      <div>
        <label htmlFor="search-query" className="block text-sm font-medium text-gray-700 mb-2">
          Search Archives
        </label>
        <input
          id="search-query"
          type="text"
          placeholder="Search by title or content..."
          value={filters.q || ''}
          onChange={(e) => handleFilterChange({ q: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Date Range Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            id="start-date"
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => handleFilterChange({ startDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            id="end-date"
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => handleFilterChange({ endDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
        
        <button
          onClick={handleReset}
          disabled={isLoading}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear Filters
        </button>
      </div>

      {/* Search Status */}
      {isLoading && (
        <div className="text-sm text-gray-500 italic">
          Searching archives...
        </div>
      )}
    </div>
  )
}