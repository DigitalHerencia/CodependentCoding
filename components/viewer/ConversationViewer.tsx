'use client'

import { useState, useCallback } from 'react'
import MessageBlock from './MessageBlock'
import ThemeSwitch from './ThemeSwitch'

export interface ConversationMessage {
  id: string
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp?: Date
}

export interface ConversationViewerProps {
  messages: ConversationMessage[]
  title?: string
  className?: string
  onClose?: () => void
}

export default function ConversationViewer({
  messages,
  title = 'Conversation',
  className = '',
  onClose
}: ConversationViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light')

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev)
  }, [])

  const handleThemeChange = useCallback((theme: 'light' | 'dark') => {
    setCurrentTheme(theme)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (isFullscreen) {
        setIsFullscreen(false)
      } else if (onClose) {
        onClose()
      }
    }
    if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      toggleFullscreen()
    }
  }, [isFullscreen, onClose, toggleFullscreen])

  const containerClass = `
    ${isFullscreen ? 'fixed inset-0 z-50' : 'relative'} 
    ${currentTheme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}
    ${className}
    transition-all duration-300 ease-in-out
    focus:outline-none
  `.trim()

  return (
    <div 
      className={containerClass}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-label={`Conversation viewer: ${title}`}
    >
      {/* Header */}
      <header className={`
        sticky top-0 z-10 
        ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} 
        border-b px-6 py-4 flex items-center justify-between
      `}>
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold truncate">{title}</h1>
          <span className="text-sm opacity-70">
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeSwitch 
            currentTheme={currentTheme} 
            onThemeChange={handleThemeChange}
          />
          
          <button
            onClick={toggleFullscreen}
            className={`
              p-2 rounded-md transition-colors
              ${currentTheme === 'dark' 
                ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                : 'hover:bg-gray-200 text-gray-600 hover:text-black'
              }
            `}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Enter fullscreen (Ctrl+F)'}
          >
            {isFullscreen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15h4.5M15 15v4.5m0-4.5l5.5 5.5" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className={`
                p-2 rounded-md transition-colors
                ${currentTheme === 'dark' 
                  ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                  : 'hover:bg-gray-200 text-gray-600 hover:text-black'
                }
              `}
              aria-label="Close viewer"
              title="Close (Esc)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-12 opacity-60">
              <p>No messages to display</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <MessageBlock
                key={message.id || index}
                message={message}
                theme={currentTheme}
                isFirst={index === 0}
                isLast={index === messages.length - 1}
              />
            ))
          )}
        </div>
      </main>

      {/* Timeline Navigation (placeholder for future enhancement) */}
      {messages.length > 5 && (
        <div className={`
          sticky bottom-0 
          ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} 
          border-t px-6 py-2
        `}>
          <div className="text-xs opacity-70 text-center">
            Timeline navigation (coming soon)
          </div>
        </div>
      )}
    </div>
  )
}