import { getProductsByCollection } from '@/lib/shopify'
import { createClient } from '@/lib/supabase/server'
import ShopifyProductCard from './ShopifyProductCard'

interface ShopifyProductSectionProps {
  pageId?: string // 传入文章ID
  tags: string[]
  lang: string
}

export default async function ShopifyProductSection({ pageId, tags, lang }: ShopifyProductSectionProps) {
  const supabase = await createClient()
  
  // 1. 获取用户画像
  const { data: { user } } = await supabase.auth.getUser()
  let aiProfile = null
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('ai_profile').eq('id', user.id).single()
    aiProfile = profile?.ai_profile as any
  }

  // 2. 数据获取逻辑：优先从 Supabase 获取关联商品
  let featuredProducts = []
  if (pageId) {
    const { data: linkedProducts } = await supabase
      .from('page_featured_products')
      .select('sourcing_products(*)')
      .eq('page_id', pageId)
      .order('display_order', { ascending: true })
    
    if (linkedProducts && linkedProducts.length > 0) {
      // 映射为统一的格式
      featuredProducts = linkedProducts.map((p: any) => ({
        id: p.sourcing_products.id,
        title: p.sourcing_products.title,
        price: p.sourcing_products.price,
        image_url: p.sourcing_products.image_url,
        buy_link: p.sourcing_products.buy_link, // 最终跳转链接
        aesthetic_score: p.sourcing_products.aesthetic_score,
        is_supabase: true // 标记来源
      }))
    }
  }

  // 3. 降级逻辑：如果没有手动关联，则走标签匹配 (Shopify API)
  if (featuredProducts.length === 0) {
    const tagToCollection: Record<string, string> = {
      'wood': 'wood-element', 'fire': 'fire-element', 'earth': 'earth-element',
      'metal': 'metal-element', 'water': 'water-element'
    }
    const matchedTag = tags.find(tag => tagToCollection[tag.toLowerCase()]);
    const collectionHandle = matchedTag ? tagToCollection[matchedTag.toLowerCase()] : 'best-sellers';
    
    const shopifyProducts = await getProductsByCollection(collectionHandle);
    featuredProducts = shopifyProducts.map((p: any) => ({
      ...p,
      image_url: p.images?.[0]?.src,
      buy_link: `https://silkandsage.shop/products/${p.handle}`, // 构造链接
      is_supabase: false
    }))
  }

  if (featuredProducts.length === 0) return null;

  return (
    <section className="mt-12 py-8 border-t border-sage/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif font-bold text-gray-900">
          {lang === 'zh' ? '为您精选' : 'Curated For You'}
        </h2>
        <span className="text-xs font-medium uppercase tracking-widest text-sage bg-sage/5 px-2 py-1 rounded">
          Sage Selection
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProducts.slice(0, 3).map((product: any) => (
          <ShopifyProductCard 
            key={product.id} 
            product={product} 
            lang={lang} 
            aiProfile={aiProfile}
          />
        ))}
      </div>
    </section>
  )
}
