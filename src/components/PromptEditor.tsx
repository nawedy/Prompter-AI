import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Prompt, AIToolType, PromptMode } from '../types';
import { ToolTypeSelector } from './ToolTypeSelector';
import { PromptHelper } from './PromptHelper';
import { PromptGenerator } from './PromptGenerator';
import { PromptModeSelector } from './PromptModeSelector';
import { GlassmorphicOverlay } from './GlassmorphicOverlay';

interface PromptEditorProps {
  prompt?: Prompt;
  onSave: (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

export function PromptEditor({ prompt, onSave, onClose }: PromptEditorProps) {
  const [mode, setMode] = useState<PromptMode>('guide');
  const [title, setTitle] = useState(prompt?.title || '');
  const [content, setContent] = useState(prompt?.content || '');
  const [category, setCategory] = useState(prompt?.category || '');
  const [toolType, setToolType] = useState<AIToolType>(prompt?.toolType || 'text-to-image');
  const [tags, setTags] = useState(prompt?.tags.join(', ') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      content,
      category,
      toolType,
      tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {prompt ? 'Edit Prompt' : 'New Prompt'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <PromptModeSelector mode={mode} onModeChange={setMode} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Side - Form */}
            <div className="relative">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="relative">
                  <ToolTypeSelector value={toolType} onChange={setToolType} />
                  {mode === 'generate' && <GlassmorphicOverlay show={true} />}
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Prompt Content
                  </label>
                  <textarea
                    id="content"
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>

            {/* Right Side - Helper/Generator */}
            <div className="relative h-full">
              <div className={`transition-opacity duration-300 ${mode === 'guide' ? 'opacity-100' : 'opacity-0'}`}>
                <PromptHelper toolType={toolType} />
              </div>
              <div className={`absolute inset-0 transition-opacity duration-300 ${mode === 'generate' ? 'opacity-100' : 'opacity-0'}`}>
                <PromptGenerator onClose={onClose} />
              </div>
              {mode === 'generate' && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg z-10" style={{ display: mode === 'guide' ? 'block' : 'none' }} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}