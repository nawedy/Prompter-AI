import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './i18n';
import './index.css';
import { env } from './utils/env';

// Validate environment variables
try {
  console.log('API URL:', env.VITE_API_URL);
} catch (error) {
  console.error('Environment validation failed:', error);
  document.body.innerHTML = `
    <div style="color: red; padding: 20px;">
      <h1>Configuration Error</h1>
      <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
    </div>
  `;
  throw error;
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster position="top-right" />
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  </StrictMode>
);