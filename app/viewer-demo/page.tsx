import { ConversationViewer } from '../../components/viewer'
import { ConversationMessage } from '../../components/viewer/ConversationViewer'

const sampleMessages: ConversationMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'Hello! Can you help me with React components?',
    timestamp: new Date()
  },
  {
    id: '2',
    role: 'assistant',
    content: `Of course! I'd be happy to help you with React components.

Here are some key concepts:

## Function Components
\`\`\`jsx
function MyComponent() {
  return <div>Hello World</div>
}
\`\`\`

## Key Features
1. **Props** - Data passed to components
2. **State** - Internal component data  
3. **Hooks** - Functions like useState, useEffect

Would you like me to explain any of these topics in more detail?`,
    timestamp: new Date()
  }
]

export default function ViewerDemo() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-8">ConversationViewer Demo</h1>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <ConversationViewer
          messages={sampleMessages}
          title="Demo Conversation"
        />
      </div>
    </div>
  )
}