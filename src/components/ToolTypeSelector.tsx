import React from 'react';
import { AIToolType } from '../types';
import { promptTemplates } from '../utils/promptTemplates';

interface ToolTypeSelectorProps {
  value: AIToolType;
  onChange: (value: AIToolType) => void;
}

export function ToolTypeSelector({ value, onChange }: ToolTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        AI Tool Type
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as AIToolType)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        {Object.keys(promptTemplates).map((type) => (
          <option key={type} value={type}>
            {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </option>
        ))}
      </select>
    </div>
  );
}