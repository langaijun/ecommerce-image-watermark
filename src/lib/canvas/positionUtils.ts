import type { PositionConfig, GridPosition } from '@/lib/types';

interface Bounds {
  width: number;
  height: number;
}

/**
 * Calculate watermark position based on config (grid or custom).
 * Returns {x, y} center coordinates for the watermark object.
 */
export function calculatePosition(
  config: PositionConfig,
  canvasSize: Bounds,
  objectSize: Bounds
): { x: number; y: number } {
  const margin = config.margin ?? 0;

  // Custom coordinate mode
  if (config.mode === 'custom') {
    return {
      x: config.customX ?? canvasSize.width / 2,
      y: config.customY ?? canvasSize.height / 2,
    };
  }

  // Grid mode
  const grid = config.grid ?? 'bottom-right';
  let x: number, y: number;

  // Horizontal
  switch (grid) {
    case 'top-left':
    case 'middle-left':
    case 'bottom-left':
      x = margin + objectSize.width / 2;
      break;
    case 'top-center':
    case 'center':
    case 'bottom-center':
      x = canvasSize.width / 2;
      break;
    case 'top-right':
    case 'middle-right':
    case 'bottom-right':
    default:
      x = canvasSize.width - margin - objectSize.width / 2;
      break;
  }

  // Vertical
  switch (grid) {
    case 'top-left':
    case 'top-center':
    case 'top-right':
      y = margin + objectSize.height / 2;
      break;
    case 'middle-left':
    case 'center':
    case 'middle-right':
      y = canvasSize.height / 2;
      break;
    case 'bottom-left':
    case 'bottom-center':
    case 'bottom-right':
    default:
      y = canvasSize.height - margin - objectSize.height / 2;
      break;
  }

  // Apply fine-tune offset
  x += config.offsetX ?? 0;
  y += config.offsetY ?? 0;

  return { x, y };
}

/**
 * Edge-aligned anchor position for export.
 * Maps grid position to Fabric.js originX/originY for precise pixel alignment.
 */
export function calculateEdgeAlignedAnchorPosition(
  grid: GridPosition,
  canvasSize: Bounds,
  objectSize: Bounds,
  margin: number
): { left: number; top: number; originX: string; originY: string } {
  const horizontalEdge = grid.includes('left')
    ? 'left'
    : grid.includes('right')
      ? 'right'
      : 'center';
  const verticalEdge = grid.includes('top')
    ? 'top'
    : grid.includes('bottom')
      ? 'bottom'
      : 'center';

  return {
    left:
      horizontalEdge === 'left'
        ? margin
        : horizontalEdge === 'right'
          ? canvasSize.width - margin - objectSize.width
          : (canvasSize.width - objectSize.width) / 2,
    top:
      verticalEdge === 'top'
        ? margin
        : verticalEdge === 'bottom'
          ? canvasSize.height - margin - objectSize.height
          : (canvasSize.height - objectSize.height) / 2,
    originX: 'left',
    originY: 'top',
  };
}
