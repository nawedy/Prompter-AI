import { useState } from 'react';
import { PerformanceDashboard } from './PerformanceDashboard';

export function DevTools() {
  const [showTools, setShowTools] = useState(true);

  if (!import.meta.env.DEV) return null;

  const toggleTools = () => {
    setShowTools(!showTools);
  };

  return (
    <>
      {showTools && <PerformanceDashboard />}
      <button
        onClick={toggleTools}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-700 z-50"
      >
        {showTools ? 'Hide DevTools' : 'Show DevTools'}
      </button>
    </>
  );
}
