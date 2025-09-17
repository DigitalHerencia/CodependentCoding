'use client'

import ReactMarkdown from 'react-markdown'
import { ConversationMessage } from './ConversationViewer'

export interface MessageBlockProps {
  message: ConversationMessage
  theme: 'light' | 'dark'
  isFirst?: boolean
  isLast?: boolean
}

function getRoleIcon(role: ConversationMessage['role']) {
  switch (role) {
    case 'system':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    case 'user':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    case 'assistant':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    default:
      return null
  }
}

function getRoleColor(role: ConversationMessage['role'], theme: 'light' | 'dark') {
  const colors = {
    system: theme === 'dark' ? 'text-purple-400 bg-purple-900/20' : 'text-purple-700 bg-purple-50',
    user: theme === 'dark' ? 'text-blue-400 bg-blue-900/20' : 'text-blue-700 bg-blue-50',
    assistant: theme === 'dark' ? 'text-green-400 bg-green-900/20' : 'text-green-700 bg-green-50',
  }
  return colors[role] || ''
}

function MarkdownComponents(theme: 'light' | 'dark') {
  return {
    // Headings
    h1: ({ children }: { children: React.ReactNode }) => (
      <h1 className="text-2xl font-bold mb-4 mt-6">{children}</h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="text-xl font-semibold mb-3 mt-5">{children}</h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="text-lg font-medium mb-2 mt-4">{children}</h3>
    ),
    
    // Code blocks
    code: ({ inline, children }: { inline?: boolean; children: React.ReactNode }) => (
      inline ? (
        <code className={`
          px-1 py-0.5 rounded text-sm font-mono
          ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800'}
        `}>
          {children}
        </code>
      ) : null // Will be handled by pre component
    ),
    
    // Pre-formatted text (code blocks)
    pre: ({ children }: { children: React.ReactNode }) => (
      <div className={`
        p-4 rounded-lg overflow-x-auto text-sm font-mono my-4
        ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800'}
      `}>
        {children}
      </div>
    ),
    
    // Lists
    ul: ({ children }: { children: React.ReactNode }) => (
      <ul className="list-disc list-inside space-y-1 my-3 pl-4">{children}</ul>
    ),
    ol: ({ children }: { children: React.ReactNode }) => (
      <ol className="list-decimal list-inside space-y-1 my-3 pl-4">{children}</ol>
    ),
    
    // Paragraphs
    p: ({ children }: { children: React.ReactNode }) => (
      <p className="mb-3 leading-relaxed">{children}</p>
    ),
    
    // Blockquotes
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <blockquote className={`
        border-l-4 pl-4 my-4 italic
        ${theme === 'dark' ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'}
      `}>
        {children}
      </blockquote>
    ),
    
    // Links
    a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`
          underline decoration-2 underline-offset-2 hover:decoration-4 transition-all
          ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}
        `}
      >
        {children}
      </a>
    ),
  }
}

export default function MessageBlock({ 
  message, 
  theme, 
  isFirst = false, 
  isLast = false 
}: MessageBlockProps) {
  const roleColor = getRoleColor(message.role, theme)
  const roleIcon = getRoleIcon(message.role)
  const timestamp = message.timestamp ? new Date(message.timestamp).toLocaleString() : null

  return (
    <div 
      className={`
        flex gap-4 group
        ${isFirst ? 'pt-0' : ''} 
        ${isLast ? 'pb-0' : ''}
      `}
      role="article"
      aria-label={`${message.role} message`}
    >
      {/* Role indicator */}
      <div className="flex-shrink-0">
        <div className={`
          w-10 h-10 rounded-full flex items-center justify-center
          ${roleColor}
          transition-all duration-200
          group-hover:scale-105
        `}>
          {roleIcon}
        </div>
      </div>
      
      {/* Message content */}
      <div className="flex-1 min-w-0">
        {/* Role and timestamp header */}
        <div className="flex items-baseline gap-3 mb-2">
          <span className="font-medium capitalize text-sm">
            {message.role}
          </span>
          {timestamp && (
            <span className="text-xs opacity-60 font-mono">
              {timestamp}
            </span>
          )}
        </div>
        
        {/* Message content with markdown */}
        <div className={`
          prose prose-sm max-w-none
          ${theme === 'dark' ? 'prose-invert' : ''}
        `}>
          <ReactMarkdown 
            components={MarkdownComponents(theme)}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}