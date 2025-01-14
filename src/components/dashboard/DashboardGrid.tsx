import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useUserStore } from '../../store/userStore';
import { PromptStats } from './widgets/PromptStats';
import { BiasAnalysis } from './widgets/BiasAnalysis';
import { ModelUsage } from './widgets/ModelUsage';
import { SystemHealth } from './widgets/SystemHealth';
import { TemplateUsage } from './widgets/TemplateUsage';
import { UserEngagement } from './widgets/UserEngagement';
import { ExportPanel } from './ExportPanel';
import type { DashboardWidget } from '../../types';

const ResponsiveGridLayout = WidthProvider(Responsive);

const defaultLayouts = {
  lg: [
    { i: 'systemHealth', x: 0, y: 0, w: 12, h: 2 },
    { i: 'promptStats', x: 0, y: 2, w: 6, h: 4 },
    { i: 'biasAnalysis', x: 6, y: 2, w: 6, h: 4 },
    { i: 'modelUsage', x: 0, y: 6, w: 6, h: 4 },
    { i: 'templateUsage', x: 6, y: 6, w: 6, h: 4 },
    { i: 'userEngagement', x: 0, y: 10, w: 12, h: 4 },
    { i: 'exportPanel', x: 0, y: 14, w: 12, h: 2 },
  ],
};

export function DashboardGrid() {
  const { user, updateUser } = useUserStore();
  const [layouts, setLayouts] = React.useState(user?.settings?.dashboardLayout || defaultLayouts);

  const handleLayoutChange = (layout: any, layouts: any) => {
    setLayouts(layouts);
    updateUser({
      settings: {
        ...user?.settings,
        dashboardLayout: layouts,
      },
    });
  };

  const widgets: Record<string, DashboardWidget> = {
    systemHealth: {
      component: SystemHealth,
      title: 'System Health',
    },
    promptStats: {
      component: PromptStats,
      title: 'Prompt Activity',
    },
    biasAnalysis: {
      component: BiasAnalysis,
      title: 'Bias Analysis',
    },
    modelUsage: {
      component: ModelUsage,
      title: 'Model Usage',
    },
    templateUsage: {
      component: TemplateUsage,
      title: 'Template Usage',
    },
    userEngagement: {
      component: UserEngagement,
      title: 'User Engagement',
    },
    exportPanel: {
      component: ExportPanel,
      title: 'Export & Share',
    },
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={100}
      onLayoutChange={handleLayoutChange}
      isDraggable
      isResizable
    >
      {Object.entries(widgets).map(([id, widget]) => (
        <div key={id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">{widget.title}</h3>
          </div>
          <div className="p-4">
            <widget.component />
          </div>
        </div>
      ))}
    </ResponsiveGridLayout>
  );
}