'use client';

import { useState, KeyboardEvent } from 'react';

interface TagInputProps {
  onAddTag: (tag: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function TagInput({ 
  onAddTag, 
  placeholder = "Add a tag...", 
  disabled = false,
  className = ""
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleAddTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      onAddTag(trimmed);
      setInputValue('');
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        type="button"
        onClick={handleAddTag}
        disabled={disabled || !inputValue.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Add
      </button>
    </div>
  );
}