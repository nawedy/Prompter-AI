import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import type { Language } from '../types';

const languages: Record<Language, { name: string; flag: string; colors: string[] }> = {
  en: { 
    name: 'US English',
    flag: '🇺🇸',
    colors: ['bg-red-100', 'bg-white', 'bg-blue-100']
  },
  am: { 
    name: 'አማርኛ',
    flag: '🇪🇹',
    colors: ['bg-green-100', 'bg-yellow-100', 'bg-red-100']
  },
  fr: { 
    name: 'Français',
    flag: '🇫🇷',
    colors: ['bg-blue-100', 'bg-white', 'bg-red-100']
  },
  es: { 
    name: 'Español',
    flag: '🇪🇸',
    colors: ['bg-red-100', 'bg-yellow-100', 'bg-red-100']
  },
  de: { 
    name: 'Deutsch',
    flag: '🇩🇪',
    colors: ['bg-black', 'bg-red-100', 'bg-yellow-100']
  },
  ar: { 
    name: 'العربية',
    flag: '🇸🇦',
    colors: ['bg-green-100', 'bg-white', 'text-green-900']
  }
};

export function LanguageSwitch() {
  const { i18n, t } = useTranslation();
  const { user, updateUser } = useUserStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLanguageChange = (language: Language) => {
    i18n.changeLanguage(language);
    updateUser({
      settings: {
        ...user?.settings,
        language,
      },
    });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100"
        title={t('settings.language')}
      >
        <Globe className="h-5 w-5" />
        <span>{languages[i18n.language as Language]?.flag}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu">
            {Object.entries(languages).map(([code, { name, flag, colors }]) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code as Language)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${
                  i18n.language === code 
                    ? `bg-gradient-to-r from-${colors[0]} via-${colors[1]} to-${colors[2]} text-gray-900` 
                    : 'text-gray-700'
                }`}
                role="menuitem"
              >
                <span>{flag}</span>
                <span>{name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}