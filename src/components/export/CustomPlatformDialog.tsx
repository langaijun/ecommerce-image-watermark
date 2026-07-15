'use client';

import { useState } from 'react';
import { useTranslations } from '@/lib/i18n/routing';
import { useCustomPlatformStore } from '@/lib/stores/customPlatformStore';
import type { CropStrategy, SizeSpec, OutputFormat, WatermarkPolicy } from '@/lib/types/platform';
import { X, Plus } from 'lucide-react';

const CROP_OPTIONS: { value: CropStrategy; label: string }[] = [
  { value: 'none', label: 'None (keep original)' },
  { value: 'center-crop', label: 'Center Crop' },
  { value: 'fit', label: 'Fit (contain)' },
  { value: 'stretch', label: 'Stretch' },
];

const FORMAT_OPTIONS: { value: OutputFormat['format']; label: string; ext: string }[] = [
  { value: 'image/jpeg', label: 'JPEG', ext: 'jpg' },
  { value: 'image/png', label: 'PNG', ext: 'png' },
  { value: 'image/webp', label: 'WebP', ext: 'webp' },
];

interface CustomPlatformDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CustomPlatformDialog({ open, onClose }: CustomPlatformDialogProps) {
  const t = useTranslations('export');
  const addPlatform = useCustomPlatformStore((s) => s.addPlatform);

  const [name, setName] = useState('');
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(800);
  const [cropStrategy, setCropStrategy] = useState<CropStrategy>('none');
  const [formatValue, setFormatValue] = useState<OutputFormat['format']>('image/jpeg');
  const [quality, setQuality] = useState(0.92);
  const [watermarkAllowed, setWatermarkAllowed] = useState(true);

  const resetForm = () => {
    setName('');
    setWidth(800);
    setHeight(800);
    setCropStrategy('none');
    setFormatValue('image/jpeg');
    setQuality(0.92);
    setWatermarkAllowed(true);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (width <= 0 || height <= 0) return;

    const fmt = FORMAT_OPTIONS.find((f) => f.value === formatValue)!;
    const format: OutputFormat = {
      format: formatValue,
      quality,
      extension: fmt.ext,
    };

    const size: SizeSpec = {
      id: `custom-size-${Date.now()}`,
      label: `${width}×${height}`,
      labelEn: `${width}×${height}`,
      width,
      height,
      cropStrategy,
      aspectRatioTolerance: 0.05,
    };

    const watermarkPolicy: WatermarkPolicy = {
      allowed: watermarkAllowed,
    };

    addPlatform({
      id: `custom-${Date.now()}`,
      name: name.trim(),
      sizes: [size],
      format,
      watermarkPolicy,
    });

    handleClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-sm mx-4 panel-glass rounded-xl p-5 space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{t('addCustomPlatform')}</h3>
          <button
            onClick={handleClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Name */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block font-medium">
            {t('platformName')}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('platformNamePlaceholder')}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            autoFocus
          />
        </div>

        {/* Width / Height */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block font-medium">
              {t('width')} (px)
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Math.max(1, Number(e.target.value)))}
              min={1}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block font-medium">
              {t('height')} (px)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Math.max(1, Number(e.target.value)))}
              min={1}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
        </div>

        {/* Crop strategy */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block font-medium">
            {t('cropStrategy')}
          </label>
          <select
            value={cropStrategy}
            onChange={(e) => setCropStrategy(e.target.value as CropStrategy)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          >
            {CROP_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Format */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block font-medium">
            {t('format')}
          </label>
          <div className="flex gap-1.5">
            {FORMAT_OPTIONS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFormatValue(f.value)}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                  formatValue === f.value
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                    : 'bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quality */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block font-medium">
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

        {/* Watermark allowed */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={watermarkAllowed}
            onChange={(e) => setWatermarkAllowed(e.target.checked)}
            className="rounded accent-primary"
          />
          <span className="text-sm text-muted-foreground">
            {t('watermarkAllowed')}
          </span>
        </label>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSave}
            disabled={!name.trim() || width <= 0 || height <= 0}
            className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            {t('saveCustomPlatform')}
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('cancelAction')}
          </button>
        </div>
      </div>
    </div>
  );
}
