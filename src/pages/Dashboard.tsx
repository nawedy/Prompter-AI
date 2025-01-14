import { DashboardStats } from '../components/dashboard/DashboardStats';
import { RecentPrompts } from '../components/dashboard/RecentPrompts';
import { DashboardGrid } from '../components/dashboard/DashboardGrid';
import { useUserStore } from '../store/userStore';

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
        <DashboardGrid />

        {/* Recent Prompts */}
        <div className="mt-8">
          <RecentPrompts />
        </div>
      </div>
    </div>
  );
}