'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useTranslations } from '@/lib/i18n/routing';
import { useImageStore } from '@/lib/stores/imageStore';
import { useWatermarkStore } from '@/lib/stores/watermarkStore';
import { WatermarkEngine } from '@/lib/canvas/watermarkEngine';
import { Eye, EyeOff } from 'lucide-react';

const MAX_PREVIEW_SIZE = 600;

export function WatermarkCanvas() {
  const t = useTranslations('preview');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<WatermarkEngine | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showOriginal, setShowOriginal] = useState(false);

  const selectedImage = useImageStore((s) => s.getSelectedImage());

  const wmType = useWatermarkStore((s) => s.type);
  const wmText = useWatermarkStore((s) => s.text);
  const wmImage = useWatermarkStore((s) => s.image);
  const wmTiled = useWatermarkStore((s) => s.tiled);
  const wmPosition = useWatermarkStore((s) => s.position);
  const wmTransform = useWatermarkStore((s) => s.transform);

  const initEngine = useCallback(() => {
    if (!canvasRef.current || engineRef.current) return;

    const engine = new WatermarkEngine();
    engine.init(canvasRef.current, MAX_PREVIEW_SIZE, MAX_PREVIEW_SIZE);
    engineRef.current = engine;
  }, []);

  useEffect(() => {
    if (selectedImage && canvasRef.current) {
      initEngine();
    }
  }, [selectedImage, initEngine]);

  useEffect(() => {
    return () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || !selectedImage) return;

    engine
      .setBackgroundImage(selectedImage.file, MAX_PREVIEW_SIZE, MAX_PREVIEW_SIZE)
      .catch(console.error);
  }, [selectedImage]);

  // Listen for keyboard shortcut: Space toggles original/watermark view
  useEffect(() => {
    const handler = () => setShowOriginal((prev) => !prev);
    window.addEventListener('shortcut:togglePreview', handler);
    return () => window.removeEventListener('shortcut:togglePreview', handler);
  }, []);

  // Enable drag-to-position on watermark objects
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    engine.setDraggable(!showOriginal);
    engine.onObjectMoved((x, y) => {
      useWatermarkStore.getState().updatePosition({
        mode: 'custom',
        customX: x,
        customY: y,
      });
    });
  }, [showOriginal]);

  // Apply or remove watermark based on showOriginal toggle
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || !selectedImage) return;

    if (showOriginal) {
      engine.removeWatermark();
    } else {
      const config = {
        type: wmType,
        text: wmText,
        image: wmImage,
        tiled: wmTiled,
        position: wmPosition,
        transform: wmTransform,
      };
      engine.applyWatermark(config).catch(console.error);
    }
  }, [wmType, wmText, wmImage, wmTiled, wmPosition, wmTransform, selectedImage, showOriginal]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded bg-primary/10">
            <svg className="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </span>
          {t('title')}
        </div>
        {selectedImage && (
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
              showOriginal
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted/80 text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {showOriginal ? (
              <>
                <EyeOff className="h-3 w-3" />
                {t('showOriginal')}
              </>
            ) : (
              <>
                <Eye className="h-3 w-3" />
                {t('showWatermark')}
              </>
            )}
          </button>
        )}
      </div>

      {!selectedImage ? (
        <div className="flex-1 flex flex-col items-center justify-center border rounded-xl bg-muted/20 gap-3">
          <svg className="w-12 h-12 text-muted-foreground/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          <p className="text-muted-foreground text-sm">{t('noImage')}</p>
        </div>
      ) : (
        <div className="relative flex-1">
          <div
            ref={containerRef}
            className="h-full flex items-center justify-center border rounded-xl bg-[repeating-conic-gradient(#80808015_0%_25%,transparent_0%_50%)] bg-[length:16px_16px] overflow-hidden"
          >
            <canvas ref={canvasRef} className="max-w-full max-h-full" />
          </div>
          {/* Status badge */}
          <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-medium ${
            showOriginal
              ? 'bg-accent/80 text-accent-foreground backdrop-blur-sm'
              : 'bg-primary/80 text-primary-foreground backdrop-blur-sm'
          }`}>
            {showOriginal ? t('originalBadge') : t('watermarkBadge')}
          </div>
        </div>
      )}
    </div>
  );
}
