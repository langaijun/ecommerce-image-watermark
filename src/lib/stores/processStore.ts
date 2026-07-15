import { create } from 'zustand';
import type { ProcessStatus, ProcessProgress, ProcessResult } from '@/lib/types';

interface ProcessState {
  status: ProcessStatus;
  progress: ProcessProgress;
  result: ProcessResult | null;
  abortController: AbortController | null;

  start: (total: number) => void;
  updateProgress: (current: number, total: number, currentItem: string) => void;
  complete: (result: ProcessResult) => void;
  fail: () => void;
  cancel: () => void;
  reset: () => void;
}

export const useProcessStore = create<ProcessState>()((set, get) => ({
  status: 'idle',
  progress: { current: 0, total: 0, currentItem: '' },
  result: null,
  abortController: null,

  start: (total) => {
    const controller = new AbortController();
    set({
      status: 'processing',
      progress: { current: 0, total, currentItem: '' },
      result: null,
      abortController: controller,
    });
  },

  updateProgress: (current, total, currentItem) =>
    set({
      progress: { current, total, currentItem },
    }),

  complete: (result) =>
    set({
      status: 'done',
      result,
      abortController: null,
    }),

  fail: () => set({ status: 'error', abortController: null }),

  cancel: () => {
    get().abortController?.abort();
    set({ status: 'cancelled', abortController: null });
  },

  reset: () => {
    if (get().result?.zipBlob) {
      // Blob doesn't need explicit revocation
    }
    set({
      status: 'idle',
      progress: { current: 0, total: 0, currentItem: '' },
      result: null,
      abortController: null,
    });
  },
}));
