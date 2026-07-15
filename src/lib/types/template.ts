// Template type definitions

import type { WatermarkConfig } from './watermark';

export interface WatermarkTemplate {
  id: string;
  name: string;
  description?: string;
  config: WatermarkConfig;
  createdAt: number;
  updatedAt: number;
}
