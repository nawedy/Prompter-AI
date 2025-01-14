import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import { Activity, Cpu, Clock } from 'lucide-react';

export function SystemHealth() {
  const [metrics, setMetrics] = useState({
    cpu: 0,
    memory: 0,
    latency: 0,
    uptime: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        // TODO: Replace with API call
        setMetrics({
          cpu: 45,
          memory: 60,
          latency: 120,
          uptime: 99.9
        });
      } finally {
        setLoading(false);
      }
    };
    loadMetrics();
  }, []);

  if (loading) return <div>Loading system health...</div>;

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">System Health</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">CPU Usage</p>
            <p className="text-xl font-bold">{metrics.cpu}%</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Memory Usage</p>
            <p className="text-xl font-bold">{metrics.memory}%</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-purple-500" />
          <div>
            <p className="text-sm text-gray-500">Latency</p>
            <p className="text-xl font-bold">{metrics.latency}ms</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-yellow-500" />
          <div>
            <p className="text-sm text-gray-500">Uptime</p>
            <p className="text-xl font-bold">{metrics.uptime}%</p>
          </div>
        </div>
      </div>
    </Card>
  );
}