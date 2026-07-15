'use client';

import { useState, useCallback, useEffect } from 'react';
import { I18nContext, type Locale, createTranslator } from '@/lib/i18n/routing';
import { ThemeProvider } from '@/components/common/ThemeProvider';
import { AppHeader } from '@/components/layout/AppHeader';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [locale, setLocale] = useState<Locale>('zh');
  const t = createTranslator(locale);

  const handleSetLocale = useCallback((newLocale: Locale) => {
    setLocale(newLocale);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <I18nContext.Provider value={{ locale, t, setLocale: handleSetLocale }}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="flex flex-col min-h-screen" suppressHydrationWarning>
          <AppHeader />
          <main className="flex-1">
            <ErrorBoundary>{mounted ? children : null}</ErrorBoundary>
          </main>
        </div>
      </ThemeProvider>
    </I18nContext.Provider>
  );
}
