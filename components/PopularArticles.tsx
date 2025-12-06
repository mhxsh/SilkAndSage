'use client'

import Link from 'next/link'
import Image from 'next/image'
import { PageListItem } from '@/lib/data/pages'

interface PopularArticlesProps {
    articles: PageListItem[]
    lang: string
    dict: any
}

export default function PopularArticles({ articles, lang, dict }: PopularArticlesProps) {
    if (!articles || articles.length === 0) return null

    // 分离主打文章和次要文章
    const heroArticle = articles[0]
    const sideArticles = articles.slice(1, 4) // 取接下来的3篇

    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-stone-50 relative overflow-hidden">
            {/* 背景装饰：微妙的圆形光晕 */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-sage/5 blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-orange-50/50 blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* 标题区：左对齐，更具杂志感 */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6">
                    <div>
                        <span className="text-sage font-medium tracking-widest text-sm uppercase mb-2 block">
                            {dict.home.popular_desc}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900">
                            {dict.home.popular_articles}
                        </h2>
                    </div>
                    <Link
                        href={`/${lang}/explore`}
                        className="text-stone-500 hover:text-sage transition-colors flex items-center gap-2 group"
                    >
                        <span>View All Stories</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* 左侧：Hero Article (占据 7 列) */}
                    <div className="lg:col-span-7">
                        <Link
                            href={`/${lang}/${heroArticle.slug}`}
                            className="group block relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-lg"
                        >
                            {heroArticle.generated_image_url ? (
                                <Image
                                    src={heroArticle.generated_image_url}
                                    alt={heroArticle.translations.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full bg-sage/10 flex items-center justify-center">
                                    <span className="text-6xl">🌿</span>
                                </div>
                            )}

                            {/* 渐变遮罩 */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

                            {/* 内容覆盖 */}
                            <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full">
                                <div className="flex flex-wrap gap-3 mb-4">
                                    {heroArticle.translations.tags?.slice(0, 3).map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-xs font-medium px-3 py-1 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4 leading-tight group-hover:underline decoration-1 underline-offset-4">
                                    {heroArticle.translations.title}
                                </h3>
                                <div className="flex items-center text-white/80 text-sm gap-4">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        {heroArticle.views_count}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="text-yellow-400">★</span>
                                        {heroArticle.average_score.toFixed(1)}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* 右侧：Side Articles List (占据 5 列) */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        {sideArticles.map((article, index) => (
                            <Link
                                key={article.slug}
                                href={`/${lang}/${article.slug}`}
                                className="group flex gap-4 items-start p-4 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-stone-100"
                            >
                                <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-stone-200">
                                    {article.generated_image_url ? (
                                        <Image
                                            src={article.generated_image_url}
                                            alt={article.translations.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl">✨</div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 py-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-bold text-stone-400">0{index + 2}</span>
                                        <span className="w-8 h-[1px] bg-stone-300"></span>
                                        {article.translations.tags?.[0] && (
                                            <span className="text-xs font-medium text-sage uppercase tracking-wider">
                                                {article.translations.tags[0]}
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="text-lg font-serif font-bold text-stone-900 mb-2 line-clamp-2 group-hover:text-sage transition-colors">
                                        {article.translations.title}
                                    </h4>
                                    <div className="flex items-center text-xs text-stone-500 gap-3">
                                        <span>{article.views_count} views</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <span className="text-yellow-500">★</span>
                                            {article.average_score.toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {/* 探索更多按钮 (移动端隐藏，桌面端显示在列表底部) */}
                        <div className="mt-auto pt-4 hidden lg:block">
                            <Link
                                href={`/${lang}/explore`}
                                className="inline-flex items-center justify-center w-full py-3 border border-stone-300 text-stone-600 font-medium rounded-lg hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-300"
                            >
                                {dict.common?.explore || 'Explore More'}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
