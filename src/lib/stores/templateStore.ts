import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WatermarkConfig } from '@/lib/types';

export interface WatermarkTemplate {
  id: string;
  name: string;
  description?: string;
  config: WatermarkConfig;
  createdAt: number;
  updatedAt: number;
}

interface TemplateState {
  templates: WatermarkTemplate[];
  saveTemplate: (
    name: string,
    config: WatermarkConfig,
    description?: string
  ) => string;
  loadTemplate: (id: string) => WatermarkConfig | null;
  deleteTemplate: (id: string) => void;
  updateTemplate: (
    id: string,
    updates: Partial<Pick<WatermarkTemplate, 'name' | 'description'>>
  ) => void;
  getTemplate: (id: string) => WatermarkTemplate | undefined;
}

export const useTemplateStore = create<TemplateState>()(
  persist(
    (set, get) => ({
      templates: [],

      saveTemplate: (name, config, description) => {
        const id = crypto.randomUUID();
        const now = Date.now();
        set((state) => ({
          templates: [
            ...state.templates,
            { id, name, description, config, createdAt: now, updatedAt: now },
          ],
        }));
        return id;
      },

      loadTemplate: (id) => {
        const template = get().templates.find((t) => t.id === id);
        return template?.config ?? null;
      },

      deleteTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        })),

      updateTemplate: (id, updates) =>
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t
          ),
        })),

      getTemplate: (id) => get().templates.find((t) => t.id === id),
    }),
    {
      name: 'ecommerce-watermark-templates',
    }
  )
);
