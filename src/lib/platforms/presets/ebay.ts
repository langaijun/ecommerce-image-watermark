import type { PlatformPreset } from '@/lib/types';

export const ebayPreset: PlatformPreset = {
  id: 'ebay',
  name: 'eBay',
  nameEn: 'eBay',
  icon: '🏷️',
  color: '#0064D2',
  description: 'eBay 产品图片规范',
  descriptionEn: 'eBay product image specifications',
  region: 'global',

  sizes: [
    {
      id: 'ebay-main-1600',
      label: '主图 1600×1600',
      labelEn: 'Main Image 1600×1600',
      width: 1600,
      height: 1600,
      cropStrategy: 'center-crop',
      aspectRatioTolerance: 0.01,
      backgroundColor: '#FFFFFF',
      minSize: { width: 500, height: 500 },
    },
    {
      id: 'ebay-main-800',
      label: '主图 800×800',
      labelEn: 'Main Image 800×800',
      width: 800,
      height: 800,
      cropStrategy: 'center-crop',
      aspectRatioTolerance: 0.01,
      backgroundColor: '#FFFFFF',
    },
  ],

  watermarkPolicy: {
    allowed: true,
    maxOpacity: 0.3,
    maxSizePercent: 15,
    restrictedPositions: ['center'],
    note: '水印建议放在右下角，不超过15%面积，30%透明度。',
    noteEn:
      'Recommended: bottom-right placement, max 15% area, 30% opacity.',
  },

  defaultFormat: { format: 'image/jpeg', quality: 0.92, extension: 'jpg' },
  outputNaming: (originalName, size) => {
    const name = originalName.replace(/\.[^.]+$/, '');
    return `${name}_ebay_${size.width}x${size.height}.jpg`;
  },
};
