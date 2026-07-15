import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  WatermarkType,
  TextWatermarkConfig,
  ImageWatermarkConfig,
  TiledWatermarkConfig,
  PositionConfig,
  TransformConfig,
} from '@/lib/types';
import {
  DEFAULT_TEXT_WATERMARK,
  DEFAULT_IMAGE_WATERMARK,
  DEFAULT_TILED_WATERMARK,
  DEFAULT_POSITION,
  DEFAULT_TRANSFORM,
} from '@/lib/constants/watermark';

interface WatermarkState {
  type: WatermarkType;
  setType: (type: WatermarkType) => void;

  text: TextWatermarkConfig;
  updateText: (partial: Partial<TextWatermarkConfig>) => void;

  image: ImageWatermarkConfig;
  updateImage: (partial: Partial<ImageWatermarkConfig>) => void;

  tiled: TiledWatermarkConfig;
  updateTiled: (partial: Partial<TiledWatermarkConfig>) => void;

  position: PositionConfig;
  updatePosition: (partial: Partial<PositionConfig>) => void;

  transform: TransformConfig;
  updateTransform: (partial: Partial<TransformConfig>) => void;

  resetAll: () => void;
  importConfig: (state: Partial<WatermarkState>) => void;
  exportConfig: () => {
    type: WatermarkType;
    text: TextWatermarkConfig;
    image: ImageWatermarkConfig;
    tiled: TiledWatermarkConfig;
    position: PositionConfig;
    transform: TransformConfig;
  };
}

export const useWatermarkStore = create<WatermarkState>()(
  persist(
    (set, get) => ({
      type: 'text',
      setType: (type) => set({ type }),

      text: { ...DEFAULT_TEXT_WATERMARK },
      updateText: (partial) =>
        set((state) => ({ text: { ...state.text, ...partial } })),

      image: { ...DEFAULT_IMAGE_WATERMARK },
      updateImage: (partial) =>
        set((state) => ({ image: { ...state.image, ...partial } })),

      tiled: { ...DEFAULT_TILED_WATERMARK },
      updateTiled: (partial) =>
        set((state) => ({ tiled: { ...state.tiled, ...partial } })),

      position: { ...DEFAULT_POSITION },
      updatePosition: (partial) =>
        set((state) => ({ position: { ...state.position, ...partial } })),

      transform: { ...DEFAULT_TRANSFORM },
      updateTransform: (partial) =>
        set((state) => ({ transform: { ...state.transform, ...partial } })),

      resetAll: () =>
        set({
          type: 'text',
          text: { ...DEFAULT_TEXT_WATERMARK },
          image: { ...DEFAULT_IMAGE_WATERMARK },
          tiled: { ...DEFAULT_TILED_WATERMARK },
          position: { ...DEFAULT_POSITION },
          transform: { ...DEFAULT_TRANSFORM },
        }),

      importConfig: (config) => {
        const updates: Partial<WatermarkState> = {};
        if (config.type) updates.type = config.type;
        if (config.text) updates.text = config.text;
        if (config.image) updates.image = config.image;
        if (config.tiled) updates.tiled = config.tiled;
        if (config.position) updates.position = config.position;
        if (config.transform) updates.transform = config.transform;
        set(updates);
      },

      exportConfig: () => {
        const { type, text, image, tiled, position, transform } = get();
        return { type, text, image, tiled, position, transform };
      },
    }),
    {
      name: 'ecommerce-watermark-settings',
      partialize: (state) => ({
        type: state.type,
        text: state.text,
        image: { ...state.image, dataUrl: state.image.dataUrl },
        tiled: state.tiled,
        position: state.position,
        transform: state.transform,
      }),
    }
  )
);
