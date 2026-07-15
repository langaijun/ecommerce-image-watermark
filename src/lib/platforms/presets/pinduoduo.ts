import type { PlatformPreset } from '@/lib/types';

export const pinduoduoPreset: PlatformPreset = {
  id: 'pinduoduo',
  name: '拼多多',
  nameEn: 'Pinduoduo',
  icon: '🔴',
  color: '#E02E24',
  description: '拼多多商品图片规范',
  descriptionEn: 'Pinduoduo product image specifications',
  region: 'cn',

  sizes: [
    {
      id: 'pdd-main-750',
      label: '主图 750×750',
      labelEn: 'Main Image 750×750',
      width: 750,
      height: 750,
      cropStrategy: 'center-crop',
      aspectRatioTolerance: 0.02,
    },
    {
      id: 'pdd-main-1000',
      label: '主图 1000×1000',
      labelEn: 'Main Image 1000×1000',
      width: 1000,
      height: 1000,
      cropStrategy: 'center-crop',
      aspectRatioTolerance: 0.02,
      backgroundColor: '#FFFFFF',
    },
  ],

  watermarkPolicy: {
    allowed: true,
    maxOpacity: 0.3,
    maxSizePercent: 20,
    note: '建议水印放在角落，透明度不超过30%。',
    noteEn: 'Recommended: corner placement, max 30% opacity.',
  },

  defaultFormat: { format: 'image/jpeg', quality: 0.9, extension: 'jpg' },
  outputNaming: (originalName, size) => {
    const name = originalName.replace(/\.[^.]+$/, '');
    return `${name}_pdd_${size.width}x${size.height}.jpg`;
  },
};
