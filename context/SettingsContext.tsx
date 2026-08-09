import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Language, Currency } from '../types';
import { i18n } from '../i18n';
import { geminiService, BackendChatSession } from '../services/geminiService';

interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  t: (key: string) => string;
  geminiService: typeof geminiService;
  chatSession: BackendChatSession | null;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [currency, setCurrency] = useState<Currency>(Currency.GBP);
  
  // Falls back to the English dictionary (and then to the raw key) so that
  // newly-added languages work immediately for chat translation even
  // before someone writes out their full UI dictionary in i18n.ts.
  const t = (key: string) => (i18n[language] ?? i18n[Language.ENGLISH])?.[key] || key;
  const chatSession = useMemo(() => geminiService.chat, []);

  return (
    <SettingsContext.Provider value={{ language, setLanguage, currency, setCurrency, t, geminiService, chatSession }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
