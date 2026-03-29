import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// import enTranslations from "./locales/en/translation.json";
import ruTranslations from "./locales/ru/translation.json";
// import uzTranslations from "./locales/uz/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "ru",
    debug: false, 
    interpolation: {
      escapeValue: false,
    },
    resources: {
      uz: {
        translation: ruTranslations,
      },
      en: {
        translation: ruTranslations,
      },

      ru: {
        translation: ruTranslations,
      },
    },
  });

export default i18n;
