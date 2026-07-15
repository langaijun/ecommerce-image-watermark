// Platform preset type definitions

export type CropStrategy = 'center-crop' | 'fit' | 'stretch' | 'none';

export interface SizeSpec {
  id: string;
  label: string;
  labelEn: string;
  width: number;
  height: number; // 0 = auto (maintain aspect ratio)
  cropStrategy: CropStrategy;
  aspectRatioTolerance: number;
  backgroundColor?: string;
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
}

export interface WatermarkPolicy {
  allowed: boolean;
  maxOpacity?: number;
  maxSizePercent?: number;
  restrictedPositions?: string[];
  note?: string;
  noteEn?: string;
}

export interface OutputFormat {
  format: 'image/jpeg' | 'image/png' | 'image/webp';
  quality: number;
  extension: string;
}

export interface PlatformPreset {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  description: string;
  descriptionEn: string;
  region: 'cn' | 'global';
  sizes: SizeSpec[];
  watermarkPolicy: WatermarkPolicy;
  defaultFormat: OutputFormat;
  outputNaming: (originalName: string, size: SizeSpec) => string;
  docsUrl?: string;
}
