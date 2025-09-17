import { TagManager } from '../../features/tags/tag-manager';

// Demo page to show tag functionality
export default function TagDemo() {
  // Mock data for demo
  const mockArchiveId = '550e8400-e29b-41d4-a716-446655440000';
  const mockTags = ['javascript', 'programming', 'web-development'];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tag Management Demo</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Archive: Sample ChatGPT Conversation</h2>
        
        <div className="mb-6">
          <p className="text-gray-600">
            This is a demo page showing the tag management functionality. In a real application, 
            this would be integrated into archive detail pages.
          </p>
        </div>

        <TagManager
          archiveId={mockArchiveId}
          initialTags={mockTags}
        />
      </div>

      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">Features Demonstrated:</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Display existing tags with remove functionality</li>
          <li>Add new tags manually using the input field</li>
          <li>Auto-generate suggested tags based on content</li>
          <li>Click suggested tags to add them quickly</li>
          <li>Error handling and loading states</li>
        </ul>
      </div>
    </div>
  );
}