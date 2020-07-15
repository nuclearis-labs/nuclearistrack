import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resources from './translations.json';

i18n.use(LanguageDetector).init({
  detection: {
    // order and from where user language should be detected
    order: ['localStorage', 'sessionStorage', 'navigator'],

    lookupLocalStorage: 'i18nextLng',

    // cache user language on
    caches: ['localStorage'],
    excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)
  },
});

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,

    keySeparator: false, // we do not use keys in form messages.welcome

    react: {
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['ul', 'li', 'p', 'a', 'br', 'strong', 'i'],
    },

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
