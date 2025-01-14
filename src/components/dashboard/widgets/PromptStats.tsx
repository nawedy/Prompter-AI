import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { promptRepository } from '../../../db/repositories';
import { LoadingSpinner } from '../../LoadingSpinner';

export function PromptStats() {
  const { data, isLoading } = useQuery('promptStats', async () => {
    const prompts = await promptRepository.getAll();
    
    // Group prompts by day
    const stats = prompts.reduce((acc, prompt) => {
      const date = new Date(prompt.createdAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array format for chart
    return Object.entries(stats).map(([date, count]) => ({
      date,
      count
    }));
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}