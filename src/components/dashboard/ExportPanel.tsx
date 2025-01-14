import React, { useState } from 'react';
import { Download, Calendar, Share2 } from 'lucide-react';
import { saveAs } from 'file-saver';
import { promptRepository } from '../../db/repositories';

interface ExportOptions {
  format: 'pdf' | 'csv' | 'excel';
  dateRange: 'day' | 'week' | 'month' | 'custom';
  widgets: string[];
}

export function ExportPanel() {
  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    dateRange: 'week',
    widgets: []
  });

  const handleExport = async () => {
    const data = await promptRepository.getExportData(options);
    const blob = new Blob([data], { type: 'application/octet-stream' });
    saveAs(blob, `dashboard-export-${new Date().toISOString()}.${options.format}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Export Dashboard</h3>
        <button
          onClick={handleExport}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Format</label>
          <select
            value={options.format}
            onChange={(e) => setOptions({ ...options, format: e.target.value as any })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="pdf">PDF</option>
            <option value="csv">CSV</option>
            <option value="excel">Excel</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date Range</label>
          <div className="mt-1 flex items-center space-x-2">
            <button
              onClick={() => setOptions({ ...options, dateRange: 'day' })}
              className={`px-3 py-2 rounded-md text-sm ${
                options.dateRange === 'day'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setOptions({ ...options, dateRange: 'week' })}
              className={`px-3 py-2 rounded-md text-sm ${
                options.dateRange === 'week'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setOptions({ ...options, dateRange: 'month' })}
              className={`px-3 py-2 rounded-md text-sm ${
                options.dateRange === 'month'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              This Month
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Export
          </button>
          <button
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}