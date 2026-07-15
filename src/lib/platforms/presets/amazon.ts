import type { PlatformPreset } from '@/lib/types';

export const amazonPreset: PlatformPreset = {
  id: 'amazon',
  name: 'Amazon',
  nameEn: 'Amazon',
  icon: '🛒',
  color: '#FF9900',
  description: '亚马逊产品图片规范',
  descriptionEn: 'Amazon product image specifications',
  region: 'global',

  sizes: [
    {
      id: 'amazon-main-1000',
      label: '主图 1000×1000',
      labelEn: 'Main Image 1000×1000',
      width: 1000,
      height: 1000,
      cropStrategy: 'center-crop',
      aspectRatioTolerance: 0.01,
      backgroundColor: '#FFFFFF',
      minSize: { width: 1000, height: 1000 },
    },
    {
      id: 'amazon-main-1600',
      label: '主图 1600×1600 (高清)',
      labelEn: 'Main Image 1600×1600 (HD)',
      width: 1600,
      height: 1600,
      cropStrategy: 'center-crop',
      aspectRatioTolerance: 0.01,
      backgroundColor: '#FFFFFF',
    },
    {
      id: 'amazon-detail-1000',
      label: '详情图 1000×1000',
      labelEn: 'Detail Image 1000×1000',
      width: 1000,
      height: 1000,
      cropStrategy: 'center-crop',
      aspectRatioTolerance: 0.01,
    },
  ],

  watermarkPolicy: {
    allowed: false,
    note: 'Amazon主图禁止水印，可能导致listing被下架。详情图(A+页面)可酌情添加。',
    noteEn:
      'Amazon main images prohibit watermarks. Detail images (A+ content) may add discreet watermarks.',
  },

  defaultFormat: { format: 'image/jpeg', quality: 0.92, extension: 'jpg' },
  outputNaming: (originalName, size) => {
    const name = originalName.replace(/\.[^.]+$/, '');
    return `${name}_amazon_${size.width}x${size.height}.jpg`;
  },
  docsUrl:
    'https://sellercentral.amazon.com/help/hub/reference/external/G1881',
};
