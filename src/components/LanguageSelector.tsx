import React from 'react';
import type { Language } from '../types';

interface LanguageSelectorProps {
  value: Language;
  onChange: (language: Language) => void;
}

const languages: Record<Language, { name: string; flag: string; colors: string[] }> = {
  en: { 
    name: 'English',
    flag: '🇬🇧',
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

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(languages).map(([code, { name, flag, colors }]) => {
          const isSelected = value === code;
          const gradientClasses = colors.join(' ');
          
          return (
            <button
              key={code}
              onClick={() => onChange(code as Language)}
              className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-gradient-to-r from-' + colors[0] + ' via-' + colors[1] + ' to-' + colors[2]
                  : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
              }`}
            >
              <span className="text-xl">{flag}</span>
              <span className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                {name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}