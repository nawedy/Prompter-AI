import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface LazyErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function LazyErrorBoundary({ children, fallback }: LazyErrorBoundaryProps) {
  const defaultFallback = (
    <div className="p-4 rounded-lg bg-red-50 text-red-700">
      <h3 className="font-semibold mb-2">Failed to load component</h3>
      <p>Please try refreshing the page. If the problem persists, contact support.</p>
    </div>
  );

  return (
    <ErrorBoundary fallback={fallback || defaultFallback}>
      {children}
    </ErrorBoundary>
  );
}
