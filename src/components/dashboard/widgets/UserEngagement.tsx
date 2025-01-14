import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { metrics } from '../../../utils/monitoring/metrics';
import { LoadingSpinner } from '../../LoadingSpinner';

export function UserEngagement() {
  const { data, isLoading } = useQuery(
    'userEngagement',
    () => metrics.getEngagementMetrics(),
    { refetchInterval: 30000 }
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="activeUsers" stroke="#8884d8" />
          <Line type="monotone" dataKey="interactions" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}