import type { TextWatermarkConfig, ImageWatermarkConfig, TiledWatermarkConfig, PositionConfig, TransformConfig, WatermarkConfig } from '@/lib/types';

export const DEFAULT_TEXT_WATERMARK: TextWatermarkConfig = {
  content: '',
  fontFamily: 'Arial',
  fontSize: 48,
  fontWeight: 'normal',
  fontStyle: 'normal',
  color: '#FFFFFF',
  stroke: { enabled: false, color: '#000000', width: 2 },
  shadow: { enabled: false, color: 'rgba(0,0,0,0.5)', blur: 4, offsetX: 2, offsetY: 2 },
};

export const DEFAULT_IMAGE_WATERMARK: ImageWatermarkConfig = {
  dataUrl: null,
  fileName: null,
  width: 200,
  height: 200,
  preserveAspectRatio: true,
};

export const DEFAULT_TILED_WATERMARK: TiledWatermarkConfig = {
  content: 'WATERMARK',
  fontFamily: 'Arial',
  fontSize: 24,
  color: 'rgba(255,255,255,0.25)',
  rows: 5,
  cols: 5,
  spacingX: 120,
  spacingY: 120,
  rotation: -30,
};

export const DEFAULT_POSITION: PositionConfig = {
  mode: 'grid',
  grid: 'bottom-right',
  margin: 20,
  offsetX: 0,
  offsetY: 0,
};

export const DEFAULT_TRANSFORM: TransformConfig = {
  opacity: 0.5,
  rotation: 0,
  scale: 1,
};

export const DEFAULT_WATERMARK_CONFIG: WatermarkConfig = {
  type: 'text',
  text: DEFAULT_TEXT_WATERMARK,
  image: DEFAULT_IMAGE_WATERMARK,
  tiled: DEFAULT_TILED_WATERMARK,
  position: DEFAULT_POSITION,
  transform: DEFAULT_TRANSFORM,
};

export const FONT_GROUPS = [
  {
    label: '英文字体',
    labelEn: 'English Fonts',
    fonts: [
      'Arial',
      'Helvetica',
      'Times New Roman',
      'Georgia',
      'Verdana',
      'Courier New',
      'Impact',
      'Trebuchet MS',
    ],
  },
  {
    label: '中文字体',
    labelEn: 'Chinese Fonts',
    fonts: [
      'Microsoft YaHei',
      'SimHei',
      'SimSun',
      'KaiTi',
      'FangSong',
    ],
  },
];

export const FONT_FAMILIES = FONT_GROUPS.flatMap((g) => g.fonts);

export const WATERMARK_LIMITS = {
  fontSize: { min: 8, max: 200 },
  opacity: { min: 0, max: 1, step: 0.01 },
  rotation: { min: -180, max: 180 },
  scale: { min: 0.1, max: 5, step: 0.1 },
  margin: { min: 0, max: 200 },
  stroke: { min: 0, max: 20 },
  shadowBlur: { min: 0, max: 50 },
  shadowOffset: { min: -20, max: 20 },
  tiledRows: { min: 1, max: 20 },
  tiledCols: { min: 1, max: 20 },
  tiledSpacing: { min: 20, max: 500 },
  imageWidth: { min: 20, max: 2000 },
  imageHeight: { min: 20, max: 2000 },
};

export const MAX_UPLOAD_FILES = 100;
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const ACCEPTED_IMAGE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/avif': ['.avif'],
};
