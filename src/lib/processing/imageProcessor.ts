import { Canvas, FabricImage, FabricText, Shadow, Rect, Pattern } from 'fabric';
import type { WatermarkConfig, SizeSpec, ProcessedImage } from '@/lib/types';
import { calculatePosition } from '../canvas/positionUtils';
import { calculateResize } from './resizeEngine';
import { loadImage } from '../utils/imageUtils';
import { getBaseName } from '../utils/fileUtils';

/**
 * Calculate a scale factor for watermark sizing relative to output image.
 * Uses shorter edge as reference, targeting ~5% of shorter edge for font height.
 */
function getExportScaleFactor(outputW: number, outputH: number): number {
  const shorterEdge = Math.min(outputW, outputH);
  // Reference: 800px image → scale 1.0, so 48px font = 6% of 800
  return shorterEdge / 800;
}

/**
 * Create text watermark for export (inline, no external dependencies).
 */
function createExportTextWatermark(
  config: WatermarkConfig['text'],
  scaleFactor: number
): FabricText {
  const options: Record<string, unknown> = {
    fontSize: config.fontSize * scaleFactor,
    fontFamily: config.fontFamily,
    fill: config.color,
    fontWeight: config.fontWeight,
    fontStyle: config.fontStyle,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
  };

  if (config.stroke.enabled) {
    options.stroke = config.stroke.color;
    options.strokeWidth = config.stroke.width * scaleFactor;
    options.paintFirst = 'stroke';
  }

  if (config.shadow.enabled) {
    options.shadow = new Shadow({
      color: config.shadow.color,
      blur: config.shadow.blur * scaleFactor,
      offsetX: config.shadow.offsetX * scaleFactor,
      offsetY: config.shadow.offsetY * scaleFactor,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new FabricText(config.content || 'Watermark', options as any);
}

/**
 * Create tiled watermark for export using Fabric.js native objects.
 */
function createExportTiledWatermark(
  config: WatermarkConfig['tiled'],
  scaleFactor: number,
  canvasSize: { width: number; height: number }
): Rect {
  const fontSize = config.fontSize * scaleFactor;
  const spacingX = config.spacingX * scaleFactor;
  const spacingY = config.spacingY * scaleFactor;

  const textWidth = config.content.length * fontSize * 0.6;
  const textHeight = fontSize * 1.2;

  const angleRad = (Math.abs(config.rotation) * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  const rotW = Math.ceil((textWidth + spacingX) * cos + (textHeight + spacingY) * sin);
  const rotH = Math.ceil((textWidth + spacingX) * sin + (textHeight + spacingY) * cos);

  const tileWidth = Math.max(rotW, 40);
  const tileHeight = Math.max(rotH, 40);

  // Use offscreen canvas for pattern
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = tileWidth;
  patternCanvas.height = tileHeight;
  const ctx = patternCanvas.getContext('2d')!;
  ctx.clearRect(0, 0, tileWidth, tileHeight);
  ctx.save();
  ctx.translate(tileWidth / 2, tileHeight / 2);
  ctx.rotate((config.rotation * Math.PI) / 180);
  ctx.font = `${fontSize}px ${config.fontFamily}`;
  ctx.fillStyle = config.color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.content, 0, 0);
  ctx.restore();

  const pattern = new Pattern({ source: patternCanvas, repeat: 'repeat' });

  return new Rect({
    width: canvasSize.width,
    height: canvasSize.height,
    fill: pattern,
    selectable: false,
    evented: false,
    originX: 'left',
    originY: 'top',
    left: 0,
    top: 0,
  });
}

/**
 * Wait for canvas to finish rendering before export.
 */
function waitForRender(canvas: Canvas): Promise<void> {
  return new Promise((resolve) => {
    canvas.requestRenderAll();
    // Use requestAnimationFrame to ensure the render cycle completes
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

/**
 * Process a single image - offscreen rendering pipeline.
 * Load → Resize → Watermark → Render → Export toBlob
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

  // 5. Add watermark with proper scaling
  const scaleFactor = getExportScaleFactor(outputW, outputH);
  let watermarkObj: import('fabric').FabricObject | null = null;

  try {
    switch (watermarkConfig.type) {
      case 'text':
        watermarkObj = createExportTextWatermark(watermarkConfig.text, scaleFactor);
        break;
      case 'image': {
        // For image watermark, scale proportionally to output
        const imgConfig = watermarkConfig.image;
        if (imgConfig.dataUrl) {
          const wmImg = await FabricImage.fromURL(imgConfig.dataUrl);
          if (wmImg.width && wmImg.height) {
            const targetW = imgConfig.width * scaleFactor;
            const targetH = imgConfig.height * scaleFactor;
            const sx = targetW / wmImg.width;
            const sy = targetH / wmImg.height;
            const uniformScale = imgConfig.preserveAspectRatio ? Math.min(sx, sy) : sx;
            wmImg.set({
              scaleX: uniformScale,
              scaleY: imgConfig.preserveAspectRatio ? uniformScale : sy,
              originX: 'center',
              originY: 'center',
              selectable: false,
              evented: false,
            });
            watermarkObj = wmImg;
          }
        }
        break;
      }
      case 'tiled':
        watermarkObj = createExportTiledWatermark(
          watermarkConfig.tiled,
          scaleFactor,
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

  // 6. Wait for render then export
  await waitForRender(offscreenCanvas);

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
