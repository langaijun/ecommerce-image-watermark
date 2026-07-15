import type { ExportConfig } from '@/lib/types';

export const DEFAULT_EXPORT_CONFIG: ExportConfig = {
  format: 'image/jpeg',
  quality: 0.92,
  selectedPlatformId: null,
  selectedSizeIds: [],
  customSize: { enabled: false, width: 800, height: 800 },
  concurrency: 3,
};

export const OUTPUT_FORMATS = [
  { value: 'image/jpeg', label: 'JPEG', extension: 'jpg' },
  { value: 'image/png', label: 'PNG', extension: 'png' },
  { value: 'image/webp', label: 'WebP', extension: 'webp' },
] as const;

export const QUALITY_PRESETS = [
  { value: 0.6, label: 'Low (60%)' },
  { value: 0.75, label: 'Medium (75%)' },
  { value: 0.85, label: 'High (85%)' },
  { value: 0.92, label: 'Very High (92%)' },
  { value: 1.0, label: 'Maximum (100%)' },
] as const;

export const COMMON_SIZES = [
  { id: 'original', label: '原图尺寸', labelEn: 'Original Size', width: 0, height: 0 },
  { id: 'square-800', label: '800×800', labelEn: '800×800', width: 800, height: 800 },
  { id: 'square-1000', label: '1000×1000', labelEn: '1000×1000', width: 1000, height: 1000 },
  { id: 'square-1200', label: '1200×1200', labelEn: '1200×1200', width: 1200, height: 1200 },
  { id: 'square-1600', label: '1600×1600', labelEn: '1600×1600', width: 1600, height: 1600 },
  { id: 'square-2000', label: '2000×2000', labelEn: '2000×2000', width: 2000, height: 2000 },
] as const;
