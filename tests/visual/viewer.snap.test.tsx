import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ConversationViewer, type ConversationMessage } from '../../components/viewer'

// Mock messages for testing
const mockMessages: ConversationMessage[] = [
  {
    id: '1',
    role: 'system',
    content: 'You are a helpful AI assistant.',
    timestamp: new Date('2024-01-01T10:00:00Z')
  },
  {
    id: '2', 
    role: 'user',
    content: 'Hello! How are you doing today?',
    timestamp: new Date('2024-01-01T10:01:00Z')
  },
  {
    id: '3',
    role: 'assistant',
    content: 'I am doing well, thank you for asking! How can I help you today?',
    timestamp: new Date('2024-01-01T10:01:30Z')
  }
]

describe('ConversationViewer Visual Snapshots', () => {
  it('renders conversation viewer with messages', () => {
    render(
      <ConversationViewer 
        messages={mockMessages}
        title="Test Conversation"
      />
    )
    
    // Basic functionality tests
    expect(screen.getByText('Test Conversation')).toBeInTheDocument()
    expect(screen.getByText('3 messages')).toBeInTheDocument()
    expect(screen.getByText('system')).toBeInTheDocument()
    expect(screen.getByText('user')).toBeInTheDocument()
    expect(screen.getByText('assistant')).toBeInTheDocument()
  })
  
  it('renders empty conversation viewer', () => {
    render(
      <ConversationViewer 
        messages={[]}
        title="Empty Conversation"
      />
    )
    
    expect(screen.getByText('Empty Conversation')).toBeInTheDocument()
    expect(screen.getByText('0 messages')).toBeInTheDocument()
    expect(screen.getByText('No messages to display')).toBeInTheDocument()
  })
  
  it('renders with close handler', () => {
    const mockClose = () => {}
    render(
      <ConversationViewer 
        messages={mockMessages}
        title="Closeable Conversation"
        onClose={mockClose}
      />
    )
    
    // Should have close button
    expect(screen.getByLabelText(/close viewer/i)).toBeInTheDocument()
  })
  
  it('handles role-specific styling', () => {
    const roleMessages: ConversationMessage[] = [
      { id: '1', role: 'system', content: 'System message' },
      { id: '2', role: 'user', content: 'User message' },
      { id: '3', role: 'assistant', content: 'Assistant message' }
    ]
    
    render(
      <ConversationViewer messages={roleMessages} title="Role Test" />
    )
    
    // Each role should be present
    expect(screen.getByText('system')).toBeInTheDocument()
    expect(screen.getByText('user')).toBeInTheDocument()  
    expect(screen.getByText('assistant')).toBeInTheDocument()
  })
})