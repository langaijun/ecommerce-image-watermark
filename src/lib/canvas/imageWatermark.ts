import { FabricImage } from 'fabric';
import type { ImageWatermarkConfig } from '@/lib/types';

/**
 * Create an image watermark from a data URL.
 * Scales based on area ratio (8% of canvas area by default).
 */
export async function createImageWatermark(
  config: ImageWatermarkConfig,
  scaleFactor: number = 1,
  canvasWidth?: number,
  canvasHeight?: number
): Promise<FabricImage | null> {
  if (!config.dataUrl) return null;

  const img = await FabricImage.fromURL(config.dataUrl);

  if (!img.width || !img.height) return null;

  let targetWidth = config.width * scaleFactor;
  let targetHeight = config.height * scaleFactor;

  // If canvas dimensions provided, use area-based scaling
  if (canvasWidth && canvasHeight) {
    const canvasArea = canvasWidth * canvasHeight;
    const baseRatio = 0.08; // 8% of canvas area
    const baseTargetArea = canvasArea * baseRatio;
    const aspectRatio = img.width / img.height;
    const baseHeight = Math.sqrt(baseTargetArea / aspectRatio);
    const baseWidth = baseHeight * aspectRatio;

    targetWidth = baseWidth * scaleFactor;
    targetHeight = baseHeight * scaleFactor;
  }

  // Clamp to max 60% of canvas
  if (canvasWidth && canvasHeight) {
    const maxWidth = canvasWidth * 0.6;
    const maxHeight = canvasHeight * 0.6;
    if (targetWidth > maxWidth) {
      const ratio = maxWidth / targetWidth;
      targetWidth *= ratio;
      targetHeight *= ratio;
    }
    if (targetHeight > maxHeight) {
      const ratio = maxHeight / targetHeight;
      targetWidth *= ratio;
      targetHeight *= ratio;
    }
  }

  if (config.preserveAspectRatio) {
    const scaleX = targetWidth / img.width;
    const scaleY = targetHeight / img.height;
    const uniformScale = Math.min(scaleX, scaleY);
    img.set({
      scaleX: uniformScale,
      scaleY: uniformScale,
    });
  } else {
    img.set({
      scaleX: targetWidth / img.width,
      scaleY: targetHeight / img.height,
    });
  }

  img.set({
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
  });

  return img;
}
