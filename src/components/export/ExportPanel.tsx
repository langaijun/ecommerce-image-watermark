'use client';

import { useTranslations } from '@/lib/i18n/routing';
import { useImageStore } from '@/lib/stores/imageStore';
import { useWatermarkStore } from '@/lib/stores/watermarkStore';
import { useExportStore } from '@/lib/stores/exportStore';
import { useProcessStore } from '@/lib/stores/processStore';
import { platformRegistry } from '@/lib/platforms/platformRegistry';
import { runBatchProcess } from '@/lib/processing/batchProcessor';
import { formatFileSize } from '@/lib/utils/fileUtils';
import { COMMON_SIZES } from '@/lib/constants/export';
import type { SizeSpec } from '@/lib/types';
import {
  Download,
  Loader2,
  XCircle,
  CheckCircle2,
  AlertTriangle,
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
  } = useExportStore();
  const { status, progress, result, start, updateProgress, complete, fail, cancel, reset } =
    useProcessStore();

  const platforms = platformRegistry.getAll();
  const selectedPlatform = selectedPlatformId
    ? platformRegistry.getById(selectedPlatformId)
    : null;

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
    start(totalTasks);

    try {
      const processResult = await runBatchProcess({
        images: images.map((img) => img.file),
        watermarkConfig: useWatermarkStore.getState().exportConfig(),
        format,
        quality,
        selectedSizes: sizesToUse,
        platformId: selectedPlatformId ?? undefined,
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
    const url = URL.createObjectURL(result.zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `watermarked_images_${Date.now()}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 overflow-y-auto h-full pr-1">
      <label className="text-sm font-medium">{t('title')}</label>

      {/* Platform selector */}
      <div>
        <label className="text-xs text-muted-foreground mb-1.5 block">
          {t('platform')}
        </label>
        <select
          value={selectedPlatformId || ''}
          onChange={(e) => setSelectedPlatform(e.target.value || null)}
          className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
        >
          <option value="">{t('noPlatform')}</option>
          {platforms.map((p) => (
            <option key={p.id} value={p.id}>
              {p.icon} {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Watermark policy warning */}
      {selectedPlatform && !selectedPlatform.watermarkPolicy.allowed && (
        <div className="flex items-start gap-2 text-xs bg-destructive/10 border border-destructive/20 rounded-md p-2 text-destructive">
          <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
          <span>
            {selectedPlatform.watermarkPolicy.note}
          </span>
        </div>
      )}

      {/* Size selector */}
      <div>
        <label className="text-xs text-muted-foreground mb-1.5 block">
          {t('sizes')}
        </label>
        <div className="space-y-1">
          {availableSizes.map((size) => (
            <label
              key={size.id}
              className="flex items-center gap-2 text-sm py-0.5 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedSizeIds.includes(size.id)}
                onChange={() => toggleSize(size.id)}
                className="rounded"
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
        <label className="text-xs text-muted-foreground mb-1.5 block">
          {t('format')}
        </label>
        <div className="flex gap-1">
          {(['image/jpeg', 'image/png', 'image/webp'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`flex-1 py-1.5 text-xs rounded-md transition-colors ${
                format === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {f === 'image/jpeg' ? 'JPEG' : f === 'image/png' ? 'PNG' : 'WebP'}
            </button>
          ))}
        </div>
      </div>

      {/* Quality */}
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">
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

      {/* Process button */}
      <div className="border-t pt-3">
        {status === 'idle' || status === 'done' || status === 'error' || status === 'cancelled' ? (
          <button
            onClick={handleProcess}
            disabled={images.length === 0}
            className="w-full py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t('process')} ({images.length} images)
          </button>
        ) : status === 'processing' ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
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
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
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
              className="w-full py-2 rounded-md border text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              {t('cancel')}
            </button>
          </div>
        ) : null}

        {/* Results */}
        {status === 'done' && result && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>
                {t('result.success', { count: result.success.length })}
              </span>
            </div>
            {result.failed.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <XCircle className="h-4 w-4" />
                <span>
                  {t('result.failed', { count: result.failed.length })}
                </span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {t('result.sizeChange', {
                original: formatFileSize(result.totalOriginalSize),
                processed: formatFileSize(result.totalProcessedSize),
              })}
            </p>
            <button
              onClick={handleDownload}
              className="w-full py-2.5 rounded-md bg-green-600 text-white font-medium text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              {t('download')} ({formatFileSize(result.zipBlob?.size ?? 0)})
            </button>
            <button
              onClick={reset}
              className="w-full py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {tc('reset')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
