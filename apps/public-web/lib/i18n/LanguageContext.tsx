"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import type { Locale, TranslationDictionary } from "./types";
import { idDictionary } from "./dictionaries/id";
import { enDictionary } from "./dictionaries/en";

const dictionaries: Record<Locale, TranslationDictionary> = {
  id: idDictionary,
  en: enDictionary,
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "id",
  setLocale: () => {},
  t: idDictionary,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("id");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("qira_locale") as Locale | null;
      if (saved === "en" || saved === "id") {
        setLocaleState(saved);
        document.documentElement.lang = saved;
        return;
      }

      const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/);
      if (match && (match[1] === "en" || match[1] === "id")) {
        setLocaleState(match[1] as Locale);
        document.documentElement.lang = match[1];
        return;
      }

      document.documentElement.lang = "id";
    } catch {
      // ignore storage errors
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("qira_locale", newLocale);
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.lang = newLocale;
    } catch {
      // ignore storage errors
    }
  };

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: dictionaries[locale] || idDictionary,
    }),
    [locale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}