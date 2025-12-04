import Link from 'next/link'
import Image from 'next/image'

interface RelatedArticle {
    slug: string
    translations: {
        title: string
        tags: string[] | null
    }
    generated_image_url: string | null
}

interface RelatedArticlesProps {
    articles: RelatedArticle[]
    lang?: string
    dict?: any
}

export default function RelatedArticles({ articles, lang = 'en', dict }: RelatedArticlesProps) {
    if (articles.length === 0) {
        return null
    }

    return (
        <section className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-serif font-bold mb-6">
                {dict?.article?.related || 'Related Articles'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {articles.map((article) => (
                    <Link
                        key={article.slug}
                        href={`/${lang}/${article.slug}`}
                        className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        {article.generated_image_url && (
                            <div className="relative h-48 bg-gray-100">
                                <Image
                                    src={article.generated_image_url}
                                    alt={article.translations.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        )}
                        <div className="p-4">
                            <h3 className="font-serif font-semibold text-lg mb-2 group-hover:text-sage transition-colors">
                                {article.translations.title}
                            </h3>
                            {article.translations.tags && article.translations.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {article.translations.tags.slice(0, 3).map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-xs px-2 py-1 bg-sage/10 text-sage rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}
