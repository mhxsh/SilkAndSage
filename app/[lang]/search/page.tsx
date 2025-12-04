import { searchPages, getAllTags } from '@/lib/data/search'
import Link from 'next/link'
import Image from 'next/image'
import SearchBar from '@/components/SearchBar'
import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import { translateTag } from '@/lib/data/tags'

export default async function SearchPage({
    params,
    searchParams,
}: {
    params: Promise<{ lang: Locale }>
    searchParams: Promise<{ q?: string }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)
    const { q } = await searchParams
    const query = q || ''

    const results = query ? await searchPages(query, lang) : []
    const allTags = await getAllTags(lang)
    const popularTags = allTags.slice(0, 20) // 显示前20个最热标签

    return (
        <div className="min-h-screen bg-cream py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Search Bar */}
                <div className="mb-12 flex justify-center">
                    <SearchBar placeholder={dict.common.search} />
                </div>

                {query ? (
                    <>
                        {/* Search Results */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-serif font-semibold mb-4">
                                {dict.search_page.search_results.replace('{query}', query)}
                                {results.length > 0 && (
                                    <span className="text-gray-500 text-lg ml-2">
                                        {dict.search_page.results_count.replace('{count}', results.length.toString())}
                                    </span>
                                )}
                            </h2>
                        </div>

                        {results.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {results.map((page) => (
                                    <Link
                                        key={page.slug}
                                        href={`/${lang}/${page.slug}`}
                                        className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
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
                                            <h3 className="font-serif font-semibold text-xl mb-2 group-hover:text-sage transition-colors">
                                                {page.translations.title}
                                            </h3>

                                            {page.tags && page.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {page.tags.slice(0, 3).map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="text-xs px-2 py-1 bg-sage/10 text-sage rounded-full"
                                                        >
                                                            {translateTag(tag, lang)}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="text-sm text-gray-500">
                                                {page.views_count} {dict.search_page.views}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-gray-500 text-lg mb-4">{dict.search_page.no_articles}</p>
                                <p className="text-gray-400">{dict.search_page.try_other_keywords}</p>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {/* Popular Tags */}
                        <div>
                            <h2 className="text-2xl font-serif font-semibold mb-6">{dict.search_page.popular_tags}</h2>
                            <div className="flex flex-wrap gap-3">
                                {popularTags.map(({ tag, count }) => (
                                    <Link
                                        key={tag}
                                        href={`/${lang}/search?q=${encodeURIComponent(tag)}`}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-sage/10 border border-gray-200 hover:border-sage rounded-full transition-all"
                                    >
                                        <span>{translateTag(tag, lang)}</span>
                                        <span className="text-xs text-gray-500">({count})</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
