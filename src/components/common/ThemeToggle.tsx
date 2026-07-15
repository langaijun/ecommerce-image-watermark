'use client';

import { useTheme } from 'next-themes';
import { useTranslations } from '@/lib/i18n/routing';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('header');

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm hover:bg-accent transition-colors"
      title={t('theme')}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">{t('theme')}</span>
    </button>
  );
}
