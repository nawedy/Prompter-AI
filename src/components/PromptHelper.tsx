import React from 'react';
import { AIToolType } from '../types';
import { promptTemplates } from '../utils/promptTemplates';

interface PromptHelperProps {
  toolType: AIToolType;
}

export function PromptHelper({ toolType }: PromptHelperProps) {
  const template = promptTemplates[toolType];

  return (
    <div className="mt-4 bg-gray-50 rounded-md p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-2">Prompt Structure</h3>
      <p className="text-sm text-gray-600 mb-4">{template.structure}</p>

      <h3 className="text-sm font-medium text-gray-900 mb-2">Tips</h3>
      <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
        {template.tips.map((tip, index) => (
          <li key={index}>{tip}</li>
        ))}
      </ul>

      <h3 className="text-sm font-medium text-gray-900 mb-2">Examples</h3>
      <div className="space-y-2">
        {template.examples.map((example, index) => (
          <div key={index} className="text-sm text-gray-600 bg-white p-2 rounded border border-gray-200">
            {example}
          </div>
        ))}
      </div>
    </div>
  );
}