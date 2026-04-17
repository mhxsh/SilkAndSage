import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import { getProductsByCollection } from '@/lib/shopify'
import ShopifyProductCard from '@/components/ShopifyProductCard'
import Link from 'next/link'

export default async function QuizResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>
  searchParams: Promise<{ element: string }>
}) {
  const { lang } = await params
  const { element } = await searchParams
  const dict = await getDictionary(lang)

  // 1. 映射五行到 Shopify 系列 (Collection Handle)
  // 请确保 Shopify 店铺中有对应的 collection，或者修改为已有的 handle
  const elementToCollection: Record<string, string> = {
    wood: 'wood-element',
    fire: 'fire-element',
    earth: 'earth-element',
    metal: 'metal-element',
    water: 'water-element',
  }

  const collectionHandle = elementToCollection[element] || 'all-elements'
  const recommendedProducts = await getProductsByCollection(collectionHandle)

  // 2. 五行性格简述 (从字典获取或在此定义)
  const elementColors: Record<string, string> = {
    wood: 'text-green-800 bg-green-50',
    fire: 'text-red-800 bg-red-50',
    earth: 'text-amber-800 bg-amber-50',
    metal: 'text-zinc-800 bg-zinc-50',
    water: 'text-blue-800 bg-blue-50',
  }

  const elementNames: Record<string, string> = {
    wood: lang === 'zh' ? '木 🌿' : 'Wood 🌿',
    fire: lang === 'zh' ? '火 🔥' : 'Fire 🔥',
    earth: lang === 'zh' ? '土 ⛰️' : 'Earth ⛰️',
    metal: lang === 'zh' ? '金 ✨' : 'Metal ✨',
    water: lang === 'zh' ? '水 🌊' : 'Water 🌊',
  }

  return (
    <div className="min-h-screen bg-cream py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500 mb-2">
            {lang === 'zh' ? '测试结果' : 'Your Result'}
          </h2>
          <div className={`inline-block px-8 py-4 rounded-2xl ${elementColors[element] || 'bg-white'} mb-6`}>
            <h1 className="text-5xl font-serif font-bold">
              {elementNames[element] || element}
            </h1>
          </div>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            {/* 这里可以根据 element 从字典中获取详细的性格解读 */}
            {lang === 'zh' 
              ? `您的内在灵魂与“${elementNames[element]}”元素深度共鸣。这意味着您拥有独特的直觉与审美偏好。` 
              : `Your inner soul resonates deeply with the "${elementNames[element]}" element.`}
          </p>
        </div>

        {/* AI 商品推荐区域 */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-8 border-b border-sage/20 pb-4">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">
                {lang === 'zh' ? '为您精选' : 'Curated For You'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {lang === 'zh' ? '基于您的五行能量，AI 甄选了以下提升运势的美学单品：' : 'Based on your element, AI has curated these items for you:'}
              </p>
            </div>
            <Link 
              href={`/${lang}/explore`}
              className="text-sage hover:underline text-sm font-medium"
            >
              {lang === 'zh' ? '查看更多' : 'View More'}
            </Link>
          </div>

          {recommendedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.slice(0, 4).map((product: any) => (
                <ShopifyProductCard key={product.id} product={product} lang={lang} />
              ))}
            </div>
          ) : (
            <div className="bg-white/50 rounded-xl py-12 text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-500 italic">
                {lang === 'zh' 
                  ? 'Shopify 系列连接中... (请确保已创建相应 Collection)' 
                  : 'Connecting to Shopify...'}
              </p>
            </div>
          )}
        </div>

        <div className="mt-16 text-center">
            <Link
                href={`/${lang}/quiz`}
                className="inline-block px-8 py-3 border-2 border-sage text-sage rounded-full hover:bg-sage hover:text-white transition-all"
            >
                {lang === 'zh' ? '重新测试' : 'Retake Quiz'}
            </Link>
        </div>
      </div>
    </div>
  )
}
