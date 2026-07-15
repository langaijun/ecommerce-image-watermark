'use client';

import { useTranslations } from '@/lib/i18n/routing';
import { useWatermarkStore } from '@/lib/stores/watermarkStore';
import { FONT_FAMILIES, WATERMARK_LIMITS } from '@/lib/constants/watermark';
import { Type, Image, Grid3x3 } from 'lucide-react';

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
    <div className="space-y-4 overflow-y-auto h-full pr-1">
      {/* Type selector */}
      <div>
        <label className="text-sm font-medium mb-1.5 block">{t('title')}</label>
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          {([
            { key: 'text' as const, icon: Type, label: t('types.text') },
            { key: 'image' as const, icon: Image, label: t('types.image') },
            { key: 'tiled' as const, icon: Grid3x3, label: t('types.tiled') },
          ]).map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setType(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors ${
                type === key
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
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
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              {t('text.content')}
            </label>
            <input
              type="text"
              value={text.content}
              onChange={(e) => updateText({ content: e.target.value })}
              placeholder={t('text.contentPlaceholder')}
              className="w-full rounded-md border bg-background px-3 py-1.5 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                {t('text.font')}
              </label>
              <select
                value={text.fontFamily}
                onChange={(e) => updateText({ fontFamily: e.target.value })}
                className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
              >
                {FONT_FAMILIES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                {t('text.color')}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={text.color}
                  onChange={(e) => updateText({ color: e.target.value })}
                  className="h-8 w-8 rounded cursor-pointer border"
                />
                <span className="text-xs text-muted-foreground">
                  {text.color}
                </span>
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
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
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={text.stroke.enabled}
                onChange={(e) =>
                  updateText({
                    stroke: { ...text.stroke, enabled: e.target.checked },
                  })
                }
                className="rounded"
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
                  className="h-6 w-6 rounded cursor-pointer border"
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
                <span className="text-xs w-8 text-right">
                  {text.stroke.width}
                </span>
              </div>
            )}
          </div>

          {/* Shadow */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={text.shadow.enabled}
                onChange={(e) =>
                  updateText({
                    shadow: { ...text.shadow, enabled: e.target.checked },
                  })
                }
                className="rounded"
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
                    className="h-6 w-6 rounded cursor-pointer border"
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
                  <span className="text-xs w-6 text-right">
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
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              {t('image.upload')}
            </label>
            <label className="flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors">
              <Image className="h-5 w-5 text-muted-foreground" />
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
            <label className="text-xs text-muted-foreground mb-1 block">
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
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={image.preserveAspectRatio}
              onChange={(e) =>
                updateImage({ preserveAspectRatio: e.target.checked })
              }
              className="rounded"
            />
            {t('image.keepRatio')}
          </label>
        </div>
      )}

      {/* Tiled watermark settings */}
      {type === 'tiled' && (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              {t('tiled.content')}
            </label>
            <input
              type="text"
              value={tiled.content}
              onChange={(e) => updateTiled({ content: e.target.value })}
              placeholder={t('tiled.contentPlaceholder')}
              className="w-full rounded-md border bg-background px-3 py-1.5 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
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
              <label className="text-xs text-muted-foreground mb-1 block">
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
            <label className="text-xs text-muted-foreground mb-1 block">
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
            <label className="text-xs text-muted-foreground mb-1 block">
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
            <label className="text-xs text-muted-foreground mb-1 block">
              {t('tiled.color')}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={tiled.color.startsWith('rgba') ? '#ffffff' : tiled.color}
                onChange={(e) => updateTiled({ color: e.target.value })}
                className="h-8 w-8 rounded cursor-pointer border"
              />
              <span className="text-xs text-muted-foreground">
                {tiled.color}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Position (shared) */}
      <div className="border-t pt-3 space-y-3">
        <label className="text-sm font-medium">{t('position.title')}</label>
        {type !== 'tiled' && (
          <>
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
              <button
                onClick={() => updatePosition({ mode: 'grid' })}
                className={`flex-1 text-xs py-1 rounded-md ${
                  position.mode === 'grid'
                    ? 'bg-background shadow-sm'
                    : 'text-muted-foreground'
                }`}
              >
                {t('position.grid')}
              </button>
              <button
                onClick={() => updatePosition({ mode: 'custom' })}
                className={`flex-1 text-xs py-1 rounded-md ${
                  position.mode === 'custom'
                    ? 'bg-background shadow-sm'
                    : 'text-muted-foreground'
                }`}
              >
                {t('position.custom')}
              </button>
            </div>

            {position.mode === 'grid' ? (
              <div className="grid grid-cols-3 gap-1">
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
                    className={`aspect-square rounded-md text-[10px] transition-colors ${
                      position.grid === pos
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">
                    {t('position.offsetX')}
                  </label>
                  <input
                    type="number"
                    value={position.customX ?? 0}
                    onChange={(e) =>
                      updatePosition({ customX: Number(e.target.value) })
                    }
                    className="w-full rounded-md border px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">
                    {t('position.offsetY')}
                  </label>
                  <input
                    type="number"
                    value={position.customY ?? 0}
                    onChange={(e) =>
                      updatePosition({ customY: Number(e.target.value) })
                    }
                    className="w-full rounded-md border px-2 py-1 text-sm"
                  />
                </div>
              </div>
            )}
          </>
        )}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
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
      <div className="border-t pt-3 space-y-3">
        <label className="text-sm font-medium">{t('transform.title')}</label>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
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
          <label className="text-xs text-muted-foreground mb-1 block">
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
            <label className="text-xs text-muted-foreground mb-1 block">
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
        className="w-full text-xs text-muted-foreground hover:text-foreground py-2 border rounded-md transition-colors"
      >
        {tc('reset')}
      </button>
    </div>
  );
}
