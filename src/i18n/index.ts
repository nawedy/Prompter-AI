import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import am from './locales/am';
import fr from './locales/fr';
import es from './locales/es';
import de from './locales/de';
import ar from './locales/ar';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en,
      am,
      fr,
      es,
      de,
      ar,
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;