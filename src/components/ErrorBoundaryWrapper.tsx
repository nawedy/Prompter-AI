import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorHandler } from './ErrorHandler';
import { metrics } from '../utils/monitoring/metrics';

interface Props {
  name: string;
  children: React.ReactNode;
}

export function ErrorBoundaryWrapper({ name, children }: Props) {
  const handleError = (error: Error) => {
    metrics.recordError(name, error);
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorHandler}
      onError={handleError}
      onReset={() => window.location.reload()}
    >
      {children}
    </ErrorBoundary>
  );
}