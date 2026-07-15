'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from '@/lib/i18n/routing';
import { ImageUpload } from '@/components/upload/ImageUpload';
import { WatermarkControls } from '@/components/controls/WatermarkControls';
import { ExportPanel } from '@/components/export/ExportPanel';
import { PrivacyBanner } from '@/components/common/PrivacyBanner';

// Dynamic import for Fabric.js canvas (client-side only)
const WatermarkCanvas = dynamic(
  () =>
    import('@/components/editor/WatermarkCanvas').then(
      (mod) => mod.WatermarkCanvas
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center border rounded-lg bg-muted/30">
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
    <div className="container mx-auto px-4 py-4">
      {/* Privacy banner */}
      <div className="mb-4">
        <PrivacyBanner />
      </div>

      {/* Main layout: 3 columns on desktop, stacked on mobile */}
      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-10rem)]">
        {/* Left panel: Upload + Gallery */}
        <div className="lg:w-1/4 flex flex-col min-h-0 border rounded-lg p-3 bg-card">
          <h2 className="text-sm font-medium mb-2">
            {tu('title')}
          </h2>
          <div className="flex-1 min-h-0 overflow-hidden">
            <ImageUpload />
          </div>
        </div>

        {/* Center panel: Canvas Preview */}
        <div className="lg:w-1/2 flex flex-col min-h-0 border rounded-lg p-3 bg-card">
          <WatermarkCanvas />
        </div>

        {/* Right panel: Controls + Export */}
        <div className="lg:w-1/4 flex flex-col min-h-0 gap-4">
          {/* Watermark controls */}
          <div className="flex-1 min-h-0 border rounded-lg p-3 bg-card overflow-hidden">
            <WatermarkControls />
          </div>

          {/* Export settings */}
          <div className="lg:max-h-[40%] min-h-0 border rounded-lg p-3 bg-card overflow-hidden">
            <ExportPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
