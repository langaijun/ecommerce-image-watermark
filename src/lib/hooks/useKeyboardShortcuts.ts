'use client';

import { useEffect, useState } from 'react';
import { useImageStore } from '@/lib/stores/imageStore';

export function useKeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore when typing in inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      // Ctrl+S → save template (handled by TemplateManager)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        // Dispatch custom event for TemplateManager to listen
        window.dispatchEvent(new CustomEvent('shortcut:saveTemplate'));
        return;
      }

      // Delete → remove selected image
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const store = useImageStore.getState();
        if (store.selectedId) {
          e.preventDefault();
          store.removeImage(store.selectedId);
        }
        return;
      }

      // Space → toggle original/watermark preview
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('shortcut:togglePreview'));
        return;
      }

      // ? → show help
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShowHelp((prev) => !prev);
        return;
      }

      // Escape → close help
      if (e.key === 'Escape') {
        setShowHelp(false);
        return;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return { showHelp, setShowHelp };
}

export const SHORTCUTS = [
  { keys: 'Ctrl+Z', desc: '撤销', descEn: 'Undo' },
  { keys: 'Ctrl+Shift+Z', desc: '重做', descEn: 'Redo' },
  { keys: 'Ctrl+S', desc: '保存模板', descEn: 'Save Template' },
  { keys: 'Space', desc: '切换原图/水印预览', descEn: 'Toggle Preview' },
  { keys: 'Delete', desc: '删除选中图片', descEn: 'Delete Selected Image' },
  { keys: '?', desc: '显示快捷键帮助', descEn: 'Show Shortcuts Help' },
  { keys: 'Esc', desc: '关闭弹窗', descEn: 'Close Dialog' },
];
