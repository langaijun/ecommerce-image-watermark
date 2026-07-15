/**
 * Adaptive scaling algorithm - calculates optimal scale factor based on image dimensions.
 * Borrowed and improved from image-watermark project.
 *
 * Strategy:
 * - Aspect ratio < 0.5 (tall) → scale based on height
 * - Aspect ratio > 2.0 (wide) → scale based on width
 * - Normal → scale based on shorter edge
 * - Constraint: watermark area ≤ 30% of canvas
 */

export function calculateAdaptiveScale(
  originalSize: { width: number; height: number },
  canvasSize: { width: number; height: number }
): number {
  const aspectRatio = originalSize.width / originalSize.height;

  let baseScale: number;

  if (aspectRatio < 0.5) {
    baseScale = canvasSize.height / originalSize.height;
  } else if (aspectRatio > 2.0) {
    baseScale = canvasSize.width / originalSize.width;
  } else {
    const shortSide = Math.min(originalSize.width, originalSize.height);
    const canvasShort = Math.min(canvasSize.width, canvasSize.height);
    baseScale = canvasShort / shortSide;
  }

  // Readability constraint: watermark should not exceed 30% of canvas area
  const canvasArea = canvasSize.width * canvasSize.height;
  const maxWatermarkArea = canvasArea * 0.3;
  const refDimension = Math.max(
    100,
    Math.min(originalSize.width, originalSize.height) * 0.15
  );
  const maxScale = Math.sqrt(maxWatermarkArea) / refDimension;

  return Math.min(baseScale, maxScale);
}

/**
 * Export multiplier - maps preview canvas back to original resolution.
 * Used during batch export: multiplier = originalWidth / canvasPreviewWidth
 */
export function calculateExportMultiplier(
  originalSize: { width: number; height: number },
  previewSize: { width: number; height: number }
): number {
  return originalSize.width / previewSize.width;
}

/**
 * Calculate watermark base size as percentage of image area.
 * Default: 8% of canvas area, scaled by user's scale setting.
 */
export function calculateWatermarkBaseSize(
  canvasWidth: number,
  canvasHeight: number,
  scaleRatio: number = 0.08
): number {
  const canvasArea = canvasWidth * canvasHeight;
  return Math.sqrt(canvasArea * scaleRatio);
}
