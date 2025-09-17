'use client'

import React from 'react'

export interface TimelineDataPoint {
  timestamp: string
  tokenCount: number
  messageCount?: number
}

export interface TimelineChartProps {
  data: TimelineDataPoint[]
  width?: number
  height?: number
}

export function TimelineChart({ data, width = 800, height = 400 }: TimelineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-64 bg-gray-50 border border-gray-200 rounded">
        <p className="text-gray-500">No data available</p>
      </div>
    )
  }

  // Calculate chart dimensions and margins
  const margin = { top: 20, right: 30, bottom: 40, left: 60 }
  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom

  // Find min/max values for scaling
  const maxTokens = Math.max(...data.map(d => d.tokenCount))
  const minTokens = Math.min(...data.map(d => d.tokenCount))
  
  // Create scales
  const xScale = (index: number) => (index / (data.length - 1)) * chartWidth
  const yScale = (value: number) => chartHeight - ((value - minTokens) / (maxTokens - minTokens)) * chartHeight

  // Generate path data for the line
  const pathData = data.map((point, index) => {
    const x = xScale(index)
    const y = yScale(point.tokenCount)
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  // Generate tick marks for x-axis (show every 3rd point or max 10 ticks)
  const tickInterval = Math.max(1, Math.floor(data.length / 10))
  const xTicks = data.filter((_, index) => index % tickInterval === 0)

  // Generate y-axis ticks
  const yTickCount = 5
  const yTicks = Array.from({ length: yTickCount }, (_, i) => {
    const value = minTokens + (i / (yTickCount - 1)) * (maxTokens - minTokens)
    return Math.round(value)
  })

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Token Usage Timeline</h3>
        <p className="text-sm text-gray-600">Token counts over time</p>
      </div>
      
      <svg width={width} height={height} className="border border-gray-200 bg-white">
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Grid lines */}
          {yTicks.map((tick) => (
            <line
              key={tick}
              x1={0}
              y1={yScale(tick)}
              x2={chartWidth}
              y2={yScale(tick)}
              stroke="#f0f0f0"
              strokeWidth={1}
            />
          ))}
          
          {/* Y-axis */}
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={chartHeight}
            stroke="#666"
            strokeWidth={2}
          />
          
          {/* X-axis */}
          <line
            x1={0}
            y1={chartHeight}
            x2={chartWidth}
            y2={chartHeight}
            stroke="#666"
            strokeWidth={2}
          />
          
          {/* Y-axis labels */}
          {yTicks.map((tick) => (
            <g key={tick}>
              <text
                x={-10}
                y={yScale(tick) + 4}
                textAnchor="end"
                fontSize="12"
                fill="#666"
              >
                {tick.toLocaleString()}
              </text>
            </g>
          ))}
          
          {/* X-axis labels */}
          {xTicks.map((point, index) => {
            const originalIndex = data.indexOf(point)
            return (
              <g key={originalIndex}>
                <text
                  x={xScale(originalIndex)}
                  y={chartHeight + 20}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#666"
                >
                  {new Date(point.timestamp).toLocaleDateString()}
                </text>
              </g>
            )
          })}
          
          {/* Data line */}
          <path
            d={pathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          
          {/* Data points */}
          {data.map((point, index) => (
            <circle
              key={index}
              cx={xScale(index)}
              cy={yScale(point.tokenCount)}
              r={4}
              fill="#3b82f6"
              stroke="white"
              strokeWidth={2}
            >
              <title>
                {`${new Date(point.timestamp).toLocaleDateString()}: ${point.tokenCount.toLocaleString()} tokens`}
              </title>
            </circle>
          ))}
        </g>
        
        {/* Axis labels */}
        <text
          x={width / 2}
          y={height - 5}
          textAnchor="middle"
          fontSize="14"
          fill="#333"
        >
          Date
        </text>
        
        <text
          x={15}
          y={height / 2}
          textAnchor="middle"
          fontSize="14"
          fill="#333"
          transform={`rotate(-90, 15, ${height / 2})`}
        >
          Token Count
        </text>
      </svg>
    </div>
  )
}

export default TimelineChart