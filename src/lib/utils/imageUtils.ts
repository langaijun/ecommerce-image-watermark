import type { ImageDimensions } from '@/lib/types';

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function getImageDimensions(file: File): Promise<ImageDimensions> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    return { width: img.naturalWidth, height: img.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function getAspectRatio(width: number, height: number): number {
  return width / height;
}

export function estimateOutputFileSize(
  width: number,
  height: number,
  format: string,
  quality: number
): number {
  const pixels = width * height;
  const bppMap: Record<string, number> = {
    'image/jpeg': 0.5,
    'image/png': 2.0,
    'image/webp': 0.4,
  };
  const bpp = bppMap[format] ?? 0.5;
  return Math.round((pixels * bpp * quality * 0.85) / 1024) * 1024; // in bytes
}
