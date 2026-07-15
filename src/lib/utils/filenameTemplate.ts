/**
 * Filename template engine.
 *
 * Supported variables:
 *   {name}              → original filename without extension
 *   {ext}               → output extension (jpg, png, webp)
 *   {platform}          → platform id (amazon, taobao, etc.) or empty
 *   {width}             → output width in pixels
 *   {height}            → output height in pixels
 *   {size}              → "{width}x{height}" (e.g. "1000x1000")
 *   {date}              → YYYYMMDD
 *   {datetime}          → YYYYMMDD_HHmmss
 *   {index}             → sequential number (1, 2, 3…)
 *   {index:N}           → zero-padded index, N = total digits
 *                          e.g. {index:3} → 001, 002…
 *   {index:4}           → 0001, 0002…
 *
 * Default template: "{name}{platform?_{platform}}{size?_{size}}"
 *   → "headphones_amazon_1000x1000"
 *
 * Conditional syntax: {condition?_value}
 *   The segment is only included when the variable is non-empty.
 *   Example: {platform?_{platform}} only adds "_amazon" when platform is set.
 */

export const DEFAULT_TEMPLATE = '{name}{platform?_{platform}}{size?_{size}}';

export const TEMPLATE_VARIABLES = [
  { key: '{name}', desc: '原文件名', descEn: 'Original name' },
  { key: '{ext}', desc: '扩展名', descEn: 'Extension' },
  { key: '{platform}', desc: '平台', descEn: 'Platform' },
  { key: '{width}', desc: '宽度', descEn: 'Width' },
  { key: '{height}', desc: '高度', descEn: 'Height' },
  { key: '{size}', desc: '宽x高', descEn: 'WxH' },
  { key: '{date}', desc: '日期', descEn: 'Date' },
  { key: '{datetime}', desc: '日期时间', descEn: 'Datetime' },
  { key: '{index}', desc: '序号', descEn: 'Index' },
  { key: '{index:3}', desc: '3位序号', descEn: '3-digit index' },
] as const;

interface TemplateContext {
  name: string;
  ext: string;
  platform: string;
  width: number;
  height: number;
  index: number;
}

/**
 * Render a filename from a template string and context.
 */
export function renderFilename(
  template: string,
  ctx: TemplateContext
): string {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const datetime = `${date}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
  const size = `${ctx.width}x${ctx.height}`;

  // First, handle conditional segments: {var?_suffix}
  let result = template.replace(/\{(\w+)\?([^}]*)\}/g, (_, varName, suffix) => {
    const value = getVariableValue(varName, ctx, { date, datetime, size });
    if (!value && value !== 0) return '';
    // Replace variables inside the suffix
    return suffix.replace(/\{(\w+)(?::(\d+))?\}/g, (__: string, vn: string, pad?: string) => {
      const v = getVariableValue(vn, ctx, { date, datetime, size, index: ctx.index, pad });
      return String(v);
    });
  });

  // Then, handle regular variables: {var} and {var:N}
  result = result.replace(/\{(\w+)(?::(\d+))?\}/g, (_, varName, pad) => {
    const value = getVariableValue(varName, ctx, { date, datetime, size, index: ctx.index, pad });
    return String(value ?? '');
  });

  // Sanitize: remove invalid filename characters, collapse multiple dots/spaces
  return result
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\.{2,}/g, '.')
    .replace(/\s+/g, '_')
    .trim()
    + '.' + ctx.ext;
}

function getVariableValue(
  varName: string,
  ctx: TemplateContext,
  extras: { date: string; datetime: string; size: string; index?: number; pad?: string }
): string | number {
  switch (varName) {
    case 'name': return ctx.name;
    case 'ext': return ctx.ext;
    case 'platform': return ctx.platform;
    case 'width': return ctx.width;
    case 'height': return ctx.height;
    case 'size': return extras.size;
    case 'date': return extras.date;
    case 'datetime': return extras.datetime;
    case 'index': {
      const idx = extras.index ?? ctx.index;
      if (extras.pad) {
        const padLen = parseInt(extras.pad, 10);
        return String(idx).padStart(padLen, '0');
      }
      return idx;
    }
    default: return `{${varName}}`;
  }
}

/**
 * Generate a preview of what the filename will look like.
 */
export function previewFilename(
  template: string,
  sampleName: string = 'product_photo',
  platform: string = 'amazon',
  width: number = 1000,
  height: number = 1000,
  ext: string = 'jpg'
): string {
  return renderFilename(template, {
    name: sampleName,
    ext,
    platform,
    width,
    height,
    index: 1,
  });
}
