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

interface WatermarkSnapshot {
  type: WatermarkType;
  text: TextWatermarkConfig;
  image: ImageWatermarkConfig;
  tiled: TiledWatermarkConfig;
  position: PositionConfig;
  transform: TransformConfig;
}

const MAX_HISTORY = 20;

function getSnapshot(state: WatermarkState): WatermarkSnapshot {
  return {
    type: state.type,
    text: { ...state.text },
    image: { ...state.image },
    tiled: { ...state.tiled },
    position: { ...state.position },
    transform: { ...state.transform },
  };
}

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

  // Undo/Redo
  _history: WatermarkSnapshot[];
  _historyIndex: number;
  _pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const useWatermarkStore = create<WatermarkState>()(
  persist(
    (set, get) => ({
      type: 'text',
      setType: (type) => {
        get()._pushHistory();
        set({ type });
      },

      text: { ...DEFAULT_TEXT_WATERMARK },
      updateText: (partial) => {
        get()._pushHistory();
        set((state) => ({ text: { ...state.text, ...partial } }));
      },

      image: { ...DEFAULT_IMAGE_WATERMARK },
      updateImage: (partial) => {
        get()._pushHistory();
        set((state) => ({ image: { ...state.image, ...partial } }));
      },

      tiled: { ...DEFAULT_TILED_WATERMARK },
      updateTiled: (partial) => {
        get()._pushHistory();
        set((state) => ({ tiled: { ...state.tiled, ...partial } }));
      },

      position: { ...DEFAULT_POSITION },
      updatePosition: (partial) => {
        get()._pushHistory();
        set((state) => ({ position: { ...state.position, ...partial } }));
      },

      transform: { ...DEFAULT_TRANSFORM },
      updateTransform: (partial) => {
        get()._pushHistory();
        set((state) => ({ transform: { ...state.transform, ...partial } }));
      },

      resetAll: () => {
        get()._pushHistory();
        set({
          type: 'text',
          text: { ...DEFAULT_TEXT_WATERMARK },
          image: { ...DEFAULT_IMAGE_WATERMARK },
          tiled: { ...DEFAULT_TILED_WATERMARK },
          position: { ...DEFAULT_POSITION },
          transform: { ...DEFAULT_TRANSFORM },
        });
      },

      importConfig: (config) => {
        get()._pushHistory();
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

      // Undo/Redo
      _history: [],
      _historyIndex: -1,
      _pushHistory: () => {
        const state = get();
        const snapshot = getSnapshot(state);
        const history = state._history.slice(0, state._historyIndex + 1);
        history.push(snapshot);
        if (history.length > MAX_HISTORY) history.shift();
        set({ _history: history, _historyIndex: history.length - 1 });
      },
      undo: () => {
        const { _history, _historyIndex } = get();
        if (_historyIndex <= 0) return;
        const newIndex = _historyIndex - 1;
        const snapshot = _history[newIndex];
        set({
          ...snapshot,
          _historyIndex: newIndex,
        });
      },
      redo: () => {
        const { _history, _historyIndex } = get();
        if (_historyIndex >= _history.length - 1) return;
        const newIndex = _historyIndex + 1;
        const snapshot = _history[newIndex];
        set({
          ...snapshot,
          _historyIndex: newIndex,
        });
      },
      get canUndo() {
        return get()._historyIndex > 0;
      },
      get canRedo() {
        const { _history, _historyIndex } = get();
        return _historyIndex < _history.length - 1;
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
