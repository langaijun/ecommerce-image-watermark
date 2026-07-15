import type { PlatformPreset } from '@/lib/types';

export const etsyPreset: PlatformPreset = {
  id: 'etsy',
  name: 'Etsy',
  nameEn: 'Etsy',
  icon: '🟠',
  color: '#F1641E',
  description: 'Etsy 手工/创意商品图片规范',
  descriptionEn: 'Etsy handmade/creative product image specifications',
  region: 'global',

  sizes: [
    {
      id: 'etsy-main-2000',
      label: '主图 2000×2000',
      labelEn: 'Main Image 2000×2000',
      width: 2000,
      height: 2000,
      cropStrategy: 'center-crop',
      aspectRatioTolerance: 0.01,
    },
    {
      id: 'etsy-listing-1200',
      label: '列表图 1200×1200',
      labelEn: 'Listing Image 1200×1200',
      width: 1200,
      height: 1200,
      cropStrategy: 'center-crop',
      aspectRatioTolerance: 0.02,
    },
  ],

  watermarkPolicy: {
    allowed: true,
    maxOpacity: 0.2,
    maxSizePercent: 12,
    note: '建议左下角小水印，不超过20%透明度。',
    noteEn: 'Recommended: small bottom-left watermark, max 20% opacity.',
  },

  defaultFormat: { format: 'image/jpeg', quality: 0.92, extension: 'jpg' },
  outputNaming: (originalName, size) => {
    const name = originalName.replace(/\.[^.]+$/, '');
    return `${name}_etsy_${size.width}x${size.height}.jpg`;
  },
};
