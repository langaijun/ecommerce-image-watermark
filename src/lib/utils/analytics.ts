import { track } from '@vercel/analytics';

export function trackUpload(count: number) {
  track('images_uploaded', { count });
}

export function trackProcess(count: number, platform?: string) {
  track('images_processed', { count, platform: platform || 'none' });
}

export function trackDownload(format: string) {
  track('zip_downloaded', { format });
}

export function trackTemplateSaved() {
  track('template_saved');
}

export function trackPlatformSelected(platform: string) {
  track('platform_selected', { platform });
}
