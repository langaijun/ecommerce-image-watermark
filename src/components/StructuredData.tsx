export function StructuredData() {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "电商产品图批量水印工具",
    "alternateName": "E-Commerce Image Batch Watermark Tool",
    "url": "https://ecommerce-image-watermark.vercel.app",
    "description": "免费在线电商产品图批量水印工具，支持文字/图片/平铺水印，Amazon/淘宝/Shopify等多平台预设，浏览器本地处理保护隐私",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "browserRequirements": "Requires JavaScript",
    "featureList": [
      "批量图片水印处理",
      "文字/图片/平铺三种水印类型",
      "8大电商平台预设(Amazon/淘宝/Shopify/拼多多/eBay/Etsy/京东/Google Shopping)",
      "多尺寸批量导出",
      "ZIP打包下载",
      "100%浏览器本地处理",
      "水印模板保存"
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "这个水印工具是免费的吗？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "是的，完全免费。所有功能无需注册即可使用，没有水印数量限制。"
        }
      },
      {
        "@type": "Question",
        "name": "我的图片会上传到服务器吗？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "不会。所有图片处理都在您的浏览器本地完成，图片不会上传到任何服务器，完全保护您的隐私。"
        }
      },
      {
        "@type": "Question",
        "name": "支持哪些电商平台？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "支持 Amazon、淘宝/天猫、Shopify、拼多多、eBay、Etsy、京东、Google Shopping 等8大主流电商平台的图片尺寸预设。"
        }
      },
      {
        "@type": "Question",
        "name": "支持哪些图片格式？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "支持 JPG/JPEG、PNG、WebP、AVIF 格式的图片输入，可导出为 JPEG、PNG 或 WebP 格式。"
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
