import Image from 'next/image'
import VettingReport from './VettingReport'

export default function ShopifyProductCard({ 
  product, 
  lang = 'zh',
  aiProfile
}: { 
  product: any, // 支持多数据源
  lang?: string,
  aiProfile?: any
}) {
  // 数据清洗：统一接口
  const isSupabase = !!product.is_supabase;
  const imageUrl = isSupabase ? product.image_url : (product.images?.edges?.[0]?.node.url || '/placeholder-product.jpg');
  const title = product.title;
  
  // 价格格式化
  let priceStr = "";
  if (isSupabase) {
    priceStr = new Intl.NumberFormat(lang === 'zh' ? 'zh-CN' : 'en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(product.price);
  } else {
    priceStr = new Intl.NumberFormat(lang === 'zh' ? 'zh-CN' : 'en-US', {
      style: 'currency',
      currency: product.priceRange?.minVariantPrice?.currencyCode || 'USD',
    }).format(parseFloat(product.priceRange?.minVariantPrice?.amount || '0'));
  }

  // 获取购买链接
  const buyLink = product.buy_link || `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/products/${product.handle}`;

  // 审计元数据 (优先从 Supabase 读)
  const productMetafields = product.parsedMetafields || {};

  return (
    <div className="group relative bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      {/* 图片区 */}
      <div className="aspect-square overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={title}
          width={400}
          height={400}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        {/* 审美标签 */}
        {product.aesthetic_score > 0 && (
          <div className="absolute top-2 left-2 bg-gold/90 text-white text-[10px] px-2 py-0.5 rounded-full">
            Score: {product.aesthetic_score}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[40px]">
          {title}
        </h3>
        
        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-serif font-semibold text-sage">{priceStr}</p>
          <a
            href={buyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-sage text-white px-3 py-1.5 rounded-full hover:bg-sage/90 transition-colors"
          >
            {lang === 'zh' ? '立即购买' : 'Shop Now'}
          </a>
        </div>

        {/* 信任构建：睿选审计报告 (如果是 Supabase 商品，可以传入 vetting_report) */}
        <VettingReport 
          tcmType={aiProfile?.tcm_type}
          productTags={productMetafields.ss_tcm_tags}
          vettingReport={product.vetting_report || productMetafields.ss_vetting_report}
          curatorNote={product.curator_note || productMetafields.ss_curator_note}
          lang={lang}
        />
      </div>
    </div>
  )
}
