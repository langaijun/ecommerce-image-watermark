import type { PlatformPreset } from '@/lib/types';

export const taobaoPreset: PlatformPreset = {
  id: 'taobao',
  name: '淘宝/天猫',
  nameEn: 'Taobao / Tmall',
  icon: '🧡',
  color: '#FF5000',
  description: '淘宝/天猫商品图片规范',
  descriptionEn: 'Taobao/Tmall product image specifications',
  region: 'cn',

  sizes: [
    {
      id: 'taobao-main-800',
      label: '主图 800×800',
      labelEn: 'Main Image 800×800',
      width: 800,
      height: 800,
      cropStrategy: 'center-crop',
      aspectRatioTolerance: 0.02,
    },
    {
      id: 'taobao-main-1242',
      label: '主图 1242×1242 (手机端高清)',
      labelEn: 'Main Image 1242×1242 (Mobile HD)',
      width: 1242,
      height: 1242,
      cropStrategy: 'center-crop',
      aspectRatioTolerance: 0.02,
    },
    {
      id: 'taobao-detail-750',
      label: '详情页 750宽 (不限高)',
      labelEn: 'Detail Page 750 Wide (Auto Height)',
      width: 750,
      height: 0,
      cropStrategy: 'fit',
      aspectRatioTolerance: 999,
    },
  ],

  watermarkPolicy: {
    allowed: true,
    maxOpacity: 0.3,
    maxSizePercent: 25,
    note: '建议水印透明度不超过30%，面积不超过25%。',
    noteEn: 'Recommended: max 30% opacity, max 25% area coverage.',
  },

  defaultFormat: { format: 'image/jpeg', quality: 0.9, extension: 'jpg' },
  outputNaming: (originalName, size) => {
    const name = originalName.replace(/\.[^.]+$/, '');
    return `${name}_taobao_${size.width}x${size.height || 'auto'}.jpg`;
  },
};
