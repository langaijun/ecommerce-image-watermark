# E-Commerce Image Batch Watermark Tool / 电商产品图批量水印工具

Free, privacy-first batch image watermarking tool for e-commerce sellers.

免费在线电商产品图批量水印工具，支持 Amazon、淘宝、Shopify、拼多多、京东等主流电商平台预设。

## Features / 功能特点

- **Batch Processing**: Upload multiple images and add watermarks in one click
- **3 Watermark Types**: Text, Image/Logo, Tiled (fullscreen repeating)
- **E-commerce Presets**: Amazon, Shopify, Taobao, Pinduoduo, eBay, Etsy, JD, Google Shopping
- **100% Private**: All processing happens in the browser - no uploads
- **Batch Export**: Multiple sizes + ZIP download
- **Templates**: Save and reuse watermark settings
- **i18n**: Chinese / English with one-click switch
- **Dark/Light Mode**: Theme switching

## Tech Stack

- Next.js 14 (App Router)
- Fabric.js v6 (Canvas watermark engine)
- Tailwind CSS + shadcn/ui
- Zustand (state management)
- next-intl (internationalization)
- fflate (ZIP generation)
- react-dropzone (file upload)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

```bash
npm run build
npx vercel --prod
```

## Project Structure

```
src/
├── app/[locale]/        # Pages with i18n routing
├── components/          # UI components
│   ├── upload/          # Image upload & gallery
│   ├── editor/          # Fabric.js canvas preview
│   ├── controls/        # Watermark settings panels
│   ├── export/          # Export & platform presets
│   └── common/          # Shared components
├── lib/
│   ├── canvas/          # Watermark engine core
│   ├── processing/      # Batch processing pipeline
│   ├── platforms/       # E-commerce platform presets
│   ├── stores/          # Zustand state management
│   ├── i18n/            # next-intl configuration
│   └── types/           # TypeScript types
└── middleware.ts        # i18n locale routing
```

## License

MIT
