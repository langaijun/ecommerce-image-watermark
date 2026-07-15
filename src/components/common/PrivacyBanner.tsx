'use client';

import { useTranslations } from '@/lib/i18n/routing';
import { ShieldCheck } from 'lucide-react';

export function PrivacyBanner() {
  const t = useTranslations('app');

  return (
    <div className="bg-gradient-to-r from-primary/[0.06] to-accent/[0.06] border border-primary/15 rounded-xl px-4 py-2.5 flex items-center gap-3 text-sm">
      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 flex-shrink-0">
        <ShieldCheck className="h-4 w-4 text-primary" />
      </div>
      <span className="text-foreground/80 font-medium">{t('privacyNote')}</span>
    </div>
  );
}
