import Link from 'next/link'
import Image from 'next/image'
import { getPublishedPages } from '@/lib/data/pages'
import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import { translateTag } from '@/lib/data/tags'

export default async function ExplorePage({
    params,
}: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)
    const { pages, total } = await getPublishedPages(lang, 1, 12)

    return (
        <div className="min-h-screen bg-cream py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                        {dict.explore_page.title}
                    </h1>
                    <p className="text-lg text-gray-600">
                        {dict.explore_page.subtitle}
                    </p>
                </div>

                {pages.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg">{dict.explore_page.no_articles}</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {pages.map((page) => (
                                <Link
                                    key={page.slug}
                                    href={`/${lang}/${page.slug}`}
                                    className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
                                >
                                    {page.generated_image_url ? (
                                        <div className="relative h-56 bg-gray-100">
                                            <Image
                                                src={page.generated_image_url}
                                                alt={page.translations.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-56 bg-sage/10 flex items-center justify-center">
                                            <span className="text-6xl">🌿</span>
                                        </div>
                                    )}

                                    <div className="p-6">
                                        <h2 className="font-serif font-semibold text-xl mb-3 group-hover:text-sage transition-colors">
                                            {page.translations.title}
                                        </h2>

                                        {page.translations.tags && page.translations.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {page.translations.tags.slice(0, 3).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="text-xs px-2 py-1 bg-sage/10 text-sage rounded-full"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                {page.views_count}
                                            </span>
                                            {page.average_score > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4 text-gold fill-current" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    {page.average_score.toFixed(1)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination - placeholder for future */}
                        <div className="mt-12 text-center text-gray-500">
                            {dict.explore_page.showing_count.replace('{count}', pages.length.toString()).replace('{total}', total.toString())}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
