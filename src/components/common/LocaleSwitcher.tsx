'use client';

import { useI18n } from '@/lib/i18n/routing';
import { Globe } from 'lucide-react';

export function LocaleSwitcher() {
  const { locale, setLocale } = useI18n();

  const toggleLocale = () => {
    setLocale(locale === 'zh' ? 'en' : 'zh');
  };

  return (
    <button
      onClick={toggleLocale}
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm hover:bg-accent transition-colors"
    >
      <Globe className="h-4 w-4" />
      <span>{locale === 'zh' ? 'EN' : '中文'}</span>
    </button>
  );
}
