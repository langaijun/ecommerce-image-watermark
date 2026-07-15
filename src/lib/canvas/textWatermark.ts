import { FabricText, Shadow } from 'fabric';
import type { TextWatermarkConfig } from '@/lib/types';

/**
 * Create a text watermark FabricText object.
 * Supports font customization, stroke, and shadow.
 */
export function createTextWatermark(
  config: TextWatermarkConfig,
  scaleFactor: number = 1
): FabricText {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: Record<string, any> = {
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
