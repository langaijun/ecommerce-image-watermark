'use client';

import { SHORTCUTS } from '@/lib/hooks/useKeyboardShortcuts';
import { Keyboard, X } from 'lucide-react';

export function ShortcutsHelp({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl shadow-lg p-6 max-w-sm w-full mx-4 animate-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Keyboard className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-semibold">键盘快捷键</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2">
          {SHORTCUTS.map((s) => (
            <div key={s.keys} className="flex items-center justify-between py-1.5">
              <span className="text-sm text-muted-foreground">{s.desc}</span>
              <kbd className="px-2 py-0.5 rounded-md bg-muted border border-border text-xs font-mono font-medium">
                {s.keys}
              </kbd>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[11px] text-muted-foreground text-center">
          按 <kbd className="px-1 py-0.5 rounded bg-muted border text-[10px]">?</kbd> 或{' '}
          <kbd className="px-1 py-0.5 rounded bg-muted border text-[10px]">Esc</kbd> 关闭
        </p>
      </div>
    </div>
  );
}
