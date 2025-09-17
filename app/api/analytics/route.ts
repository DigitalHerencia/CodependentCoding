import { NextRequest, NextResponse } from 'next/server'

export interface AnalyticsTimelineBucket {
  timestamp: string
  tokenCount: number
  messageCount: number
}

export interface AnalyticsResponse {
  data: AnalyticsTimelineBucket[]
  totalTokens: number
  totalMessages: number
  dateRange: {
    start: string
    end: string
  }
}

// Sample data generator for demonstration
function generateSampleData(): AnalyticsTimelineBucket[] {
  const data: AnalyticsTimelineBucket[] = []
  const now = new Date()
  
  // Generate 30 days of sample data
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    // Generate realistic but random token counts
    const baseTokenCount = 1000 + Math.random() * 500
    const variation = Math.sin((i / 29) * Math.PI * 2) * 300
    const tokenCount = Math.round(Math.max(100, baseTokenCount + variation))
    
    // Generate message count (roughly 1 message per 50-150 tokens)
    const messageCount = Math.round(tokenCount / (50 + Math.random() * 100))
    
    data.push({
      timestamp: date.toISOString(),
      tokenCount,
      messageCount
    })
  }
  
  return data
}

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30', 10)
    const userId = searchParams.get('userId')
    
    // For now, generate sample data
    // In a real implementation, this would query the database
    const sampleData = generateSampleData()
    
    // Apply days filter
    const filteredData = sampleData.slice(-Math.min(days, 30))
    
    // Calculate totals
    const totalTokens = filteredData.reduce((sum, item) => sum + item.tokenCount, 0)
    const totalMessages = filteredData.reduce((sum, item) => sum + item.messageCount, 0)
    
    const response: AnalyticsResponse = {
      data: filteredData,
      totalTokens,
      totalMessages,
      dateRange: {
        start: filteredData[0]?.timestamp || new Date().toISOString(),
        end: filteredData[filteredData.length - 1]?.timestamp || new Date().toISOString()
      }
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

// POST endpoint for future use (e.g., recording new token usage)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.tokenCount || !body.timestamp) {
      return NextResponse.json(
        { error: 'tokenCount and timestamp are required' },
        { status: 400 }
      )
    }
    
    // For now, just return success
    // In a real implementation, this would save to database
    return NextResponse.json(
      { success: true, message: 'Analytics data recorded' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Analytics POST error:', error)
    return NextResponse.json(
      { error: 'Failed to record analytics data' },
      { status: 500 }
    )
  }
}