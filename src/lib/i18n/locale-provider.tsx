"use client";

import * as React from "react";
import { NextIntlClientProvider } from "next-intl";
import { Locale, defaultLocale } from "./config";
import enMessages from "@/messages/en.json";
import viMessages from "@/messages/vi.json";

const messages: Record<Locale, typeof enMessages> = {
  en: enMessages,
  vi: viMessages,
};

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = React.createContext<LocaleContextType | undefined>(
  undefined
);

const LOCALE_STORAGE_KEY = "preferred-locale";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>(defaultLocale);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Get stored locale from localStorage
    const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale;
    if (storedLocale && (storedLocale === "en" || storedLocale === "vi")) {
      setLocaleState(storedLocale);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "vi") {
        setLocaleState("vi");
      }
    }
    setMounted(true);
  }, []);

  const setLocale = React.useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
  }, []);

  // Prevent hydration mismatch by rendering with default locale until mounted
  const currentLocale = mounted ? locale : defaultLocale;

  return (
    <LocaleContext.Provider value={{ locale: currentLocale, setLocale }}>
      <NextIntlClientProvider
        locale={currentLocale}
        messages={messages[currentLocale]}
        timeZone="Asia/Ho_Chi_Minh"
      >
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextType {
  const context = React.useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
