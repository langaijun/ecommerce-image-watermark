import { createContext, useContext, useCallback, useMemo } from 'react';
import zhMessages from '../../../messages/zh.json';
import enMessages from '../../../messages/en.json';

export type Locale = 'zh' | 'en';

const messages: Record<Locale, typeof zhMessages> = {
  zh: zhMessages,
  en: enMessages,
};

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === 'string' ? current : path;
}

interface I18nContextValue {
  locale: Locale;
  t: (key: string, params?: Record<string, string | number>) => string;
  setLocale: (locale: Locale) => void;
}

export const I18nContext = createContext<I18nContextValue>({
  locale: 'zh',
  t: (key: string) => key,
  setLocale: () => {},
});

export function useI18n() {
  return useContext(I18nContext);
}

export function useTranslations(namespace: string) {
  const { locale } = useI18n();

  // Memoize the translator function - stable reference per locale+namespace
  return useMemo(() => {
    const msgs = messages[locale] as Record<string, unknown>;
    return (key: string, params?: Record<string, string | number>): string => {
      const fullKey = `${namespace}.${key}`;
      let value = getNestedValue(msgs, fullKey);
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          value = value.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        });
      }
      return value;
    };
  }, [locale, namespace]);
}

export function createTranslator(locale: Locale) {
  const msgs = messages[locale] as Record<string, unknown>;
  return (key: string, params?: Record<string, string | number>): string => {
    let value = getNestedValue(msgs, key);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return value;
  };
}
