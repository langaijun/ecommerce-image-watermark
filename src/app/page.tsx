'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from '@/lib/i18n/routing';
import { ImageUpload } from '@/components/upload/ImageUpload';
import { WatermarkControls } from '@/components/controls/WatermarkControls';
import { ExportPanel } from '@/components/export/ExportPanel';
import { PrivacyBanner } from '@/components/common/PrivacyBanner';
import { TemplateManager } from '@/components/templates/TemplateManager';
import { ImageIcon } from 'lucide-react';

// Dynamic import for Fabric.js canvas (client-side only)
const WatermarkCanvas = dynamic(
  () =>
    import('@/components/editor/WatermarkCanvas').then(
      (mod) => mod.WatermarkCanvas
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center rounded-xl bg-muted/30">
        <div className="animate-pulse text-muted-foreground text-sm">
          Loading preview...
        </div>
      </div>
    ),
  }
);

export default function HomePage() {
  const tu = useTranslations('upload');

  return (
    <div className="container mx-auto px-4 py-5">
      {/* Privacy banner */}
      <div className="mb-5">
        <PrivacyBanner />
      </div>

      {/* Main layout: 3 columns on desktop, stacked on mobile */}
      <div className="flex flex-col lg:flex-row gap-5 h-[calc(100vh-11rem)]">
        {/* Left panel: Upload + Gallery */}
        <div className="lg:w-[26%] flex flex-col min-h-0 rounded-xl panel-glass p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
              <ImageIcon className="h-3.5 w-3.5 text-primary" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">
              {tu('title')}
            </h2>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <ImageUpload />
          </div>
        </div>

        {/* Center panel: Canvas Preview */}
        <div className="lg:w-1/2 flex flex-col min-h-0 rounded-xl panel-glass p-4">
          <WatermarkCanvas />
        </div>

        {/* Right panel: Controls + Export */}
        <div className="lg:w-[24%] flex flex-col min-h-0 gap-5">
          {/* Watermark controls */}
          <div className="flex-1 min-h-0 rounded-xl panel-glass p-4 overflow-hidden">
            <WatermarkControls />
          </div>

          {/* Template manager */}
          <div className="rounded-xl panel-glass p-4">
            <TemplateManager />
          </div>

          {/* Export settings */}
          <div className="lg:max-h-[40%] min-h-0 rounded-xl panel-glass p-4 overflow-hidden">
            <ExportPanel />
          </div>
        </div>
      </div>

      {/* FAQ Section - SEO */}
      <section className="mt-10 mb-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-foreground">
          常见问题 - 电商产品图批量水印工具 FAQ
        </h2>
        <div className="space-y-3">
          <details className="group rounded-xl panel-glass p-4">
            <summary className="flex items-center justify-between cursor-pointer font-medium text-foreground">
              <h3>这个水印工具是免费的吗？</h3>
              <span className="ml-2 transition-transform group-open:rotate-180 text-muted-foreground select-none">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              是的，完全免费。所有功能无需注册即可使用，没有水印数量限制，不限导出次数，不限图片尺寸。您可以随时使用，为任意数量的产品图片添加水印。
            </p>
          </details>

          <details className="group rounded-xl panel-glass p-4">
            <summary className="flex items-center justify-between cursor-pointer font-medium text-foreground">
              <h3>我的图片会上传到服务器吗？数据安全吗？</h3>
              <span className="ml-2 transition-transform group-open:rotate-180 text-muted-foreground select-none">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              不会。所有图片处理都在您的浏览器本地完成（使用 Canvas API），图片不会上传到任何服务器。您的产品图片、水印内容和导出数据全部在本地处理，完全保护您的隐私和商业机密。
            </p>
          </details>

          <details className="group rounded-xl panel-glass p-4">
            <summary className="flex items-center justify-between cursor-pointer font-medium text-foreground">
              <h3>支持哪些电商平台？有哪些尺寸预设？</h3>
              <span className="ml-2 transition-transform group-open:rotate-180 text-muted-foreground select-none">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              支持 Amazon、淘宝/天猫、Shopify、拼多多、eBay、Etsy、京东、Google Shopping 等 8 大主流电商平台的图片尺寸预设。每个平台预设都包含推荐的图片尺寸和比例，帮助您快速生成符合平台要求的产品图片。同时支持自定义尺寸，满足个性化需求。
            </p>
          </details>

          <details className="group rounded-xl panel-glass p-4">
            <summary className="flex items-center justify-between cursor-pointer font-medium text-foreground">
              <h3>支持哪些图片格式？</h3>
              <span className="ml-2 transition-transform group-open:rotate-180 text-muted-foreground select-none">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              输入支持 JPG/JPEG、PNG、WebP、AVIF 格式的图片，输出可导出为 JPEG、PNG 或 WebP 格式。PNG 支持透明背景，WebP 格式可以在保持质量的同时大幅减小文件体积，适合电商平台上架。
            </p>
          </details>

          <details className="group rounded-xl panel-glass p-4">
            <summary className="flex items-center justify-between cursor-pointer font-medium text-foreground">
              <h3>如何批量处理多张图片？可以一次添加水印到多张图吗？</h3>
              <span className="ml-2 transition-transform group-open:rotate-180 text-muted-foreground select-none">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              可以。您可以一次上传多张图片，设置好水印参数后，一键批量应用到所有图片。支持文字水印、图片水印（Logo）和平铺水印三种类型。导出时支持 ZIP 打包下载，大幅提升工作效率。
            </p>
          </details>

          <details className="group rounded-xl panel-glass p-4">
            <summary className="flex items-center justify-between cursor-pointer font-medium text-foreground">
              <h3>可以保存水印模板吗？下次使用需要重新设置吗？</h3>
              <span className="ml-2 transition-transform group-open:rotate-180 text-muted-foreground select-none">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              支持保存水印模板。您可以将常用的水印设置（包括文字内容、字体、颜色、位置、透明度等）保存为模板，下次使用时直接加载，无需重复配置。模板数据存储在浏览器本地，安全可靠。
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
