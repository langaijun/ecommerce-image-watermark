// Export type definitions

export interface ExportConfig {
  format: 'image/jpeg' | 'image/png' | 'image/webp';
  quality: number;
  selectedPlatformId: string | null;
  selectedSizeIds: string[];
  customSize: { enabled: boolean; width: number; height: number };
  concurrency: number;
}

export interface ProcessedImage {
  fileName: string;
  blob: Blob;
  originalSize: number;
  processedSize: number;
  width: number;
  height: number;
}

export interface ProcessResult {
  success: ProcessedImage[];
  failed: { file: string; error: string }[];
  zipBlob: Blob | null;
  totalOriginalSize: number;
  totalProcessedSize: number;
}

export type ProcessStatus = 'idle' | 'processing' | 'done' | 'error' | 'cancelled';

export interface ProcessProgress {
  current: number;
  total: number;
  currentItem: string;
}
