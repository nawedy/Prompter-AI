import { useState, useEffect } from 'react';
import { performanceMonitor } from '../../utils/performance';
import { performanceBudgetMonitor } from '../../utils/performanceBudgets';
import { XCircleIcon, ArrowDownTrayIcon, BellIcon } from '@heroicons/react/24/outline';
import { ExclamationTriangleIcon, ExclamationCircleIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';

interface MetricRowProps {
  name: string;
  value: number;
  category: 'timing' | 'memory' | 'bundle' | 'network';
  unit: string;
}

const MetricRow = ({ name, value, category, unit }: MetricRowProps) => {
  const getColorClass = () => {
    if (category === 'timing') {
      if (value > 1000) return 'text-red-600';
      if (value > 500) return 'text-yellow-600';
      return 'text-green-600';
    }
    if (category === 'memory') {
      if (value > 500) return 'text-red-600';
      if (value > 200) return 'text-yellow-600';
      return 'text-green-600';
    }
    return 'text-gray-600';
  };

  const getCategoryIcon = () => {
    switch (category) {
      case 'timing':
        return '⏱️';
      case 'memory':
        return '💾';
      case 'bundle':
        return '📦';
      case 'network':
        return '🌐';
      default:
        return '📊';
    }
  };

  const trend = performanceBudgetMonitor.getMetricTrend(name);
  
  const getTrendIcon = () => {
    switch (trend) {
      case 'improving':
        return <ArrowTrendingDownIcon className="w-4 h-4 text-green-500" />;
      case 'degrading':
        return <ArrowTrendingUpIcon className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <tr className="border-b border-gray-200">
      <td className="py-2 px-4 flex items-center space-x-2">
        <span>{getCategoryIcon()} {name}</span>
        {getTrendIcon()}
      </td>
      <td className={`py-2 px-4 text-right ${getColorClass()}`}>
        {value.toFixed(2)}{unit}
      </td>
    </tr>
  );
};

const MetricSection = ({ title, metrics }: { title: string; metrics: any[] }) => {
  if (metrics.length === 0) return null;
  
  return (
    <>
      <tr className="bg-gray-50">
        <th colSpan={2} className="py-2 px-4 text-left text-sm font-medium text-gray-700">
          {title}
        </th>
      </tr>
      {metrics.map((metric) => (
        <MetricRow
          key={metric.name}
          name={metric.name.split('.')[1] || metric.name}
          value={metric.value}
          category={metric.category}
          unit={metric.unit}
        />
      ))}
    </>
  );
};

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'timing' | 'system' | 'alerts'>('timing');
  const [showAlertBadge, setShowAlertBadge] = useState(false);

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(performanceMonitor.getMetrics());
      setAlerts(performanceBudgetMonitor.getAlerts());
    };

    const unsubscribe = performanceBudgetMonitor.onAlert(() => {
      setShowAlertBadge(true);
    });

    const interval = setInterval(updateMetrics, 1000);
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
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

  const handleExport = () => {
    performanceMonitor.exportMetrics();
  };

  if (!isVisible || !import.meta.env.DEV) return null;

  const categorizeMetrics = () => {
    return {
      timing: metrics.filter(m => m.category === 'timing'),
      memory: metrics.filter(m => m.category === 'memory'),
      bundle: metrics.filter(m => m.category === 'bundle'),
      network: metrics.filter(m => m.category === 'network'),
    };
  };

  const categorizedMetrics = categorizeMetrics();

  const AlertsTab = () => (
    <div className="divide-y divide-gray-200">
      {alerts.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No performance alerts
        </div>
      ) : (
        alerts.map((alert, index) => (
          <div key={index} className="p-4">
            <div className="flex items-center space-x-2">
              {alert.severity === 'error' ? (
                <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
              ) : (
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
              )}
              <span className="font-medium">{alert.metric}</span>
            </div>
            <div className="mt-1 text-sm text-gray-600">
              Value: {alert.value.toFixed(2)} (Budget: {alert.budget})
            </div>
            <div className="mt-1 text-xs text-gray-400">
              {new Date(alert.timestamp).toLocaleString()}
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div
      className="fixed bg-white rounded-lg shadow-lg border border-gray-200 w-96 z-50 select-none"
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
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setActiveTab('alerts');
              setShowAlertBadge(false);
            }}
            className="text-gray-500 hover:text-gray-700 relative"
          >
            <BellIcon className="w-5 h-5" />
            {showAlertBadge && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
          <button
            onClick={handleExport}
            className="text-gray-500 hover:text-gray-700"
            title="Export metrics"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <XCircleIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              activeTab === 'timing' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('timing')}
          >
            Timing
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              activeTab === 'system' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('system')}
          >
            System
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              activeTab === 'alerts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`}
            onClick={() => {
              setActiveTab('alerts');
              setShowAlertBadge(false);
            }}
          >
            Alerts
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-auto">
        {activeTab === 'alerts' ? (
          <AlertsTab />
        ) : (
          <table className="w-full">
            <tbody>
              {activeTab === 'timing' ? (
                <MetricSection title="Component Timing" metrics={categorizedMetrics.timing} />
              ) : (
                <>
                  <MetricSection title="Memory Usage" metrics={categorizedMetrics.memory} />
                  <MetricSection title="Bundle Sizes" metrics={categorizedMetrics.bundle} />
                  <MetricSection title="Network" metrics={categorizedMetrics.network} />
                </>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="p-2 text-xs text-gray-500 border-t border-gray-200">
        ⏱️ Timing &nbsp; 💾 Memory &nbsp; 📦 Bundle &nbsp; 🌐 Network
      </div>
    </div>
  );
}
