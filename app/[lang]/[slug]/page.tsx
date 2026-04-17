import { notFound } from 'next/navigation'
import { getPageBySlug, getAllPublishedSlugs, getRelatedPages } from '@/lib/data/pages'
import { getMatchingTools } from '@/lib/data/tools'
import ArticleContent from '@/components/ArticleContent'
import RelatedArticles from '@/components/RelatedArticles'
import ShopifyProductSection from '@/components/ShopifyProductSection'
import RelatedTools from '@/components/RelatedTools'
import Image from 'next/image'
import { Locale } from '@/i18n-config'
import { getDictionary } from '@/get-dictionary'
import ViewCounter from '@/components/ViewCounter'

interface PageProps {
    params: Promise<{
        lang: Locale
        slug: string
    }>
}

export async function generateStaticParams() {
    const slugs = await getAllPublishedSlugs()
    return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps) {
    const { slug, lang } = await params
    const page = await getPageBySlug(slug, lang)
    if (!page) return { title: 'Page Not Found | Silk & Sage' }
    return {
        title: `${page.translations.title} | Silk & Sage`,
        description: `${page.translations.title} - Silk & Sage`,
    }
}

export default async function ArticlePage({ params }: PageProps) {
    const { slug, lang } = await params
    const page = await getPageBySlug(slug, lang)
    const dict = await getDictionary(lang)

    if (!page) {
        notFound()
    }

    const relatedPages = await getRelatedPages(slug, page.translations.tags, lang)
    const matchingTools = await getMatchingTools(page.translations.tags)

    return (
        <div className="min-h-screen bg-cream">
            <ViewCounter slug={slug} />
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">
                        {page.translations.title}
                    </h1>
                </div>
            </header>

            {page.generated_image_url && (
                <div className="relative h-96 bg-gray-100">
                    <Image
                        src={page.generated_image_url}
                        alt={page.translations.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12">
                    <ArticleContent content={page.translations.generated_text} dict={dict} />
                    
                    {/* Shopify 导购闭环 */}
                    <ShopifyProductSection tags={page.translations.tags} lang={lang} />
                    
                    {/* 关联工具 */}
                    <RelatedTools tools={matchingTools} lang={lang} />
                </div>

                <RelatedArticles articles={relatedPages} lang={lang} dict={dict} />
            </main>
        </div>
    )
}
