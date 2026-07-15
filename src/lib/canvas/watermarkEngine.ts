import { Canvas, FabricImage, type FabricObject } from 'fabric';
import type { WatermarkConfig, ImageDimensions } from '@/lib/types';
import { createTextWatermark } from './textWatermark';
import { createImageWatermark } from './imageWatermark';
import { createTiledWatermark } from './tiledWatermark';
import { calculatePosition } from './positionUtils';

/**
 * WatermarkEngine - manages Fabric.js Canvas lifecycle for preview.
 * Handles adding, updating, and removing watermarks on a preview canvas.
 */
export class WatermarkEngine {
  private canvas: Canvas | null = null;
  private watermarkObject: FabricObject | null = null;
  private originalImageSize: ImageDimensions = { width: 0, height: 0 };
  private previewScale: number = 1;

  async init(
    canvasEl: HTMLCanvasElement,
    width: number,
    height: number
  ): Promise<void> {
    this.canvas = new Canvas(canvasEl, {
      width,
      height,
      selection: false,
      preserveObjectStacking: true,
    });
  }

  async setBackgroundImage(
    file: File,
    canvasWidth: number,
    canvasHeight: number
  ): Promise<ImageDimensions> {
    if (!this.canvas) throw new Error('Engine not initialized');

    const imgUrl = URL.createObjectURL(file);
    const img = await FabricImage.fromURL(imgUrl);
    URL.revokeObjectURL(imgUrl);

    if (!img.width || !img.height) throw new Error('Failed to load image');

    this.originalImageSize = { width: img.width, height: img.height };

    // Scale to fit canvas (preview only)
    const scaleX = canvasWidth / img.width;
    const scaleY = canvasHeight / img.height;
    this.previewScale = Math.min(scaleX, scaleY);

    img.set({
      scaleX: this.previewScale,
      scaleY: this.previewScale,
      originX: 'left',
      originY: 'top',
      left: 0,
      top: 0,
    });

    this.canvas.backgroundImage = img;
    this.canvas.requestRenderAll();

    return this.originalImageSize;
  }

  async applyWatermark(config: WatermarkConfig): Promise<void> {
    if (!this.canvas) return;

    // Remove old watermark
    if (this.watermarkObject) {
      this.canvas.remove(this.watermarkObject);
      this.watermarkObject = null;
    }

    const canvasSize = {
      width: this.canvas.width!,
      height: this.canvas.height!,
    };

    // Create watermark based on type
    let watermarkObj: FabricObject | null = null;
    const scaleFactor = this.previewScale;

    try {
      switch (config.type) {
        case 'text':
          watermarkObj = createTextWatermark(config.text, scaleFactor);
          break;
        case 'image':
          watermarkObj = await createImageWatermark(
            config.image,
            scaleFactor,
            canvasSize.width,
            canvasSize.height
          );
          break;
        case 'tiled':
          watermarkObj = await createTiledWatermark(
            config.tiled,
            scaleFactor,
            canvasSize
          );
          break;
      }
    } catch (e) {
      console.error('Failed to create watermark:', e);
      return;
    }

    if (!watermarkObj) return;

    // For tiled watermark (fullscreen rect), no position calculation needed
    if (config.type === 'tiled') {
      watermarkObj.set({
        opacity: config.transform.opacity,
      });
    } else {
      // Calculate position
      const objWidth =
        (watermarkObj.width ?? 0) * (watermarkObj.scaleX ?? 1);
      const objHeight =
        (watermarkObj.height ?? 0) * (watermarkObj.scaleY ?? 1);

      const position = calculatePosition(config.position, canvasSize, {
        width: objWidth,
        height: objHeight,
      });

      watermarkObj.set({
        left: position.x,
        top: position.y,
        opacity: config.transform.opacity,
        angle: config.transform.rotation,
      });

      // Apply scale
      if (config.transform.scale !== 1) {
        const currentSX = watermarkObj.scaleX ?? 1;
        const currentSY = watermarkObj.scaleY ?? 1;
        watermarkObj.set({
          scaleX: currentSX * config.transform.scale,
          scaleY: currentSY * config.transform.scale,
        });
      }
    }

    this.canvas.add(watermarkObj);
    this.watermarkObject = watermarkObj;
    this.canvas.requestRenderAll();
  }

  removeWatermark(): void {
    if (this.canvas && this.watermarkObject) {
      this.canvas.remove(this.watermarkObject);
      this.watermarkObject = null;
      this.canvas.requestRenderAll();
    }
  }

  getOriginalSize(): ImageDimensions {
    return this.originalImageSize;
  }

  getPreviewScale(): number {
    return this.previewScale;
  }

  dispose(): void {
    this.canvas?.dispose();
    this.canvas = null;
    this.watermarkObject = null;
  }
}
