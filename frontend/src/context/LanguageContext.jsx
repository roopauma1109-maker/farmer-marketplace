import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../translations/en';
import { ta } from '../translations/ta';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('agridirect_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('agridirect_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'ta' : 'en'));
  };

  const t = (key) => {
    const dict = language === 'ta' ? ta : en;
    return dict[key] || en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
