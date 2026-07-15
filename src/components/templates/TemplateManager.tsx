'use client';

import { useState } from 'react';
import { useTranslations } from '@/lib/i18n/routing';
import { useTemplateStore } from '@/lib/stores/templateStore';
import { useWatermarkStore } from '@/lib/stores/watermarkStore';
import { Bookmark, BookmarkPlus, Trash2, Download, X } from 'lucide-react';
import { trackTemplateSaved } from '@/lib/utils/analytics';

export function TemplateManager() {
  const t = useTranslations('template');
  const templates = useTemplateStore((s) => s.templates);
  const saveTemplate = useTemplateStore((s) => s.saveTemplate);
  const loadTemplate = useTemplateStore((s) => s.loadTemplate);
  const deleteTemplate = useTemplateStore((s) => s.deleteTemplate);
  const importConfig = useWatermarkStore((s) => s.importConfig);

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [showList, setShowList] = useState(false);

  const handleSave = () => {
    if (!saveName.trim()) return;
    const config = useWatermarkStore.getState().exportConfig();
    saveTemplate(saveName.trim(), config as any);
    trackTemplateSaved();
    setSaveName('');
    setShowSaveDialog(false);
  };

  const handleLoad = (id: string) => {
    const config = loadTemplate(id);
    if (config) {
      importConfig(config as any);
    }
  };

  const handleDelete = (id: string) => {
    const tmpl = templates.find((t) => t.id === id);
    if (tmpl && window.confirm(t('confirmDelete', { name: tmpl.name }))) {
      deleteTemplate(id);
    }
  };

  return (
    <div className="space-y-2">
      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowSaveDialog(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border bg-background text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-200"
        >
          <BookmarkPlus className="h-3.5 w-3.5" />
          {t('save')}
        </button>
        <button
          onClick={() => setShowList(!showList)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-medium transition-all duration-200 ${
            showList
              ? 'bg-primary/10 border-primary/30 text-primary'
              : 'border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/30'
          }`}
        >
          <Bookmark className="h-3.5 w-3.5" />
          {t('load')} ({templates.length})
        </button>
      </div>

      {/* Save dialog */}
      {showSaveDialog && (
        <div className="p-3 rounded-lg bg-muted/40 space-y-2 animate-in">
          <input
            type="text"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder={t('namePlaceholder')}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!saveName.trim()}
              className="flex-1 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors"
            >
              {t('save')}
            </button>
            <button
              onClick={() => {
                setShowSaveDialog(false);
                setSaveName('');
              }}
              className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Template list */}
      {showList && (
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {templates.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-3">
              {t('empty')}
            </p>
          ) : (
            templates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{tmpl.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(tmpl.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleLoad(tmpl.id)}
                  className="p-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  title={t('load')}
                >
                  <Download className="h-3 w-3" />
                </button>
                <button
                  onClick={() => handleDelete(tmpl.id)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                  title={t('delete')}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
