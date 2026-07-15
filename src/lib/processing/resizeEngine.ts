import type { SizeSpec } from '@/lib/types';

export interface ResizeResult {
  targetWidth: number;
  targetHeight: number;
  scaleX: number;
  scaleY: number;
  offsetX: number;
  offsetY: number;
  needsCrop: boolean;
  needsBackground: boolean;
  backgroundColor?: string;
}

/**
 * Calculate resize parameters for converting source image to target spec.
 */
export function calculateResize(
  sourceWidth: number,
  sourceHeight: number,
  targetSpec: SizeSpec
): ResizeResult {
  const { width: targetW, height: targetH, cropStrategy } = targetSpec;

  // Auto-height mode (e.g. Taobao detail pages)
  if (targetH === 0) {
    const scale = targetW / sourceWidth;
    return {
      targetWidth: targetW,
      targetHeight: Math.round(sourceHeight * scale),
      scaleX: scale,
      scaleY: scale,
      offsetX: 0,
      offsetY: 0,
      needsCrop: false,
      needsBackground: false,
    };
  }

  const srcAspect = sourceWidth / sourceHeight;
  const tgtAspect = targetW / targetH;
  const aspectDiff = Math.abs(srcAspect - tgtAspect);

  // Aspect ratio matches (within tolerance) → simple scale
  if (aspectDiff <= (targetSpec.aspectRatioTolerance ?? 0.01)) {
    const scale = targetW / sourceWidth;
    return {
      targetWidth: targetW,
      targetHeight: targetH,
      scaleX: scale,
      scaleY: scale,
      offsetX: 0,
      offsetY: 0,
      needsCrop: false,
      needsBackground: false,
    };
  }

  switch (cropStrategy) {
    case 'center-crop':
      return calculateCenterCrop(sourceWidth, sourceHeight, targetW, targetH);
    case 'fit':
      return calculateFit(
        sourceWidth,
        sourceHeight,
        targetW,
        targetH,
        targetSpec.backgroundColor
      );
    case 'stretch':
      return {
        targetWidth: targetW,
        targetHeight: targetH,
        scaleX: targetW / sourceWidth,
        scaleY: targetH / sourceHeight,
        offsetX: 0,
        offsetY: 0,
        needsCrop: false,
        needsBackground: false,
      };
    case 'none':
    default:
      return {
        targetWidth: sourceWidth,
        targetHeight: sourceHeight,
        scaleX: 1,
        scaleY: 1,
        offsetX: 0,
        offsetY: 0,
        needsCrop: false,
        needsBackground: false,
      };
  }
}

function calculateCenterCrop(
  srcW: number,
  srcH: number,
  tgtW: number,
  tgtH: number
): ResizeResult {
  const srcAspect = srcW / srcH;
  const tgtAspect = tgtW / tgtH;

  if (srcAspect > tgtAspect) {
    // Source wider → scale by height, crop sides
    const scale = tgtH / srcH;
    const scaledW = srcW * scale;
    const offsetX = (tgtW - scaledW) / 2;
    return {
      targetWidth: tgtW,
      targetHeight: tgtH,
      scaleX: scale,
      scaleY: scale,
      offsetX,
      offsetY: 0,
      needsCrop: true,
      needsBackground: false,
    };
  } else {
    // Source taller → scale by width, crop top/bottom
    const scale = tgtW / srcW;
    const scaledH = srcH * scale;
    const offsetY = (tgtH - scaledH) / 2;
    return {
      targetWidth: tgtW,
      targetHeight: tgtH,
      scaleX: scale,
      scaleY: scale,
      offsetX: 0,
      offsetY,
      needsCrop: true,
      needsBackground: false,
    };
  }
}

function calculateFit(
  srcW: number,
  srcH: number,
  tgtW: number,
  tgtH: number,
  bgColor?: string
): ResizeResult {
  const scale = Math.min(tgtW / srcW, tgtH / srcH);
  const fittedW = Math.round(srcW * scale);
  const fittedH = Math.round(srcH * scale);

  return {
    targetWidth: tgtW,
    targetHeight: tgtH,
    scaleX: scale,
    scaleY: scale,
    offsetX: (tgtW - fittedW) / 2,
    offsetY: (tgtH - fittedH) / 2,
    needsCrop: false,
    needsBackground: true,
    backgroundColor: bgColor ?? '#FFFFFF',
  };
}
