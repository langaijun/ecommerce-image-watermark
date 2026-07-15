'use client';

import { useEffect, useRef } from 'react';
import { useWatermarkStore } from '@/lib/stores/watermarkStore';

/**
 * Lightweight canvas overlay that renders a semi-transparent watermark
 * preview on top of an image thumbnail. Uses native Canvas 2D API (no Fabric.js).
 */
export function ThumbnailWatermark({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wmType = useWatermarkStore((s) => s.type);
  const wmText = useWatermarkStore((s) => s.text);
  const wmTiled = useWatermarkStore((s) => s.tiled);
  const wmTransform = useWatermarkStore((s) => s.transform);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    const opacity = wmTransform.opacity * 0.6; // Slightly more transparent for thumbnails

    if (wmType === 'text' && wmText.content) {
      drawTextWatermark(ctx, wmText.content, width, height, opacity);
    } else if (wmType === 'tiled' && wmTiled.content) {
      drawTiledWatermark(ctx, wmTiled, width, height, opacity);
    } else if (wmType === 'combo' && wmText.content) {
      drawTextWatermark(ctx, wmText.content, width, height, opacity);
    }
  }, [wmType, wmText, wmTiled, wmTransform, width, height]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

function drawTextWatermark(
  ctx: CanvasRenderingContext2D,
  text: string,
  w: number,
  h: number,
  opacity: number
) {
  const fontSize = Math.max(8, Math.min(w, h) * 0.12);
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 2;

  // Position at bottom-right
  const x = w * 0.75;
  const y = h * 0.8;
  ctx.fillText(text, x, y, w * 0.45);
  ctx.restore();
}

function drawTiledWatermark(
  ctx: CanvasRenderingContext2D,
  config: { content: string; rotation: number },
  w: number,
  h: number,
  opacity: number
) {
  const fontSize = Math.max(6, Math.min(w, h) * 0.08);
  ctx.save();
  ctx.globalAlpha = opacity * 0.5;
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const angle = (config.rotation * Math.PI) / 180;
  const spacingX = fontSize * config.content.length * 0.7 + 20;
  const spacingY = fontSize * 2.5;

  for (let y = -h; y < h * 2; y += spacingY) {
    for (let x = -w; x < w * 2; x += spacingX) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(config.content, 0, 0);
      ctx.restore();
    }
  }
  ctx.restore();
}
