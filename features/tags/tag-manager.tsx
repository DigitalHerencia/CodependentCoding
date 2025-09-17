'use client';

import { useState, useTransition } from 'react';
import { TagList } from '../../components/tag';
import { TagInput } from '../../components/tag-input';
import { addArchiveTag, removeArchiveTag, generateArchiveTags } from '../../lib/actions/tags';

interface TagManagerProps {
  archiveId: string;
  initialTags: string[];
  className?: string;
}

export function TagManager({ archiveId, initialTags, className = '' }: TagManagerProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAddTag = async (tag: string) => {
    setError(null);
    
    startTransition(async () => {
      const formData = new FormData();
      formData.append('archiveId', archiveId);
      formData.append('tag', tag);

      const result = await addArchiveTag(formData);
      
      if (result.success && result.data) {
        setTags(result.data);
      } else {
        setError(result.error || 'Failed to add tag');
      }
    });
  };

  const handleRemoveTag = async (tag: string) => {
    setError(null);
    
    startTransition(async () => {
      const formData = new FormData();
      formData.append('archiveId', archiveId);
      formData.append('tag', tag);

      const result = await removeArchiveTag(formData);
      
      if (result.success && result.data) {
        setTags(result.data);
      } else {
        setError(result.error || 'Failed to remove tag');
      }
    });
  };

  const handleGenerateTags = async () => {
    setError(null);
    setIsGenerating(true);
    
    try {
      const formData = new FormData();
      formData.append('archiveId', archiveId);

      const result = await generateArchiveTags(formData);
      
      if (result.success && result.data) {
        // Filter out tags that are already applied
        const newSuggestions = result.data.filter(tag => !tags.includes(tag));
        setSuggestedTags(newSuggestions);
      } else {
        setError(result.error || 'Failed to generate tags');
      }
    } catch {
      setError('Failed to generate tags');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddSuggestedTag = (tag: string) => {
    setSuggestedTags(prev => prev.filter(t => t !== tag));
    handleAddTag(tag);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Tags */}
      <div>
        <h3 className="text-lg font-medium mb-2">Tags</h3>
        <TagList
          tags={tags}
          removable={true}
          onRemove={handleRemoveTag}
          className="mb-3"
        />
        
        <TagInput
          onAddTag={handleAddTag}
          disabled={isPending}
          placeholder="Add a tag and press Enter..."
        />
      </div>

      {/* Auto-tag Generation */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h4 className="text-md font-medium">Auto-generate Tags</h4>
          <button
            onClick={handleGenerateTags}
            disabled={isGenerating}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? 'Generating...' : 'Generate Suggestions'}
          </button>
        </div>
        
        {suggestedTags.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Suggested tags (click to add):</p>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleAddSuggestedTag(tag)}
                  className="inline-flex items-center px-2 py-1 text-sm bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {tag}
                  <svg
                    className="w-3 h-3 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
}