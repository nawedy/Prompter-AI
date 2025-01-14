import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import type { Prompt } from '../../types';

export function RecentPrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrompts = async () => {
      // TODO: Replace with API call
      const mockPrompts: Prompt[] = [
        {
          id: '1',
          title: 'Mock Prompt 1',
          content: '',
          toolType: 'TEXT_COMPLETION',
          category: 'General',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          title: 'Mock Prompt 2',
          content: '',
          toolType: 'TEXT_TO_IMAGE',
          category: 'General',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ];
      setPrompts(mockPrompts);
      setLoading(false);
    };
    loadPrompts();
  }, []);

  if (loading) return <div>Loading prompts...</div>;

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Recent Prompts</h2>
      {prompts.length === 0 ? (
        <p>No prompts yet</p>
      ) : (
        <ul className="space-y-4">
          {prompts.map((prompt) => (
            <li key={prompt.id} className="border-b pb-2">
              <p className="font-medium">{prompt.title}</p>
              <p className="text-sm text-gray-500">
                {new Date(prompt.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}