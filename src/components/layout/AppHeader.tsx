'use client';

import { useTranslations } from '@/lib/i18n/routing';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { LocaleSwitcher } from '@/components/common/LocaleSwitcher';
import { Droplets } from 'lucide-react';

export function AppHeader() {
  const t = useTranslations('app');

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-500 rounded-lg blur-md opacity-40" />
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-purple-500 shadow-sm">
              <Droplets className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold hidden sm:block bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              {t('title')}
            </h1>
            <h1 className="text-base font-bold sm:hidden bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Watermark
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
