import React, { useState } from 'react';
import { Card } from '../ui/Card';
import type { Prompt } from '../../types';

export function ExportPanel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setLoading(true);
    try {
      // TODO: Replace with API call
      const mockPrompts: Prompt[] = [];
      const jsonData = JSON.stringify(mockPrompts, null, 2);
      
      // Create and download file
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prompts-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Export Data</h2>
      <button
        onClick={handleExport}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Exporting...' : 'Export Prompts'}
      </button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </Card>
  );
}