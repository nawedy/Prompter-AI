import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, Cpu, Memory, Clock } from 'lucide-react';
import { performanceMonitor } from '../../../utils/monitoring/performance';
import { LoadingSpinner } from '../../LoadingSpinner';

export function SystemHealth() {
  const { data, isLoading } = useQuery(
    'systemHealth',
    () => performanceMonitor.getMetrics(),
    { refetchInterval: 5000 } // Update every 5 seconds
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center">
          <Cpu className="h-5 w-5 text-blue-500 mr-2" />
          <div>
            <p className="text-sm font-medium text-gray-600">CPU Usage</p>
            <p className="text-lg font-semibold text-gray-900">
              {data?.cpu}%
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center">
          <Memory className="h-5 w-5 text-green-500 mr-2" />
          <div>
            <p className="text-sm font-medium text-gray-600">Memory</p>
            <p className="text-lg font-semibold text-gray-900">
              {data?.memory}MB
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-purple-500 mr-2" />
          <div>
            <p className="text-sm font-medium text-gray-600">Response Time</p>
            <p className="text-lg font-semibold text-gray-900">
              {data?.responseTime}ms
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center">
          <Activity className="h-5 w-5 text-red-500 mr-2" />
          <div>
            <p className="text-sm font-medium text-gray-600">Error Rate</p>
            <p className="text-lg font-semibold text-gray-900">
              {data?.errorRate}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}