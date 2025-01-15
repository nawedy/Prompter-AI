import { useState, useEffect } from 'react';
import { performanceMonitor } from '../../utils/performance';
import { XCircleIcon } from '@heroicons/react/24/outline';

interface MetricRowProps {
  name: string;
  value: number;
  type: 'load' | 'render' | 'interaction';
}

const MetricRow = ({ name, value, type }: MetricRowProps) => {
  const getColorClass = () => {
    if (value > 1000) return 'text-red-600';
    if (value > 500) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'load':
        return '📦';
      case 'render':
        return '🎨';
      case 'interaction':
        return '👆';
      default:
        return '📊';
    }
  };

  return (
    <tr className="border-b border-gray-200">
      <td className="py-2 px-4">{getTypeIcon()} {name}</td>
      <td className={`py-2 px-4 text-right ${getColorClass()}`}>
        {value.toFixed(2)}ms
      </td>
    </tr>
  );
};

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(performanceMonitor.getMetrics());
    };

    const interval = setInterval(updateMetrics, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - 150,
        y: e.clientY - 20,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isVisible || !import.meta.env.DEV) return null;

  const categorizeMetrics = () => {
    return metrics.reduce((acc, metric) => {
      const type = metric.name.split('.')[0] as 'load' | 'render' | 'interaction';
      const name = metric.name.split('.')[1];
      return [...acc, { ...metric, type, displayName: name }];
    }, [] as any[]);
  };

  return (
    <div
      className="fixed bg-white rounded-lg shadow-lg border border-gray-200 w-80 z-50 select-none"
      style={{ 
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <h3 className="font-semibold text-gray-700">Performance Metrics</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <XCircleIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="max-h-96 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Component</th>
              <th className="py-2 px-4 text-right text-sm font-medium text-gray-500">Time</th>
            </tr>
          </thead>
          <tbody>
            {categorizeMetrics().map((metric) => (
              <MetricRow
                key={metric.name}
                name={metric.displayName}
                value={metric.value}
                type={metric.type}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-2 text-xs text-gray-500 border-t border-gray-200">
        🟢 &lt;500ms &nbsp; 🟡 &lt;1000ms &nbsp; 🔴 &gt;1000ms
      </div>
    </div>
  );
}
