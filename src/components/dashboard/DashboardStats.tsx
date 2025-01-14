import { useQuery } from '@tanstack/react-query';
import { BarChart2, Star, Clock } from 'lucide-react';
import { promptRepository } from '../../db/repositories';
import { LoadingSpinner } from '../LoadingSpinner';

export function DashboardStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const prompts = await promptRepository.getAll();
      return {
        total: prompts.length,
        recent: prompts.filter(p => 
          new Date(p.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
        ).length,
        avgRating: 4.8 // Placeholder - implement actual rating calculation
      };
    }
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <BarChart2 className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Prompts</p>
            <p className="text-2xl font-semibold text-gray-900">{stats?.total}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <Star className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Average Rating</p>
            <p className="text-2xl font-semibold text-gray-900">{stats?.avgRating}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Clock className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Last 7 Days</p>
            <p className="text-2xl font-semibold text-gray-900">{stats?.recent}</p>
          </div>
        </div>
      </div>
    </div>
  );
}