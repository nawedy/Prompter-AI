import { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import type { Template } from '../../../types';

export function TemplateUsage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        // TODO: Replace with API call
        const mockTemplates: Template[] = [];
        setTemplates(mockTemplates);
      } finally {
        setLoading(false);
      }
    };
    loadTemplates();
  }, []);

  if (loading) return <div>Loading templates...</div>;

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Template Usage</h2>
      {templates.length === 0 ? (
        <p>No templates yet</p>
      ) : (
        <ul className="space-y-4">
          {templates.map((template) => (
            <li key={template.id} className="flex justify-between items-center">
              <span>{template.name}</span>
              <span className="text-gray-500">{template.usageCount || 0} uses</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}