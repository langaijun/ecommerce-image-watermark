import type { PlatformPreset } from '@/lib/types';

export const googleShoppingPreset: PlatformPreset = {
  id: 'googleShopping',
  name: 'Google Shopping',
  nameEn: 'Google Shopping',
  icon: '🔍',
  color: '#4285F4',
  description: 'Google 购物广告图片规范',
  descriptionEn: 'Google Shopping ad image specifications',
  region: 'global',

  sizes: [
    {
      id: 'google-main-800',
      label: '广告图 800×800',
      labelEn: 'Ad Image 800×800',
      width: 800,
      height: 800,
      cropStrategy: 'center-crop',
      aspectRatioTolerance: 0.01,
      backgroundColor: '#FFFFFF',
    },
    {
      id: 'google-main-1200',
      label: '广告图 1200×1200',
      labelEn: 'Ad Image 1200×1200',
      width: 1200,
      height: 1200,
      cropStrategy: 'center-crop',
      aspectRatioTolerance: 0.01,
      backgroundColor: '#FFFFFF',
    },
  ],

  watermarkPolicy: {
    allowed: false,
    note: 'Google Shopping 禁止水印，广告图片不得包含任何叠加文字。',
    noteEn: 'Google Shopping prohibits watermarks. Ad images must not contain any overlaid text.',
  },

  defaultFormat: { format: 'image/jpeg', quality: 0.92, extension: 'jpg' },
  outputNaming: (originalName, size) => {
    const name = originalName.replace(/\.[^.]+$/, '');
    return `${name}_google_${size.width}x${size.height}.jpg`;
  },
};
