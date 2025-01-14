import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { promptRepository } from '../../db/repositories';
import { LoadingSpinner } from '../LoadingSpinner';
import type { Prompt } from '../../types';

export function RecentPrompts() {
  const { data: prompts, isLoading } = useQuery<Prompt[]>({
    queryKey: ['recentPrompts'],
    queryFn: async () => promptRepository.getRecent(5),
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Recent Prompts</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {(!prompts || prompts.length === 0) ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No prompts yet. Create your first prompt to get started!</p>
            <Link
              to="/prompts/new"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Prompt
            </Link>
          </div>
        ) : (
          prompts.map((prompt) => (
            <div key={prompt.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{prompt.title}</h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{prompt.content}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {prompt.toolType}
                    </span>
                    {prompt.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(prompt.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}