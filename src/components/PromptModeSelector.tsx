import React from 'react';
import { Lightbulb, Wand2 } from 'lucide-react';
import type { PromptMode } from '../types';

interface PromptModeSelectorProps {
  mode: PromptMode;
  onModeChange: (mode: PromptMode) => void;
}

export function PromptModeSelector({ mode, onModeChange }: PromptModeSelectorProps) {
  return (
    <div className="flex space-x-4 mb-6">
      <button
        onClick={() => onModeChange('guide')}
        className={`flex-1 flex items-center justify-center space-x-2 p-4 rounded-lg border-2 transition-all ${
          mode === 'guide'
            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
            : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
        }`}
      >
        <Lightbulb className="h-5 w-5" />
        <span className="font-medium">Guide me</span>
      </button>
      <button
        onClick={() => onModeChange('generate')}
        className={`flex-1 flex items-center justify-center space-x-2 p-4 rounded-lg border-2 transition-all ${
          mode === 'generate'
            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
            : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
        }`}
      >
        <Wand2 className="h-5 w-5" />
        <span className="font-medium">Generate for me</span>
      </button>
    </div>
  );
}