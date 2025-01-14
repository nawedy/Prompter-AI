import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { templateRepository } from '../../db/repositories';
import { TemplateEditor } from './TemplateEditor';
import { TemplatePreview } from './TemplatePreview';
import { TemplateList } from './TemplateList';
import { LoadingSpinner } from '../LoadingSpinner';
import type { Template } from '../../types';

export function TemplateSystem() {
  const { data: templates, isLoading, error } = useQuery('templates', templateRepository.getAll);
  const [selectedTemplate, setSelectedTemplate] = React.useState<Template | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);

  if (isLoading) return <LoadingSpinner />;
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