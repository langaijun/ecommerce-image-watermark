import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SizeSpec, OutputFormat, WatermarkPolicy } from '@/lib/types/platform';

export interface CustomPlatform {
  id: string;
  name: string;
  sizes: SizeSpec[];
  format: OutputFormat;
  watermarkPolicy: WatermarkPolicy;
}

interface CustomPlatformState {
  platforms: CustomPlatform[];
  addPlatform: (platform: CustomPlatform) => void;
  removePlatform: (id: string) => void;
  getPlatform: (id: string) => CustomPlatform | undefined;
}

export const useCustomPlatformStore = create<CustomPlatformState>()(
  persist(
    (set, get) => ({
      platforms: [],
      addPlatform: (platform) =>
        set((state) => ({ platforms: [...state.platforms, platform] })),
      removePlatform: (id) =>
        set((state) => ({
          platforms: state.platforms.filter((p) => p.id !== id),
        })),
      getPlatform: (id) => get().platforms.find((p) => p.id === id),
    }),
    { name: 'ecommerce-watermark-custom-platforms' }
  )
);
