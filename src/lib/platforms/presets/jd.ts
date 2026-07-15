import type { PlatformPreset } from '@/lib/types';

export const jdPreset: PlatformPreset = {
  id: 'jd',
  name: '京东',
  nameEn: 'JD.com',
  icon: '🐶',
  color: '#E2231A',
  description: '京东商品图片规范',
  descriptionEn: 'JD.com product image specifications',
  region: 'cn',

  sizes: [
    {
      id: 'jd-main-800',
      label: '主图 800×800',
      labelEn: 'Main Image 800×800',
      width: 800,
      height: 800,
      cropStrategy: 'center-crop',
      aspectRatioTolerance: 0.01,
      backgroundColor: '#FFFFFF',
    },
    {
      id: 'jd-detail-750',
      label: '详情页 750宽',
      labelEn: 'Detail Page 750 Wide',
      width: 750,
      height: 0,
      cropStrategy: 'fit',
      aspectRatioTolerance: 999,
    },
  ],

  watermarkPolicy: {
    allowed: false,
    note: '京东主图禁止水印，详情页可酌情添加。',
    noteEn: 'JD.com main images prohibit watermarks. Detail pages may add discreet ones.',
  },

  defaultFormat: { format: 'image/jpeg', quality: 0.9, extension: 'jpg' },
  outputNaming: (originalName, size) => {
    const name = originalName.replace(/\.[^.]+$/, '');
    return `${name}_jd_${size.width}x${size.height || 'auto'}.jpg`;
  },
};
