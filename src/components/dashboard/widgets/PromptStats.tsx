import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import type { Prompt } from '../../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function PromptStats() {
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    failed: 0
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // TODO: Replace with API call
        setStats({
          total: 10,
          successful: 5,
          failed: 3
        });
        setChartData([
          { date: '2024-03-01', count: 2 },
          { date: '2024-03-02', count: 3 },
          { date: '2024-03-03', count: 5 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <div>Loading stats...</div>;

  return (
    <div className="h-full min-h-[300px]">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Prompt Statistics</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm text-gray-500">Total</h3>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Successful</h3>
            <p className="text-2xl font-bold text-green-600">{stats.successful}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Failed</h3>
            <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
          </div>
        </div>
      </Card>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
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