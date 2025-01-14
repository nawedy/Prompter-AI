import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Camera, X } from 'lucide-react';
import type { APIKeys, Theme, Language } from '../types';
import { CollapsibleSection } from './CollapsibleSection';
import { ThemeSelector } from './ThemeSelector';
import { LanguageSelector } from './LanguageSelector';
import { useUserStore } from '../store/userStore';

interface SettingsProps {
  onClose: () => void;
}

export function Settings({ onClose }: SettingsProps) {
  const { t } = useTranslation();
  const { user, updateUser } = useUserStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [apiKeys, setApiKeys] = useState<APIKeys>(user?.apiKeys || {});
  const [theme, setTheme] = useState<Theme>(user?.settings?.theme || 'system');
  const [language, setLanguage] = useState<Language>(user?.settings?.language || 'en');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      email,
      avatarUrl,
      apiKeys,
      settings: {
        ...user?.settings,
        theme,
        language,
      },
    });
    onClose();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-900">{t('settings.title')}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <CollapsibleSection title={t('settings.profile')} defaultOpen={true}>
            <div className="flex items-center space-x-6 mt-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={t('settings.profile')} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700">
                  <Camera className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    {t('settings.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    {t('settings.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title={t('settings.theme')} defaultOpen={false}>
            <div className="mt-4">
              <ThemeSelector value={theme} onChange={setTheme} />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title={t('settings.language')} defaultOpen={false}>
            <div className="mt-4">
              <LanguageSelector value={language} onChange={setLanguage} />
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title={t('settings.apiKeys')}
            description={t('settings.apiKeysDescription')}
            defaultOpen={false}
          >
            <div className="grid grid-cols-1 gap-4 mt-4">
              {[
                { key: 'huggingface', label: 'Hugging Face' },
                { key: 'openai', label: 'OpenAI' },
                { key: 'anthropic', label: 'Anthropic' },
                { key: 'googleAi', label: 'Google AI' },
                { key: 'mistral', label: 'Mistral' },
                { key: 'cohere', label: 'Cohere' },
                { key: 'xai', label: 'xAI' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <input
                    type="password"
                    id={key}
                    value={apiKeys[key as keyof APIKeys] || ''}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, [key]: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder={t('settings.apiKeyPlaceholder', { provider: label })}
                  />
                </div>
              ))}
            </div>
          </CollapsibleSection>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
            >
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}