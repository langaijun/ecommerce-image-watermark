import { create } from 'zustand';
import type { ImageItem } from '@/lib/types';
import { getImageDimensions } from '@/lib/utils/imageUtils';

interface ImageState {
  images: ImageItem[];
  selectedId: string | null;

  addImages: (files: File[]) => Promise<void>;
  removeImage: (id: string) => void;
  removeAll: () => void;
  selectImage: (id: string) => void;
  getSelectedImage: () => ImageItem | undefined;
  getTotalSize: () => number;
}

export const useImageStore = create<ImageState>()((set, get) => ({
  images: [],
  selectedId: null,

  addImages: async (files) => {
    const newItems: ImageItem[] = [];

    for (const file of files) {
      const { width, height } = await getImageDimensions(file);
      newItems.push({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        width,
        height,
        fileSize: file.size,
        name: file.name,
      });
    }

    set((state) => {
      const images = [...state.images, ...newItems];
      return {
        images,
        selectedId: state.selectedId ?? newItems[0]?.id ?? null,
      };
    });
  },

  removeImage: (id) =>
    set((state) => {
      const img = state.images.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.previewUrl);

      const images = state.images.filter((i) => i.id !== id);
      return {
        images,
        selectedId:
          state.selectedId === id ? (images[0]?.id ?? null) : state.selectedId,
      };
    }),

  removeAll: () =>
    set((state) => {
      state.images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
      return { images: [], selectedId: null };
    }),

  selectImage: (id) => set({ selectedId: id }),

  getSelectedImage: () => get().images.find((i) => i.id === get().selectedId),

  getTotalSize: () => get().images.reduce((sum, img) => sum + img.fileSize, 0),
}));
