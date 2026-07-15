'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from '@/lib/i18n/routing';
import { useImageStore } from '@/lib/stores/imageStore';
import { useWatermarkStore } from '@/lib/stores/watermarkStore';
import { WatermarkEngine } from '@/lib/canvas/watermarkEngine';

const MAX_PREVIEW_SIZE = 600;

export function WatermarkCanvas() {
  const t = useTranslations('preview');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<WatermarkEngine | null>(null);

  const selectedImage = useImageStore((s) => s.getSelectedImage());

  // Select individual store values to avoid new object reference each render
  const wmType = useWatermarkStore((s) => s.type);
  const wmText = useWatermarkStore((s) => s.text);
  const wmImage = useWatermarkStore((s) => s.image);
  const wmTiled = useWatermarkStore((s) => s.tiled);
  const wmPosition = useWatermarkStore((s) => s.position);
  const wmTransform = useWatermarkStore((s) => s.transform);

  // Initialize engine
  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new WatermarkEngine();
    engine.init(canvasRef.current, MAX_PREVIEW_SIZE, MAX_PREVIEW_SIZE);
    engineRef.current = engine;

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  // Load selected image
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || !selectedImage) return;

    engine
      .setBackgroundImage(selectedImage.file, MAX_PREVIEW_SIZE, MAX_PREVIEW_SIZE)
      .catch(console.error);
  }, [selectedImage]);

  // Apply watermark whenever config changes
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || !selectedImage) return;

    const config = {
      type: wmType,
      text: wmText,
      image: wmImage,
      tiled: wmTiled,
      position: wmPosition,
      transform: wmTransform,
    };

    engine.applyWatermark(config).catch(console.error);
  }, [wmType, wmText, wmImage, wmTiled, wmPosition, wmTransform, selectedImage]);

  return (
    <div className="flex flex-col h-full">
      <div className="text-sm font-medium mb-2">{t('title')}</div>

      {!selectedImage ? (
        <div className="flex-1 flex items-center justify-center border rounded-lg bg-muted/30">
          <p className="text-muted-foreground text-sm">{t('noImage')}</p>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center border rounded-lg bg-[repeating-conic-gradient(#80808020_0%_25%,transparent_0%_50%)] bg-[length:20px_20px] overflow-hidden">
          <canvas ref={canvasRef} className="max-w-full max-h-full" />
        </div>
      )}
    </div>
  );
}
