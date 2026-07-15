'use client';

import { useTranslations } from '@/lib/i18n/routing';
import { useWatermarkStore } from '@/lib/stores/watermarkStore';
import { FONT_FAMILIES, WATERMARK_LIMITS } from '@/lib/constants/watermark';
import { Type, Image, Grid3x3, MapPin, RotateCcw, Sun } from 'lucide-react';

export function WatermarkControls() {
  const t = useTranslations('watermark');
  const tc = useTranslations('common');
  const {
    type,
    setType,
    text,
    updateText,
    image,
    updateImage,
    tiled,
    updateTiled,
    position,
    updatePosition,
    transform,
    updateTransform,
    resetAll,
  } = useWatermarkStore();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateImage({ dataUrl: reader.result as string, fileName: file.name });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5 overflow-y-auto h-full pr-1">
      {/* Type selector */}
      <div>
        <label className="text-sm font-semibold mb-2 block">{t('title')}</label>
        <div className="flex gap-1 p-1 bg-muted/80 rounded-full">
          {([
            { key: 'text' as const, icon: Type, label: t('types.text') },
            { key: 'image' as const, icon: Image, label: t('types.image') },
            { key: 'tiled' as const, icon: Grid3x3, label: t('types.tiled') },
          ]).map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setType(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-medium transition-all duration-200 ${
                type === key
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Text watermark settings */}
      {type === 'text' && (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
              {t('text.content')}
            </label>
            <input
              type="text"
              value={text.content}
              onChange={(e) => updateText({ content: e.target.value })}
              placeholder={t('text.contentPlaceholder')}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
                {t('text.font')}
              </label>
              <select
                value={text.fontFamily}
                onChange={(e) => updateText({ fontFamily: e.target.value })}
                className="w-full rounded-lg border bg-background px-2 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              >
                {FONT_FAMILIES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
                {t('text.color')}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={text.color}
                  onChange={(e) => updateText({ color: e.target.value })}
                  className="h-9 w-9 rounded-lg cursor-pointer border-2 border-border/50 shadow-sm"
                />
                <span className="text-xs text-muted-foreground font-mono">
                  {text.color}
                </span>
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
              {t('text.fontSize')}: {text.fontSize}px
            </label>
            <input
              type="range"
              min={WATERMARK_LIMITS.fontSize.min}
              max={WATERMARK_LIMITS.fontSize.max}
              value={text.fontSize}
              onChange={(e) =>
                updateText({ fontSize: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>

          {/* Stroke */}
          <div className="space-y-2 p-3 rounded-lg bg-muted/40">
            <label className="flex items-center gap-2 text-xs font-medium">
              <input
                type="checkbox"
                checked={text.stroke.enabled}
                onChange={(e) =>
                  updateText({
                    stroke: { ...text.stroke, enabled: e.target.checked },
                  })
                }
                className="rounded accent-primary"
              />
              {t('text.stroke')}
            </label>
            {text.stroke.enabled && (
              <div className="flex items-center gap-2 pl-6">
                <input
                  type="color"
                  value={text.stroke.color}
                  onChange={(e) =>
                    updateText({
                      stroke: { ...text.stroke, color: e.target.value },
                    })
                  }
                  className="h-7 w-7 rounded cursor-pointer border"
                />
                <input
                  type="range"
                  min={0}
                  max={WATERMARK_LIMITS.stroke.max}
                  value={text.stroke.width}
                  onChange={(e) =>
                    updateText({
                      stroke: { ...text.stroke, width: Number(e.target.value) },
                    })
                  }
                  className="flex-1"
                />
                <span className="text-xs w-8 text-right font-mono">
                  {text.stroke.width}
                </span>
              </div>
            )}
          </div>

          {/* Shadow */}
          <div className="space-y-2 p-3 rounded-lg bg-muted/40">
            <label className="flex items-center gap-2 text-xs font-medium">
              <input
                type="checkbox"
                checked={text.shadow.enabled}
                onChange={(e) =>
                  updateText({
                    shadow: { ...text.shadow, enabled: e.target.checked },
                  })
                }
                className="rounded accent-primary"
              />
              {t('text.shadow')}
            </label>
            {text.shadow.enabled && (
              <div className="pl-6 space-y-1">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={text.shadow.color}
                    onChange={(e) =>
                      updateText({
                        shadow: { ...text.shadow, color: e.target.value },
                      })
                    }
                    className="h-7 w-7 rounded cursor-pointer border"
                  />
                  <label className="text-xs text-muted-foreground flex-1">
                    {t('text.shadowBlur')}
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={WATERMARK_LIMITS.shadowBlur.max}
                    value={text.shadow.blur}
                    onChange={(e) =>
                      updateText({
                        shadow: { ...text.shadow, blur: Number(e.target.value) },
                      })
                    }
                    className="w-20"
                  />
                  <span className="text-xs w-6 text-right font-mono">
                    {text.shadow.blur}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image watermark settings */}
      {type === 'image' && (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
              {t('image.upload')}
            </label>
            <label className="flex items-center justify-center gap-2 border-2 border-dashed rounded-xl p-5 cursor-pointer hover:border-primary/50 hover:bg-primary/[0.03] transition-all duration-200">
              <Image className="h-5 w-5 text-primary/70" />
              <span className="text-sm text-muted-foreground">
                {image.fileName || t('image.upload')}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
              {t('image.width')}: {image.width}px
            </label>
            <input
              type="range"
              min={WATERMARK_LIMITS.imageWidth.min}
              max={WATERMARK_LIMITS.imageWidth.max}
              step={10}
              value={image.width}
              onChange={(e) => updateImage({ width: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <label className="flex items-center gap-2 text-xs font-medium">
            <input
              type="checkbox"
              checked={image.preserveAspectRatio}
              onChange={(e) =>
                updateImage({ preserveAspectRatio: e.target.checked })
              }
              className="rounded accent-primary"
            />
            {t('image.keepRatio')}
          </label>
        </div>
      )}

      {/* Tiled watermark settings */}
      {type === 'tiled' && (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
              {t('tiled.content')}
            </label>
            <input
              type="text"
              value={tiled.content}
              onChange={(e) => updateTiled({ content: e.target.value })}
              placeholder={t('tiled.contentPlaceholder')}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
                {t('tiled.spacingX')}: {tiled.spacingX}
              </label>
              <input
                type="range"
                min={WATERMARK_LIMITS.tiledSpacing.min}
                max={WATERMARK_LIMITS.tiledSpacing.max}
                value={tiled.spacingX}
                onChange={(e) =>
                  updateTiled({ spacingX: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
                {t('tiled.spacingY')}: {tiled.spacingY}
              </label>
              <input
                type="range"
                min={WATERMARK_LIMITS.tiledSpacing.min}
                max={WATERMARK_LIMITS.tiledSpacing.max}
                value={tiled.spacingY}
                onChange={(e) =>
                  updateTiled({ spacingY: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
              {t('tiled.rotation')}: {tiled.rotation}°
            </label>
            <input
              type="range"
              min={-180}
              max={180}
              value={tiled.rotation}
              onChange={(e) =>
                updateTiled({ rotation: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
              {t('tiled.fontSize')}: {tiled.fontSize}px
            </label>
            <input
              type="range"
              min={8}
              max={80}
              value={tiled.fontSize}
              onChange={(e) =>
                updateTiled({ fontSize: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
              {t('tiled.color')}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={tiled.color.startsWith('rgba') ? '#ffffff' : tiled.color}
                onChange={(e) => updateTiled({ color: e.target.value })}
                className="h-9 w-9 rounded-lg cursor-pointer border-2 border-border/50 shadow-sm"
              />
              <span className="text-xs text-muted-foreground font-mono">
                {tiled.color}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Position (shared) */}
      <div className="border-t border-border/60 pt-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-accent/60">
            <MapPin className="h-3 w-3 text-accent-foreground" />
          </div>
          <label className="text-sm font-semibold">{t('position.title')}</label>
        </div>
        {type !== 'tiled' && (
          <>
            <div className="flex gap-1 p-1 bg-muted/80 rounded-full">
              <button
                onClick={() => updatePosition({ mode: 'grid' })}
                className={`flex-1 text-xs py-1.5 rounded-full font-medium transition-all duration-200 ${
                  position.mode === 'grid'
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('position.grid')}
              </button>
              <button
                onClick={() => updatePosition({ mode: 'custom' })}
                className={`flex-1 text-xs py-1.5 rounded-full font-medium transition-all duration-200 ${
                  position.mode === 'custom'
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('position.custom')}
              </button>
            </div>

            {position.mode === 'grid' ? (
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    'top-left', 'top-center', 'top-right',
                    'middle-left', 'center', 'middle-right',
                    'bottom-left', 'bottom-center', 'bottom-right',
                  ] as const
                ).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => updatePosition({ grid: pos })}
                    className={`aspect-square rounded-lg text-[10px] transition-all duration-200 ${
                      position.grid === pos
                        ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25 scale-105'
                        : 'bg-muted/70 hover:bg-primary/10 hover:text-primary'
                    }`}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground font-medium">
                    {t('position.offsetX')}
                  </label>
                  <input
                    type="number"
                    value={position.customX ?? 0}
                    onChange={(e) =>
                      updatePosition({ customX: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border px-2 py-1.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">
                    {t('position.offsetY')}
                  </label>
                  <input
                    type="number"
                    value={position.customY ?? 0}
                    onChange={(e) =>
                      updatePosition({ customY: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border px-2 py-1.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
              </div>
            )}
          </>
        )}
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
            {t('position.margin')}: {position.margin}px
          </label>
          <input
            type="range"
            min={WATERMARK_LIMITS.margin.min}
            max={WATERMARK_LIMITS.margin.max}
            value={position.margin}
            onChange={(e) =>
              updatePosition({ margin: Number(e.target.value) })
            }
            className="w-full"
          />
        </div>
      </div>

      {/* Transform (shared) */}
      <div className="border-t border-border/60 pt-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-accent/60">
            <Sun className="h-3 w-3 text-accent-foreground" />
          </div>
          <label className="text-sm font-semibold">{t('transform.title')}</label>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
            {t('transform.opacity')}: {Math.round(transform.opacity * 100)}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={transform.opacity * 100}
            onChange={(e) =>
              updateTransform({ opacity: Number(e.target.value) / 100 })
            }
            className="w-full"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
            {t('transform.rotation')}: {transform.rotation}°
          </label>
          <input
            type="range"
            min={WATERMARK_LIMITS.rotation.min}
            max={WATERMARK_LIMITS.rotation.max}
            value={transform.rotation}
            onChange={(e) =>
              updateTransform({ rotation: Number(e.target.value) })
            }
            className="w-full"
          />
        </div>
        {type !== 'tiled' && (
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
              {t('transform.scale')}: {transform.scale}x
            </label>
            <input
              type="range"
              min={10}
              max={500}
              value={transform.scale * 100}
              onChange={(e) =>
                updateTransform({ scale: Number(e.target.value) / 100 })
              }
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Reset */}
      <button
        onClick={resetAll}
        className="w-full text-xs text-muted-foreground hover:text-destructive py-2.5 border border-border/60 rounded-lg transition-all duration-200 hover:border-destructive/30 hover:bg-destructive/5 flex items-center justify-center gap-1.5"
      >
        <RotateCcw className="h-3 w-3" />
        {tc('reset')}
      </button>
    </div>
  );
}
