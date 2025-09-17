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

const markdownMessages: ConversationMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'Can you show me some **markdown** examples?'
  },
  {
    id: '2',
    role: 'assistant', 
    content: `# Markdown Examples

Here are some **markdown** formatting examples:

## Lists
1. First item
2. Second item  
3. Third item

## Links
Check out [React](https://react.dev) for more info.

> This is a blockquote with some important information.

And here's some \`inline code\` for you.`
  }
]

describe('ConversationViewer Visual Snapshots', () => {
  it('renders conversation viewer with messages', () => {
    const { container } = render(
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
    
    // Snapshot test for basic conversation view
    expect(container.firstChild).toMatchSnapshot('conversation-viewer-basic')
  })
  
  it('renders empty conversation viewer', () => {
    const { container } = render(
      <ConversationViewer 
        messages={[]}
        title="Empty Conversation"
      />
    )
    
    expect(screen.getByText('Empty Conversation')).toBeInTheDocument()
    expect(screen.getByText('0 messages')).toBeInTheDocument()
    expect(screen.getByText('No messages to display')).toBeInTheDocument()
    
    // Snapshot test for empty state
    expect(container.firstChild).toMatchSnapshot('conversation-viewer-empty')
  })
  
  it('renders conversation with markdown content and validates markdown rendering', () => {
    const { container } = render(
      <ConversationViewer 
        messages={markdownMessages}
        title="Markdown Test"
      />
    )
    
    // Test markdown rendering
    expect(screen.getByText('Markdown Examples')).toBeInTheDocument()
    expect(screen.getByText('function hello() {')).toBeInTheDocument()
    expect(screen.getByText('First item')).toBeInTheDocument()
    expect(screen.getByText('inline code')).toBeInTheDocument()
    
    // Test that links are rendered correctly
    const reactLink = screen.getByRole('link', { name: /react/i })
    expect(reactLink).toHaveAttribute('href', 'https://react.dev')
    expect(reactLink).toHaveAttribute('target', '_blank')
    
    // Snapshot test for markdown rendering
    expect(container.firstChild).toMatchSnapshot('conversation-viewer-markdown')
  })
  
  it('renders with close handler and accessibility features', () => {
    const mockClose = () => {}
    const { container } = render(
      <ConversationViewer 
        messages={mockMessages}
        title="Closeable Conversation"
        onClose={mockClose}
      />
    )
    
    // Should have close button
    const closeButton = screen.getByLabelText(/close viewer/i)
    expect(closeButton).toBeInTheDocument()
    expect(closeButton).toHaveAttribute('title', 'Close (Esc)')
    
    // Check accessibility attributes
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-label', 'Conversation viewer: Closeable Conversation')
    expect(dialog).toHaveAttribute('tabIndex', '0')
    
    // Check theme and fullscreen buttons
    expect(screen.getByLabelText(/switch to dark theme/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/enter fullscreen/i)).toBeInTheDocument()
    
    // Snapshot test for closeable viewer
    expect(container.firstChild).toMatchSnapshot('conversation-viewer-with-close')
  })
  
  it('handles role-specific styling and theming', () => {
    const roleMessages: ConversationMessage[] = [
      { id: '1', role: 'system', content: 'System message' },
      { id: '2', role: 'user', content: 'User message' },
      { id: '3', role: 'assistant', content: 'Assistant message' }
    ]
    
    const { container } = render(
      <ConversationViewer messages={roleMessages} title="Role Test" />
    )
    
    // Each role should be present
    expect(screen.getByText('system')).toBeInTheDocument()
    expect(screen.getByText('user')).toBeInTheDocument()  
    expect(screen.getByText('assistant')).toBeInTheDocument()
    
    // Check that role-specific articles are present
    expect(screen.getByRole('article', { name: /system message/i })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: /user message/i })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: /assistant message/i })).toBeInTheDocument()
    
    // Snapshot test for role styling
    expect(container.firstChild).toMatchSnapshot('conversation-viewer-roles')
  })
  
  it('renders with custom className and maintains styling', () => {
    const { container } = render(
      <ConversationViewer 
        messages={mockMessages}
        title="Custom Styled"
        className="border-2 border-red-500 custom-viewer"
      />
    )
    
    expect(container.firstChild).toHaveClass('border-2', 'border-red-500', 'custom-viewer')
    
    // Should still have functional elements despite custom styling
    expect(screen.getByText('Custom Styled')).toBeInTheDocument()
    expect(screen.getByLabelText(/switch to dark theme/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/enter fullscreen/i)).toBeInTheDocument()
    
    // Snapshot test for custom styling
    expect(container.firstChild).toMatchSnapshot('conversation-viewer-custom')
  })
})