import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_TEMPLATE } from '@/lib/utils/filenameTemplate';

interface ExportState {
  selectedPlatformId: string | null;
  setSelectedPlatform: (id: string | null) => void;

  selectedSizeIds: string[];
  toggleSize: (sizeId: string) => void;
  setSelectedSizes: (ids: string[]) => void;

  customSize: { enabled: boolean; width: number; height: number };
  updateCustomSize: (
    partial: Partial<{ enabled: boolean; width: number; height: number }>
  ) => void;

  format: 'image/jpeg' | 'image/png' | 'image/webp';
  quality: number;
  setFormat: (format: 'image/jpeg' | 'image/png' | 'image/webp') => void;
  setQuality: (quality: number) => void;

  filenameTemplate: string;
  setFilenameTemplate: (template: string) => void;

  concurrency: number;
  setConcurrency: (n: number) => void;

  resetExport: () => void;
}

export const useExportStore = create<ExportState>()(
  persist(
    (set) => ({
      selectedPlatformId: null,
      setSelectedPlatform: (id) =>
        set({
          selectedPlatformId: id,
          selectedSizeIds: id ? [] : ['original'],
        }),

      selectedSizeIds: ['original'],
      toggleSize: (sizeId) =>
        set((state) => ({
          selectedSizeIds: state.selectedSizeIds.includes(sizeId)
            ? state.selectedSizeIds.filter((id) => id !== sizeId)
            : [...state.selectedSizeIds, sizeId],
        })),
      setSelectedSizes: (ids) => set({ selectedSizeIds: ids }),

      customSize: { enabled: false, width: 800, height: 800 },
      updateCustomSize: (partial) =>
        set((state) => ({
          customSize: { ...state.customSize, ...partial },
        })),

      format: 'image/jpeg',
      quality: 0.92,
      setFormat: (format) => set({ format }),
      setQuality: (quality) => set({ quality }),

      filenameTemplate: DEFAULT_TEMPLATE,
      setFilenameTemplate: (template) => set({ filenameTemplate: template || DEFAULT_TEMPLATE }),

      concurrency: 3,
      setConcurrency: (n) => set({ concurrency: Math.max(1, Math.min(8, n)) }),

      resetExport: () =>
        set({
          selectedPlatformId: null,
          selectedSizeIds: ['original'],
          customSize: { enabled: false, width: 800, height: 800 },
          format: 'image/jpeg',
          quality: 0.92,
          filenameTemplate: DEFAULT_TEMPLATE,
          concurrency: 3,
        }),
    }),
    {
      name: 'ecommerce-watermark-export',
    }
  )
);
