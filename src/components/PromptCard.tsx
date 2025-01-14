import React from 'react';
import { Edit2, Trash2, Copy } from 'lucide-react';
import type { Prompt } from '../types';

interface PromptCardProps {
  prompt: Prompt;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCopy: (content: string) => void;
}

export function PromptCard({ prompt, onEdit, onDelete, onCopy }: PromptCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{prompt.title}</h3>
          <span className="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full mt-1">
            {prompt.toolType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onCopy(prompt.content)}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Copy prompt"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(prompt.id)}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Edit prompt"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(prompt.id)}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Delete prompt"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3">{prompt.content}</p>
      <div className="flex flex-wrap gap-2">
        {prompt.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}