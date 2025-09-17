interface TagProps {
  tag: string;
  onRemove?: () => void;
  removable?: boolean;
  className?: string;
}

export function Tag({ tag, onRemove, removable = false, className = '' }: TagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full ${className}`}
    >
      {tag}
      {removable && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
          aria-label={`Remove tag ${tag}`}
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
}

interface TagListProps {
  tags: string[];
  onRemove?: (tag: string) => void;
  removable?: boolean;
  className?: string;
}

export function TagList({ tags, onRemove, removable = false, className = '' }: TagListProps) {
  if (tags.length === 0) {
    return (
      <div className={`text-gray-500 text-sm italic ${className}`}>
        No tags added yet
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <Tag
          key={tag}
          tag={tag}
          removable={removable}
          onRemove={onRemove ? () => onRemove(tag) : undefined}
        />
      ))}
    </div>
  );
}