import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { promptRepository } from '../../../db/repositories';
import { LoadingSpinner } from '../../LoadingSpinner';

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E'];

export function ModelUsage() {
  const { data, isLoading } = useQuery('modelUsage', async () => {
    const prompts = await promptRepository.getAll();
    
    // Group prompts by model
    const usage = prompts.reduce((acc, prompt) => {
      acc[prompt.modelUsed] = (acc[prompt.modelUsed] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(usage).map(([name, value]) => ({
      name,
      value
    }));
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}