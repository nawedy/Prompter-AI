import { Suspense } from 'react';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { ModelUsage, TemplateUsage, RecentPrompts } from '../components/dashboard/LazyWidgets';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useUserStore } from '../store/userStore';

const WidgetWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense
    fallback={
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    }
  >
    {children}
  </Suspense>
);

export function Dashboard() {
  const { user } = useUserStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
          </div>
        </div>

        {/* Stats */}
        <DashboardStats />

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <WidgetWrapper>
            <ModelUsage />
          </WidgetWrapper>
          
          <WidgetWrapper>
            <TemplateUsage />
          </WidgetWrapper>
        </div>
        
        {/* Recent Prompts */}
        <div className="mt-8">
          <WidgetWrapper>
            <RecentPrompts />
          </WidgetWrapper>
        </div>
      </div>
    </div>
  );
}