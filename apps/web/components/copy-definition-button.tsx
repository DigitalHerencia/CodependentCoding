'use client';
import { useState } from 'react';
export function CopyDefinitionButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
      }}
    >
      {copied ? 'Copied' : 'Copy page'}
    </button>
  );
}
