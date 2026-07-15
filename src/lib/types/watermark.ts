// Watermark type definitions

export type WatermarkType = 'text' | 'image' | 'tiled';

export interface TextStrokeConfig {
  enabled: boolean;
  color: string;
  width: number;
}

export interface TextShadowConfig {
  enabled: boolean;
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
}

export interface TextWatermarkConfig {
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold' | 'lighter' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontStyle: 'normal' | 'italic';
  color: string;
  stroke: TextStrokeConfig;
  shadow: TextShadowConfig;
}

export interface ImageWatermarkConfig {
  dataUrl: string | null;
  fileName: string | null;
  width: number;
  height: number;
  preserveAspectRatio: boolean;
}

export interface TiledWatermarkConfig {
  content: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  rows: number;
  cols: number;
  spacingX: number;
  spacingY: number;
  rotation: number;
}

export type GridPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'center'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface PositionConfig {
  mode: 'grid' | 'custom';
  grid: GridPosition;
  margin: number;
  offsetX: number;
  offsetY: number;
  customX?: number;
  customY?: number;
}

export interface TransformConfig {
  opacity: number;
  rotation: number;
  scale: number;
}

export interface WatermarkConfig {
  type: WatermarkType;
  text: TextWatermarkConfig;
  image: ImageWatermarkConfig;
  tiled: TiledWatermarkConfig;
  position: PositionConfig;
  transform: TransformConfig;
}
