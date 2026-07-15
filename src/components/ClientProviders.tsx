'use client';

import { useState, useCallback } from 'react';
import { I18nContext, type Locale, createTranslator } from '@/lib/i18n/routing';
import { ThemeProvider } from '@/components/common/ThemeProvider';
import { AppHeader } from '@/components/layout/AppHeader';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('zh');
  const t = createTranslator(locale);

  const handleSetLocale = useCallback((newLocale: Locale) => {
    setLocale(newLocale);
  }, []);

  return (
    <I18nContext.Provider value={{ locale, t, setLocale: handleSetLocale }}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="flex flex-col min-h-screen">
          <AppHeader />
          <main className="flex-1">{children}</main>
        </div>
      </ThemeProvider>
    </I18nContext.Provider>
  );
}
