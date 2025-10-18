// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// استيراد ملفات الترجمة
import translationAR from './locales/ar/translation.json';
import translationEN from './locales/en/translation.json';
import translationDE from './locales/de/translation.json';

const resources = {
    en: {
        translation: translationEN
    },
    de: {
        translation: translationDE
    },
    ar: {
        translation: translationAR
    }
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: 'ar', // اللغة الافتراضية
        fallbackLng: 'en', // اللغة الاحتياطية
        interpolation: {
            escapeValue: false // react already safes from xss
        },
        react: {
            useSuspense: false,
        },
    });

export default i18n;
