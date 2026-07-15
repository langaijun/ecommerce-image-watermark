'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useTranslations } from '@/lib/i18n/routing';
import { useImageStore } from '@/lib/stores/imageStore';
import { useWatermarkStore } from '@/lib/stores/watermarkStore';
import { WatermarkEngine } from '@/lib/canvas/watermarkEngine';

const MAX_PREVIEW_SIZE = 600;

export function WatermarkCanvas() {
  const t = useTranslations('preview');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<WatermarkEngine | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedImage = useImageStore((s) => s.getSelectedImage());

  // Select individual store values to avoid new object reference each render
  const wmType = useWatermarkStore((s) => s.type);
  const wmText = useWatermarkStore((s) => s.text);
  const wmImage = useWatermarkStore((s) => s.image);
  const wmTiled = useWatermarkStore((s) => s.tiled);
  const wmPosition = useWatermarkStore((s) => s.position);
  const wmTransform = useWatermarkStore((s) => s.transform);

  // Initialize engine when canvas element becomes available
  const initEngine = useCallback(() => {
    if (!canvasRef.current || engineRef.current) return;

    const engine = new WatermarkEngine();
    engine.init(canvasRef.current, MAX_PREVIEW_SIZE, MAX_PREVIEW_SIZE);
    engineRef.current = engine;
  }, []);

  // Re-init engine whenever selectedImage changes (canvas may have re-rendered)
  useEffect(() => {
    if (selectedImage && canvasRef.current) {
      initEngine();
    }
  }, [selectedImage, initEngine]);

  // Cleanup engine on unmount
  useEffect(() => {
    return () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  // Load selected image as background
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
      <div className="text-sm font-semibold mb-2 flex items-center gap-2">
        <span className="flex items-center justify-center w-5 h-5 rounded bg-primary/10">
          <svg className="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        </span>
        {t('title')}
      </div>

      {!selectedImage ? (
        <div className="flex-1 flex flex-col items-center justify-center border rounded-xl bg-muted/20 gap-3">
          <svg className="w-12 h-12 text-muted-foreground/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          <p className="text-muted-foreground text-sm">{t('noImage')}</p>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center border rounded-xl bg-[repeating-conic-gradient(#80808015_0%_25%,transparent_0%_50%)] bg-[length:16px_16px] overflow-hidden"
        >
          <canvas ref={canvasRef} className="max-w-full max-h-full" />
        </div>
      )}
    </div>
  );
}
