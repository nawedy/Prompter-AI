import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Monitor } from 'lucide-react';
import type { Theme } from '../types';
import { useThemeStore } from '../store/themeStore';
import { useUserStore } from '../store/userStore';

interface ThemeSelectorProps {
  value: Theme;
  onChange: (theme: Theme) => void;
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  const { t } = useTranslation();
  const { setTheme } = useThemeStore();
  const { updateUser } = useUserStore();

  const handleThemeChange = (newTheme: Theme) => {
    onChange(newTheme);
    setTheme(newTheme);
    updateUser({
      settings: {
        theme: newTheme,
      },
    });
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        {t('settings.theme')}
      </label>
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => handleThemeChange('light')}
          className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-all ${
            value === 'light'
              ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
              : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 dark:border-gray-700 dark:hover:border-indigo-800'
          }`}
        >
          <Sun className="h-5 w-5" />
          <span>{t('theme.light')}</span>
        </button>
        <button
          onClick={() => handleThemeChange('dark')}
          className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-all ${
            value === 'dark'
              ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
              : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 dark:border-gray-700 dark:hover:border-indigo-800'
          }`}
        >
          <Moon className="h-5 w-5" />
          <span>{t('theme.dark')}</span>
        </button>
        <button
          onClick={() => handleThemeChange('system')}
          className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-all ${
            value === 'system'
              ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
              : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 dark:border-gray-700 dark:hover:border-indigo-800'
          }`}
        >
          <Monitor className="h-5 w-5" />
          <span>{t('theme.system')}</span>
        </button>
      </div>
    </div>
  );
}