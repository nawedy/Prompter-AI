import { useMemo, useCallback, DependencyList } from 'react';
import { metrics } from '../monitoring/metrics';

export function useMemoWithMetrics<T>(
  factory: () => T,
  deps: DependencyList,
  name: string
): T {
  return useMemo(() => {
    const start = performance.now();
    const result = factory();
    const duration = performance.now() - start;
    metrics.recordTiming(`memo.${name}`, duration);
    return result;
  }, deps);
}

export function useCallbackWithMetrics<T extends Function>(
  callback: T,
  deps: DependencyList,
  name: string
): T {
  return useCallback((...args: any[]) => {
    const start = performance.now();
    const result = callback(...args);
    const duration = performance.now() - start;
    metrics.recordTiming(`callback.${name}`, duration);
    return result;
  }, deps) as T;
}