import { Canvas, FabricImage, type FabricObject } from 'fabric';
import type { WatermarkConfig, ImageDimensions } from '@/lib/types';
import { createTextWatermark } from './textWatermark';
import { createImageWatermark } from './imageWatermark';
import { createTiledWatermark } from './tiledWatermark';
import { calculatePosition } from './positionUtils';

/**
 * WatermarkEngine - manages Fabric.js Canvas lifecycle for preview.
 */
export class WatermarkEngine {
  private canvas: Canvas | null = null;
  private watermarkObjects: FabricObject[] = [];
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

  /**
   * Create and position a single watermark object.
   */
  private async createWatermarkObject(
    type: 'text' | 'image' | 'tiled',
    config: WatermarkConfig,
    canvasSize: { width: number; height: number },
    scaleFactor: number
  ): Promise<FabricObject | null> {
    let obj: FabricObject | null = null;

    try {
      switch (type) {
        case 'text':
          obj = createTextWatermark(config.text, scaleFactor);
          break;
        case 'image':
          obj = await createImageWatermark(
            config.image,
            scaleFactor,
            canvasSize.width,
            canvasSize.height
          );
          break;
        case 'tiled':
          obj = await createTiledWatermark(config.tiled, scaleFactor, canvasSize);
          break;
      }
    } catch (e) {
      console.error(`Failed to create ${type} watermark:`, e);
      return null;
    }

    if (!obj) return null;

    if (type === 'tiled') {
      obj.set({ opacity: config.transform.opacity });
    } else {
      const objW = (obj.width ?? 0) * (obj.scaleX ?? 1);
      const objH = (obj.height ?? 0) * (obj.scaleY ?? 1);
      const position = calculatePosition(config.position, canvasSize, {
        width: objW,
        height: objH,
      });

      obj.set({
        left: position.x,
        top: position.y,
        opacity: config.transform.opacity,
        angle: config.transform.rotation,
      });

      if (config.transform.scale !== 1) {
        obj.set({
          scaleX: (obj.scaleX ?? 1) * config.transform.scale,
          scaleY: (obj.scaleY ?? 1) * config.transform.scale,
        });
      }
    }

    return obj;
  }

  /**
   * Enable or disable dragging on watermark objects.
   */
  setDraggable(draggable: boolean): void {
    for (const obj of this.watermarkObjects) {
      obj.set({ selectable: draggable, evented: draggable });
    }
    if (this.canvas) {
      this.canvas.selection = false;
      this.canvas.defaultCursor = draggable ? 'move' : 'default';
    }
  }

  /**
   * Register a callback for when a watermark object is moved.
   */
  onObjectMoved(callback: (x: number, y: number) => void): void {
    if (!this.canvas) return;
    this.canvas.on('object:modified', (e) => {
      const target = e.target;
      if (target && this.watermarkObjects.includes(target)) {
        callback(target.left ?? 0, target.top ?? 0);
      }
    });
  }

  async applyWatermark(config: WatermarkConfig): Promise<void> {
    if (!this.canvas) return;

    // Remove all old watermarks
    for (const obj of this.watermarkObjects) {
      this.canvas.remove(obj);
    }
    this.watermarkObjects = [];

    const canvasSize = {
      width: this.canvas.width!,
      height: this.canvas.height!,
    };
    const scaleFactor = this.previewScale;

    if (config.type === 'combo') {
      // Combo mode: render both text and image watermarks
      const textObj = await this.createWatermarkObject('text', config, canvasSize, scaleFactor);
      if (textObj) {
        this.canvas.add(textObj);
        this.watermarkObjects.push(textObj);
      }
      const imgObj = await this.createWatermarkObject('image', config, canvasSize, scaleFactor);
      if (imgObj) {
        this.canvas.add(imgObj);
        this.watermarkObjects.push(imgObj);
      }
    } else {
      const obj = await this.createWatermarkObject(config.type, config, canvasSize, scaleFactor);
      if (obj) {
        this.canvas.add(obj);
        this.watermarkObjects.push(obj);
      }
    }

    this.canvas.requestRenderAll();
  }

  removeWatermark(): void {
    if (!this.canvas) return;
    for (const obj of this.watermarkObjects) {
      this.canvas.remove(obj);
    }
    this.watermarkObjects = [];
    this.canvas.requestRenderAll();
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
    this.watermarkObjects = [];
  }
}
