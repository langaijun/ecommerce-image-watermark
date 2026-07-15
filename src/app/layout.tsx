import type { Metadata } from 'next';
import { ClientProviders } from '@/components/ClientProviders';
import { StructuredData } from '@/components/StructuredData';
import './globals.css';

const SITE_URL = 'https://ecommerce-image-watermark.vercel.app';

export const metadata: Metadata = {
  title: '电商产品图批量水印工具 - 免费在线 | E-Commerce Image Watermark Tool',
  description:
    '免费专业的电商产品图片批量水印工具，支持文字水印、图片水印、平铺水印三种类型，Amazon、淘宝、Shopify、拼多多、eBay、Etsy、京东、Google Shopping等8大平台尺寸预设，100%浏览器本地处理保护隐私，批量导出ZIP打包下载。',
  keywords: [
    'watermark',
    'image watermark',
    'batch watermark',
    'ecommerce watermark',
    'product image watermark',
    'online watermark tool',
    'free watermark',
    'bulk watermark',
    '水印',
    '批量水印',
    '电商水印',
    '产品图水印',
    '在线水印工具',
    '免费水印',
    '图片水印',
    '文字水印',
    '批量加水印',
  ],
  openGraph: {
    title: '电商产品图批量水印工具 - 免费在线 | E-Commerce Image Watermark Tool',
    description:
      '免费专业的电商产品图片批量水印工具，支持8大电商平台预设，100%浏览器本地处理保护隐私。',
    type: 'website',
    url: SITE_URL,
    locale: 'zh_CN',
    siteName: '电商产品图批量水印工具',
  },
  twitter: {
    card: 'summary_large_image',
    title: '电商产品图批量水印工具 - 免费在线 | E-Commerce Image Watermark Tool',
    description:
      '免费专业的电商产品图片批量水印工具，支持8大电商平台预设，100%浏览器本地处理保护隐私。',
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased" suppressHydrationWarning>
        <StructuredData />
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
