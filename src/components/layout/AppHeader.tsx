'use client';

import { useTranslations } from '@/lib/i18n/routing';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { LocaleSwitcher } from '@/components/common/LocaleSwitcher';
import { Droplets } from 'lucide-react';

export function AppHeader() {
  const t = useTranslations('app');

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Droplets className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold hidden sm:block">
            {t('title')}
          </h1>
          <h1 className="text-lg font-semibold sm:hidden">
            Watermark
          </h1>
        </div>

        <div className="flex items-center gap-1">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
