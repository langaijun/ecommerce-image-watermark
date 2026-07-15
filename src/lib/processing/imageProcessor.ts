import { Canvas, FabricImage } from 'fabric';
import type { WatermarkConfig, SizeSpec, ProcessedImage } from '@/lib/types';
import { createTextWatermark } from '../canvas/textWatermark';
import { createImageWatermark } from '../canvas/imageWatermark';
import { createTiledWatermark } from '../canvas/tiledWatermark';
import { calculatePosition } from '../canvas/positionUtils';
import { calculateResize } from './resizeEngine';
import { loadImage } from '../utils/imageUtils';
import { getBaseName } from '../utils/fileUtils';

/**
 * Process a single image - offscreen rendering, no DOM manipulation.
 * Pipeline: Load → Resize → Watermark → Export toBlob
 */
export async function processImage(
  file: File,
  watermarkConfig: WatermarkConfig,
  format: string,
  quality: number,
  sizeSpec: SizeSpec,
  platformId?: string
): Promise<ProcessedImage> {
  // 1. Get original dimensions
  const imgUrl = URL.createObjectURL(file);
  const imgEl = await loadImage(imgUrl);
  const origW = imgEl.naturalWidth;
  const origH = imgEl.naturalHeight;
  URL.revokeObjectURL(imgUrl);

  // 2. Calculate target dimensions
  const resize = calculateResize(origW, origH, sizeSpec);
  const outputW = resize.targetWidth || origW;
  const outputH = resize.targetHeight || origH;

  // 3. Create offscreen Fabric Canvas at output resolution
  const canvasEl = document.createElement('canvas');
  canvasEl.width = outputW;
  canvasEl.height = outputH;

  const offscreenCanvas = new Canvas(canvasEl, {
    width: outputW,
    height: outputH,
    renderOnAddRemove: false,
  });

  // Set background color if needed (e.g. Amazon white)
  if (resize.needsBackground && resize.backgroundColor) {
    offscreenCanvas.backgroundColor = resize.backgroundColor;
  }

  // 4. Add background image
  const fabricImgUrl = URL.createObjectURL(file);
  const fabricImg = await FabricImage.fromURL(fabricImgUrl);
  URL.revokeObjectURL(fabricImgUrl);

  fabricImg.set({
    scaleX: resize.scaleX,
    scaleY: resize.scaleY,
    left: resize.offsetX,
    top: resize.offsetY,
  });
  offscreenCanvas.add(fabricImg);

  // 5. Add watermark at original resolution
  let watermarkObj: import('fabric').FabricObject | null = null;

  try {
    switch (watermarkConfig.type) {
      case 'text':
        watermarkObj = createTextWatermark(watermarkConfig.text, 1);
        break;
      case 'image':
        watermarkObj = await createImageWatermark(
          watermarkConfig.image,
          1,
          outputW,
          outputH
        );
        break;
      case 'tiled':
        watermarkObj = await createTiledWatermark(
          watermarkConfig.tiled,
          1,
          { width: outputW, height: outputH }
        );
        break;
    }
  } catch (e) {
    console.error('Watermark creation failed:', e);
  }

  if (watermarkObj) {
    if (watermarkConfig.type === 'tiled') {
      watermarkObj.set({ opacity: watermarkConfig.transform.opacity });
    } else {
      const objW = (watermarkObj.width ?? 0) * (watermarkObj.scaleX ?? 1);
      const objH = (watermarkObj.height ?? 0) * (watermarkObj.scaleY ?? 1);
      const pos = calculatePosition(
        watermarkConfig.position,
        { width: outputW, height: outputH },
        { width: objW, height: objH }
      );
      watermarkObj.set({
        left: pos.x,
        top: pos.y,
        opacity: watermarkConfig.transform.opacity,
        angle: watermarkConfig.transform.rotation,
      });

      if (watermarkConfig.transform.scale !== 1) {
        watermarkObj.set({
          scaleX: (watermarkObj.scaleX ?? 1) * watermarkConfig.transform.scale,
          scaleY: (watermarkObj.scaleY ?? 1) * watermarkConfig.transform.scale,
        });
      }
    }
    offscreenCanvas.add(watermarkObj);
  }

  // 6. Render and export
  offscreenCanvas.requestRenderAll();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvasEl.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Canvas toBlob failed'))),
      format,
      quality
    );
  });

  // 7. Generate filename
  const baseName = getBaseName(file.name);
  const ext =
    format === 'image/jpeg' ? 'jpg' : format === 'image/png' ? 'png' : 'webp';
  const sizeLabel =
    sizeSpec.width > 0 ? `_${sizeSpec.width}x${sizeSpec.height}` : '';
  const platformLabel = platformId ? `_${platformId}` : '';
  const fileName = `${baseName}${platformLabel}${sizeLabel}.${ext}`;

  // 8. Cleanup
  offscreenCanvas.dispose();

  return {
    fileName,
    blob,
    originalSize: file.size,
    processedSize: blob.size,
    width: outputW,
    height: outputH,
  };
}
