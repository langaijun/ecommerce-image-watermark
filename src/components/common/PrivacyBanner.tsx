'use client';

import { useTranslations } from '@/lib/i18n/routing';
import { Shield } from 'lucide-react';

export function PrivacyBanner() {
  const t = useTranslations('app');

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-2.5 flex items-center gap-2 text-sm text-primary">
      <Shield className="h-4 w-4 flex-shrink-0" />
      <span>{t('privacyNote')}</span>
    </div>
  );
}
