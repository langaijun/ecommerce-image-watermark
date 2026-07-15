'use client';

import { useState } from 'react';
import { useTranslations } from '@/lib/i18n/routing';
import { useImageStore } from '@/lib/stores/imageStore';
import { useWatermarkStore } from '@/lib/stores/watermarkStore';
import { useExportStore } from '@/lib/stores/exportStore';
import { useProcessStore } from '@/lib/stores/processStore';
import { useCustomPlatformStore } from '@/lib/stores/customPlatformStore';
import { CustomPlatformDialog } from './CustomPlatformDialog';
import { platformRegistry } from '@/lib/platforms/platformRegistry';
import { runBatchProcess } from '@/lib/processing/batchProcessor';
import { formatFileSize } from '@/lib/utils/fileUtils';
import { COMMON_SIZES } from '@/lib/constants/export';
import { previewFilename, TEMPLATE_VARIABLES } from '@/lib/utils/filenameTemplate';
import { trackProcess, trackDownload, trackPlatformSelected } from '@/lib/utils/analytics';
import type { SizeSpec, WatermarkPolicy } from '@/lib/types';
import {
  Download,
  Loader2,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Plus,
  X,
} from 'lucide-react';

export function ExportPanel() {
  const t = useTranslations('export');
  const tc = useTranslations('common');
  const images = useImageStore((s) => s.images);
  const {
    selectedPlatformId,
    setSelectedPlatform,
    selectedSizeIds,
    toggleSize,
    format,
    setFormat,
    quality,
    setQuality,
    filenameTemplate,
    setFilenameTemplate,
  } = useExportStore();
  const { status, progress, result, start, updateProgress, complete, fail, cancel, reset } =
    useProcessStore();

  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const customPlatforms = useCustomPlatformStore((s) => s.platforms);
  const removeCustomPlatform = useCustomPlatformStore((s) => s.removePlatform);

  const platforms = platformRegistry.getAll();

  // Resolve selected platform from both built-in registry and custom platforms
  const selectedPlatform: { sizes: SizeSpec[]; watermarkPolicy: WatermarkPolicy } | null =
    selectedPlatformId
      ? platformRegistry.getById(selectedPlatformId) ??
        (() => {
          const cp = customPlatforms.find((p) => p.id === selectedPlatformId);
          return cp ? { sizes: cp.sizes, watermarkPolicy: cp.watermarkPolicy } : null;
        })()
      : null;

  const handleDeleteCustomPlatform = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeCustomPlatform(id);
    if (selectedPlatformId === id) {
      setSelectedPlatform(null);
    }
  };

  const availableSizes: SizeSpec[] = selectedPlatform
    ? selectedPlatform.sizes
    : (COMMON_SIZES.map((s) => ({
        ...s,
        cropStrategy: 'none' as const,
        aspectRatioTolerance: 0.01,
      })) as unknown as SizeSpec[]);

  const handleProcess = async () => {
    if (images.length === 0) return;

    const sizesToUse = selectedSizeIds.length > 0
      ? availableSizes.filter((s) => selectedSizeIds.includes(s.id))
      : availableSizes;

    if (sizesToUse.length === 0) return;

    const totalTasks = images.length * sizesToUse.length;
    trackProcess(totalTasks, selectedPlatformId ?? undefined);
    start(totalTasks);

    try {
      const processResult = await runBatchProcess({
        images: images.map((img) => img.file),
        watermarkConfig: useWatermarkStore.getState().exportConfig(),
        format,
        quality,
        selectedSizes: sizesToUse,
        platformId: selectedPlatformId ?? undefined,
        filenameTemplate,
        concurrency: 3,
        onProgress: (current, total, name) => {
          updateProgress(current, total, name);
        },
        signal: useProcessStore.getState().abortController?.signal,
      });
      complete(processResult);
    } catch {
      fail();
    }
  };

  const handleDownload = () => {
    if (!result?.zipBlob) return;
    trackDownload(format);
    const url = URL.createObjectURL(result.zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `watermarked_images_${Date.now()}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 overflow-y-auto h-full pr-1">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-accent/60">
          <Download className="h-3 w-3 text-accent-foreground" />
        </div>
        <label className="text-sm font-semibold">{t('title')}</label>
      </div>

      {/* Platform selector */}
      <div>
        <label className="text-xs text-muted-foreground mb-2 block font-medium">
          {t('platform')}
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => setSelectedPlatform(null)}
            className={`px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 border ${
              !selectedPlatformId
                ? 'bg-primary/10 border-primary/30 text-primary'
                : 'bg-background border-border/50 text-muted-foreground hover:border-primary/20 hover:text-foreground'
            }`}
          >
            {t('noPlatform')}
          </button>
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => { setSelectedPlatform(p.id); trackPlatformSelected(p.id); }}
              className={`px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 border flex items-center gap-1.5 ${
                selectedPlatformId === p.id
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'bg-background border-border/50 text-muted-foreground hover:border-primary/20 hover:text-foreground'
              }`}
            >
              <span>{p.icon}</span>
              <span className="truncate">{p.name}</span>
            </button>
          ))}
          {/* Custom platforms */}
          {customPlatforms.map((cp) => (
            <div key={cp.id} className="relative group">
              <button
                onClick={() => { setSelectedPlatform(cp.id); trackPlatformSelected(cp.id); }}
                className={`w-full px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 border flex items-center gap-1.5 ${
                  selectedPlatformId === cp.id
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-background border-border/50 text-muted-foreground hover:border-primary/20 hover:text-foreground'
                }`}
              >
                <span>⚙️</span>
                <span className="truncate">{cp.name}</span>
              </button>
              <button
                onClick={(e) => handleDeleteCustomPlatform(cp.id, e)}
                className="absolute -top-1 -right-1 p-0.5 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                title={t('deleteCustomPlatform')}
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          ))}
          {/* Add custom platform button */}
          <button
            onClick={() => setShowCustomDialog(true)}
            className="px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 border border-dashed border-border/70 text-muted-foreground hover:border-primary/40 hover:text-primary flex items-center justify-center gap-1"
          >
            <Plus className="h-3 w-3" />
            <span className="truncate">{t('customPlatform')}</span>
          </button>
        </div>
      </div>

      {/* Watermark policy warning */}
      {selectedPlatform && !selectedPlatform.watermarkPolicy.allowed && (
        <div className="flex items-start gap-2 text-xs bg-destructive/10 border border-destructive/20 rounded-lg p-2.5 text-destructive">
          <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
          <span>
            {selectedPlatform.watermarkPolicy.note}
          </span>
        </div>
      )}

      {/* Size selector */}
      <div>
        <label className="text-xs text-muted-foreground mb-2 block font-medium">
          {t('sizes')}
        </label>
        <div className="space-y-1">
          {availableSizes.map((size) => (
            <label
              key={size.id}
              className={`flex items-center gap-2.5 text-sm py-1 px-2 rounded-md cursor-pointer transition-colors ${
                selectedSizeIds.includes(size.id)
                  ? 'bg-primary/5 text-foreground'
                  : 'hover:bg-muted/50'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedSizeIds.includes(size.id)}
                onChange={() => toggleSize(size.id)}
                className="rounded accent-primary"
              />
              <span>
                {size.label}
                {size.cropStrategy !== 'none' && (
                  <span className="text-xs text-muted-foreground ml-1">
                    ({size.cropStrategy})
                  </span>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Format */}
      <div>
        <label className="text-xs text-muted-foreground mb-2 block font-medium">
          {t('format')}
        </label>
        <div className="flex gap-1.5">
          {(['image/jpeg', 'image/png', 'image/webp'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                format === f
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                  : 'bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {f === 'image/jpeg' ? 'JPEG' : f === 'image/png' ? 'PNG' : 'WebP'}
            </button>
          ))}
        </div>
      </div>

      {/* Quality */}
      <div>
        <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
          {t('quality')}: {Math.round(quality * 100)}%
        </label>
        <input
          type="range"
          min={50}
          max={100}
          value={quality * 100}
          onChange={(e) => setQuality(Number(e.target.value) / 100)}
          className="w-full"
        />
      </div>

      {/* Filename template */}
      <div>
        <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
          📁 {t('filenameTemplate')}
        </label>
        <input
          type="text"
          value={filenameTemplate}
          onChange={(e) => setFilenameTemplate(e.target.value)}
          className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          placeholder="{name}_{platform}_{width}x{height}"
        />
        {/* Live preview */}
        <div className="mt-1.5 px-2 py-1 rounded-md bg-muted/40 text-[10px] font-mono text-muted-foreground truncate">
          → {previewFilename(
            filenameTemplate,
            images[0]?.name?.replace(/\.[^.]+$/, '') || 'product',
            selectedPlatformId || '',
            1000,
            1000,
            format === 'image/jpeg' ? 'jpg' : format === 'image/png' ? 'png' : 'webp'
          )}
        </div>
        {/* Quick variable buttons */}
        <div className="flex flex-wrap gap-1 mt-1.5">
          {TEMPLATE_VARIABLES.slice(0, 6).map((v) => (
            <button
              key={v.key}
              onClick={() => {
                const input = document.querySelector<HTMLInputElement>('[placeholder="{name}_{platform}_{width}x{height}"]');
                if (input) {
                  const start = input.selectionStart ?? filenameTemplate.length;
                  const newTemplate = filenameTemplate.slice(0, start) + v.key + filenameTemplate.slice(start);
                  setFilenameTemplate(newTemplate);
                }
              }}
              className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-muted border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
              title={v.desc}
            >
              {v.key}
            </button>
          ))}
        </div>
      </div>

      {/* Process button */}
      <div className="border-t border-border/60 pt-4">
        {status === 'idle' || status === 'done' || status === 'error' || status === 'cancelled' ? (
          <button
            onClick={handleProcess}
            disabled={images.length === 0}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold text-sm hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {t('process')} ({images.length} images)
          </button>
        ) : status === 'processing' ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>
                {t('progress', {
                  current: progress.current,
                  total: progress.total,
                  percent: Math.round(
                    (progress.current / progress.total) * 100
                  ),
                })}
              </span>
            </div>
            <div className="w-full bg-muted/50 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary to-primary/80 h-full rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${(progress.current / progress.total) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {progress.currentItem}
            </p>
            <button
              onClick={cancel}
              className="w-full py-2 rounded-lg border border-destructive/30 text-sm text-destructive hover:bg-destructive/10 transition-colors font-medium"
            >
              {t('cancel')}
            </button>
          </div>
        ) : null}

        {/* Results */}
        {status === 'done' && result && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
              <CheckCircle2 className="h-4 w-4" />
              <span>
                {t('result.success', { count: result.success.length })}
              </span>
            </div>
            {result.failed.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-destructive font-medium">
                <XCircle className="h-4 w-4" />
                <span>
                  {t('result.failed', { count: result.failed.length })}
                </span>
              </div>
            )}
            <p className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">
              {t('result.sizeChange', {
                original: formatFileSize(result.totalOriginalSize),
                processed: formatFileSize(result.totalProcessedSize),
              })}
            </p>
            <button
              onClick={handleDownload}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              {t('download')} ({formatFileSize(result.zipBlob?.size ?? 0)})
            </button>
            <button
              onClick={reset}
              className="w-full py-2 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              {tc('reset')}
            </button>
          </div>
        )}
      </div>

      <CustomPlatformDialog
        open={showCustomDialog}
        onClose={() => setShowCustomDialog(false)}
      />
    </div>
  );
}
