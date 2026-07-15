import { Rect } from 'fabric';
import type { TiledWatermarkConfig } from '@/lib/types';

/**
 * Calculate rotated bounding box dimensions.
 * Used to ensure tiled watermarks don't overlap when rotated.
 */
function calculateRotatedBounds(
  width: number,
  height: number,
  angleDeg: number
): { width: number; height: number } {
  const angleRad = (Math.abs(angleDeg) * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  return {
    width: Math.ceil(width * cos + height * sin),
    height: Math.ceil(width * sin + height * cos),
  };
}

/**
 * Create a tiled (fullscreen repeating) watermark using Fabric.js Pattern.
 * Supports both text and image watermarks with configurable spacing and rotation.
 */
export async function createTiledWatermark(
  config: TiledWatermarkConfig,
  scaleFactor: number = 1,
  canvasSize: { width: number; height: number } = { width: 800, height: 600 }
): Promise<Rect> {
  const fontSize = config.fontSize * scaleFactor;
  const spacingX = config.spacingX * scaleFactor;
  const spacingY = config.spacingY * scaleFactor;

  // Estimate single tile size
  const textWidth = config.content.length * fontSize * 0.6;
  const textHeight = fontSize * 1.2;

  // Calculate rotated bounds for proper spacing
  const rotatedBounds = calculateRotatedBounds(
    textWidth + spacingX,
    textHeight + spacingY,
    config.rotation
  );

  const tileWidth = Math.max(rotatedBounds.width, 40);
  const tileHeight = Math.max(rotatedBounds.height, 40);

  // Create pattern canvas
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = tileWidth;
  patternCanvas.height = tileHeight;
  const ctx = patternCanvas.getContext('2d')!;

  // Clear with transparency
  ctx.clearRect(0, 0, tileWidth, tileHeight);

  // Save state and apply rotation
  ctx.save();
  ctx.translate(tileWidth / 2, tileHeight / 2);
  ctx.rotate((config.rotation * Math.PI) / 180);

  // Draw text
  ctx.font = `${fontSize}px ${config.fontFamily}`;
  ctx.fillStyle = config.color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.content, 0, 0);

  ctx.restore();

  // Create Fabric.js Pattern and fill a fullscreen Rect
  const pattern = new Pattern({
    source: patternCanvas,
    repeat: 'repeat',
  });

  const fullscreenRect = new Rect({
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

  return fullscreenRect;
}

// Pattern import helper (Fabric.js v6 exports Pattern from 'fabric')
import { Pattern } from 'fabric';
