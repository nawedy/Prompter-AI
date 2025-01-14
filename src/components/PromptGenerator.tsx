import React, { useState } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import type { AIToolType } from '../types';
import { ToolTypeSelector } from './ToolTypeSelector';
import { generatePrompt } from '../utils/promptGenerator';

interface PromptGeneratorProps {
  onClose: () => void;
}

export function PromptGenerator({ onClose }: PromptGeneratorProps) {
  const [toolType, setToolType] = useState<AIToolType>('text-to-image');
  const [description, setDescription] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const prompt = generatePrompt(toolType, description);
    setGeneratedPrompt(prompt);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      <ToolTypeSelector value={toolType} onChange={setToolType} />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Describe what you want
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Describe your desired output in detail..."
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={!description.trim()}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Generate Prompt
      </button>

      {generatedPrompt && (
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">Generated Prompt</h3>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-700"
            >
              {copied ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{generatedPrompt}</p>
          </div>
        </div>
      )}
    </div>
  );
}