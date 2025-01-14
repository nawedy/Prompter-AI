import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FolderOpen, Tag, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenSettings: () => void;
}

export function Sidebar({ categories, selectedCategory, onSelectCategory, onOpenSettings }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="relative flex h-[calc(100vh-4rem)]">
      <aside className={`bg-gray-50 border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="p-4">
          <nav className="space-y-6">
            <div>
              <h2 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ${
                isCollapsed ? 'sr-only' : ''
              }`}>
                {t('sidebar.categories')}
              </h2>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => onSelectCategory(category)}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                      selectedCategory === category
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title={isCollapsed ? category : undefined}
                  >
                    <FolderOpen className="h-4 w-4 flex-shrink-0" />
                    {!isCollapsed && <span className="ml-3">{category}</span>}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ${
                isCollapsed ? 'sr-only' : ''
              }`}>
                {t('sidebar.tags')}
              </h2>
              <button 
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                title={isCollapsed ? t('sidebar.manageTags') : undefined}
              >
                <Tag className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span className="ml-3">{t('sidebar.manageTags')}</span>}
              </button>
            </div>

            <div className="mt-auto">
              <button 
                onClick={onOpenSettings}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                title={isCollapsed ? t('settings.title') : undefined}
              >
                <Settings className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span className="ml-3">{t('settings.title')}</span>}
              </button>
            </div>
          </nav>
        </div>
      </aside>
      
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:bg-gray-50"
        title={isCollapsed ? t('sidebar.expand') : t('sidebar.collapse')}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        )}
      </button>
    </div>
  );
}