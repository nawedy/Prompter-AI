import { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface ModelData {
  name: string;
  value: number;
}

export function ModelUsage() {
  const [data, setData] = useState<ModelData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // TODO: Replace with API call
        const mockData: ModelData[] = [
          { name: 'GPT-4', value: 40 },
          { name: 'GPT-3.5', value: 30 },
          { name: 'Claude', value: 20 },
          { name: 'Other', value: 10 },
        ];
        setData(mockData);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div>Loading model usage...</div>;

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Model Usage</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}