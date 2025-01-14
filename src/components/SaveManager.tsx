import React from 'react';
import { Save, Download } from 'lucide-react';
import toast from 'react-hot-toast';

interface SaveManagerProps {
  onSave: () => Promise<void>;
  onExport: (format: string) => Promise<void>;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

export function SaveManager({
  onSave,
  onExport,
  autoSave = true,
  autoSaveInterval = 30000
}: SaveManagerProps) {
  const [saving, setSaving] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);
  const lastSaved = React.useRef<Date>();

  React.useEffect(() => {
    if (!autoSave) return;

    const interval = setInterval(async () => {
      try {
        await onSave();
        lastSaved.current = new Date();
        toast.success('Auto-saved successfully');
      } catch (error) {
        toast.error('Auto-save failed');
      }
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [autoSave, autoSaveInterval, onSave]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave();
      lastSaved.current = new Date();
      toast.success('Saved successfully');
    } catch (error) {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async (format: string) => {
    setExporting(true);
    try {
      await onExport(format);
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
      >
        <Save className="h-4 w-4 mr-2" />
        {saving ? 'Saving...' : 'Save'}
      </button>

      <div className="relative">
        <button
          onClick={() => handleExport('pdf')}
          disabled={exporting}
          className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
      </div>

      {lastSaved.current && (
        <span className="text-sm text-gray-500">
          Last saved: {lastSaved.current.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}