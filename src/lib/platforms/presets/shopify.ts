import type { PlatformPreset } from '@/lib/types';

export const shopifyPreset: PlatformPreset = {
  id: 'shopify',
  name: 'Shopify',
  nameEn: 'Shopify',
  icon: '🟢',
  color: '#96BF48',
  description: 'Shopify 独立站图片规范',
  descriptionEn: 'Shopify store image specifications',
  region: 'global',

  sizes: [
    {
      id: 'shopify-main-2048',
      label: '产品主图 2048×2048',
      labelEn: 'Product Main 2048×2048',
      width: 2048,
      height: 2048,
      cropStrategy: 'center-crop',
      aspectRatioTolerance: 0.01,
    },
    {
      id: 'shopify-main-1024',
      label: '产品图 1024×1024',
      labelEn: 'Product 1024×1024',
      width: 1024,
      height: 1024,
      cropStrategy: 'center-crop',
      aspectRatioTolerance: 0.01,
    },
  ],

  watermarkPolicy: {
    allowed: true,
    maxOpacity: 0.15,
    maxSizePercent: 25,
    note: '建议水印居中放置，透明度不超过15%，面积不超过25%。',
    noteEn:
      'Recommended: centered watermark, max 15% opacity, max 25% area coverage.',
  },

  defaultFormat: { format: 'image/png', quality: 0.95, extension: 'png' },
  outputNaming: (originalName, size) => {
    const name = originalName.replace(/\.[^.]+$/, '');
    return `${name}_shopify_${size.width}x${size.height}.png`;
  },
};
