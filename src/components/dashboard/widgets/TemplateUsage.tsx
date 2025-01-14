import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { templateRepository } from '../../../db/repositories';
import { LoadingSpinner } from '../../LoadingSpinner';

export function TemplateUsage() {
  const { data, isLoading } = useQuery('templateUsage', async () => {
    const templates = await templateRepository.getAll();
    return templates.map(template => ({
      name: template.name,
      uses: template.useCount || 0,
      category: template.category
    }));
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="uses" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}