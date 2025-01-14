import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { promptRepository } from '../../../db/repositories';
import { LoadingSpinner } from '../../LoadingSpinner';

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

export function BiasAnalysis() {
  const { data, isLoading } = useQuery('biasAnalysis', async () => {
    const prompts = await promptRepository.getAll();
    
    // Group prompts by bias level
    const analysis = prompts.reduce((acc, prompt) => {
      let level = 'Low';
      if (prompt.biasScore > 0.7) level = 'High';
      else if (prompt.biasScore > 0.3) level = 'Medium';
      
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(analysis).map(([name, value]) => ({
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