import type { Metadata } from 'next';
import { ClientProviders } from '@/components/ClientProviders';
import './globals.css';

export const metadata: Metadata = {
  title: '电商产品图批量水印工具 - 免费在线 | E-Commerce Image Watermark Tool',
  description:
    '免费专业的电商产品图片批量水印工具，支持Amazon、淘宝、Shopify等多平台预设，浏览器本地处理保护隐私，批量导出ZIP下载。',
  keywords: [
    'watermark',
    'image watermark',
    'batch watermark',
    'ecommerce',
    '水印',
    '批量水印',
    '电商水印',
    '产品图',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased" suppressHydrationWarning>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
