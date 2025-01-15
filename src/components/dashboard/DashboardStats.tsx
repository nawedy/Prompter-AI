import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';

export function DashboardStats() {
  const [stats, setStats] = useState({
    totalPrompts: 0,
    averageTokens: 0,
    successRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // TODO: Replace with API call
        setStats({
          totalPrompts: 0,
          averageTokens: 0,
          successRate: 0
        });
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <div>Loading stats...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <h3>Total Prompts</h3>
        <p className="text-2xl font-bold">{stats.totalPrompts}</p>
      </Card>
      <Card>
        <h3>Average Tokens</h3>
        <p className="text-2xl font-bold">{stats.averageTokens}</p>
      </Card>
      <Card>
        <h3>Success Rate</h3>
        <p className="text-2xl font-bold">{stats.successRate}%</p>
      </Card>
    </div>
  );
}