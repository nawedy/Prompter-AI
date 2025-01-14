import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import toast from 'react-hot-toast';

interface ErrorHandlerProps {
  error: Error;
  resetError?: () => void;
  level?: 'warning' | 'error' | 'fatal';
}

export function ErrorHandler({ error, resetError, level = 'error' }: ErrorHandlerProps) {
  React.useEffect(() => {
    // Log error to monitoring service
    console.error('Error:', {
      message: error.message,
      stack: error.stack,
      level,
      timestamp: new Date().toISOString(),
    });

    // Show toast notification for non-fatal errors
    if (level !== 'fatal') {
      toast.error(error.message);
    }
  }, [error, level]);

  if (level === 'fatal') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-lg w-full">
          <div className="flex items-center space-x-3 text-red-600 mb-4">
            <AlertTriangle className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Something went wrong</h2>
          </div>
          <p className="text-gray-600 mb-4">
            We encountered a serious error. Please try refreshing the page or contact support if the problem persists.
          </p>
          {resetError && (
            <button
              onClick={resetError}
              className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}