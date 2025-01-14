import React from 'react';
import { Download } from 'lucide-react';
import { promptRepository } from '../../../db/repositories';

export function ExportData() {
  const handleExport = async (format: 'csv' | 'json') => {
    const prompts = await promptRepository.getAll();
    
    let content: string;
    let filename: string;
    let type: string;

    if (format === 'csv') {
      const headers = ['Title', 'Content', 'Project Type', 'Model Used', 'Bias Score', 'Created At'];
      const rows = prompts.map(p => [
        p.title,
        p.content,
        p.projectType,
        p.modelUsed,
        p.biasScore,
        p.createdAt,
      ]);
      content = [headers, ...rows].map(row => row.join(',')).join('\n');
      filename = 'prompts.csv';
      type = 'text/csv';
    } else {
      content = JSON.stringify(prompts, null, 2);
      filename = 'prompts.json';
      type = 'application/json';
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex space-x-4">
      <button
        onClick={() => handleExport('csv')}
        className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Download className="h-4 w-4 mr-2" />
        Export CSV
      </button>
      <button
        onClick={() => handleExport('json')}
        className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Download className="h-4 w-4 mr-2" />
        Export JSON
      </button>
    </div>
  );
}