import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export const useLanguage = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = useCallback((language: 'en' | 'ja') => {
    i18n.changeLanguage(language);
  }, [i18n]);

  const currentLanguage = i18n.language as 'en' | 'ja';

  return {
    t,
    currentLanguage,
    changeLanguage,
    isJapanese: currentLanguage === 'ja',
    isEnglish: currentLanguage === 'en',
  };
};