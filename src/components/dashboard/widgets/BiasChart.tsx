import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { promptRepository } from '../../../db/repositories';
import { LoadingSpinner } from '../../LoadingSpinner';

export function BiasChart() {
  const { data, isLoading, error } = useQuery('biasData', async () => {
    const prompts = await promptRepository.getAll();
    return prompts.map(prompt => ({
      date: format(new Date(prompt.createdAt), 'MM/dd'),
      biasScore: prompt.biasScore || 0,
    }));
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading bias data</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="biasScore" stroke="#8884d8" name="Bias Score" />
      </LineChart>
    </ResponsiveContainer>
  );
}