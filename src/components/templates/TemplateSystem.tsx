import React, { useState, useEffect } from 'react';
import { TemplateEditor } from './TemplateEditor';
import { TemplatePreview } from './TemplatePreview';
import { TemplateList } from './TemplateList';
import { LoadingSpinner } from '../LoadingSpinner';
import type { Template } from '../../types';

export function TemplateSystem() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        // TODO: Replace with API call
        const mockTemplates: Template[] = [];
        setTemplates(mockTemplates);
      } catch (err) {
        setError('Failed to load templates');
      } finally {
        setLoading(false);
      }
    };
    loadTemplates();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error loading templates</div>;

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-3">
        <TemplateList
          templates={templates}
          onSelect={setSelectedTemplate}
          onEdit={() => setIsEditing(true)}
        />
      </div>
      <div className="col-span-9">
        {selectedTemplate && (
          isEditing ? (
            <TemplateEditor
              template={selectedTemplate}
              onSave={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <TemplatePreview template={selectedTemplate} />
          )
        )}
      </div>
    </div>
  );
}