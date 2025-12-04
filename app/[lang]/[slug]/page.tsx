import { notFound } from 'next/navigation'
import { getPageBySlug, getAllPublishedSlugs, getRelatedPages } from '@/lib/data/pages'
import { getComments, checkUserLike, getLikesCount, checkUserFavorite, getUserRating } from '@/lib/data/interactions'
import { createClient } from '@/lib/supabase/server'
import ArticleContent from '@/components/ArticleContent'
import RelatedArticles from '@/components/RelatedArticles'
import LikeButton from '@/components/LikeButton'
import FavoriteButton from '@/components/FavoriteButton'
import RatingStars from '@/components/RatingStars'
import ShareButton from '@/components/ShareButton'
import CommentForm from '@/components/CommentForm'
import CommentsList from '@/components/CommentsList'
import Image from 'next/image'
import { Locale } from '@/i18n-config'

interface PageProps {
    params: Promise<{
        lang: Locale
        slug: string
    }>
}

// 生成静态参数（SSG）
export async function generateStaticParams() {
    const slugs = await getAllPublishedSlugs()

    return slugs.map((slug) => ({
        slug,
    }))
}

// 生成元数据
export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params
    const page = await getPageBySlug(slug)

    if (!page) {
        return {
            title: 'Page Not Found | Silk & Sage',
        }
    }

    return {
        title: `${page.translations.title} | Silk & Sage`,
        description: `${page.translations.title} - Silk & Sage`,
    }
}

export default async function ArticlePage({ params }: PageProps) {
    const { slug, lang } = await params
    const page = await getPageBySlug(slug)

    if (!page) {
        notFound()
    }

    // 获取当前用户
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // 获取相关文章
    const relatedPages = await getRelatedPages(slug, page.tags)

    // 获取评论
    const comments = await getComments(page.id)

    // 获取互动状态
    const likesCount = await getLikesCount(page.id)
    const userLiked = user ? await checkUserLike(user.id, page.id) : false
    const userFavorited = user ? await checkUserFavorite(user.id, page.id) : false
    const userRating = user ? await getUserRating(user.id, page.id) : null

    return (
        <div className="min-h-screen bg-cream">
            {/* Article Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-4 flex flex-wrap gap-2">
                        {page.tags && page.tags.slice(0, 5).map((tag) => (
                            <span
                                key={tag}
                                className="text-sm px-3 py-1 bg-sage/10 text-sage rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">
                        {page.translations.title}
                    </h1>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {page.views_count.toLocaleString()} {dict?.article?.views || 'Views'}
                        </span>
                        {comments.length > 0 && (
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                {comments.length} {dict?.article?.comments || 'Comments'}
                            </span>
                        )}
                        {page.average_score > 0 && (
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-gold fill-current" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                {page.average_score.toFixed(1)}
                            </span>
                        )}
                    </div>
                </div>
            </header>

            {/* Featured Image */}
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

            {/* Article Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12">
                    <ArticleContent content={page.translations.generated_text} />

                    {/* Interaction Bar */}
                    <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
                        <div className="flex items-center gap-4">
                            <LikeButton
                                targetId={page.id}
                                targetType="page"
                                initialLiked={userLiked}
                                initialCount={likesCount}
                                pageSlug={slug}
                            />
                            <FavoriteButton
                                pageId={page.id}
                                pageSlug={slug}
                                initialFavorited={userFavorited}
                            />
                            <ShareButton url={`/${lang}/${slug}`} title={page.translations.title} />
                        </div>
                        {user && (
                            <RatingStars
                                pageId={page.id}
                                pageSlug={slug}
                                initialRating={page.average_score}
                                userRating={userRating}
                            />
                        )}
                    </div>
                </div>

                {/* Comments Section */}
                <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 mt-8">
                    <h2 className="text-2xl font-serif font-bold mb-6">{dict?.article?.comments_section || 'Comments'}</h2>

                    {user ? (
                        <div className="mb-8">
                            <CommentForm pageId={page.id} pageSlug={slug} />
                        </div>
                    ) : (
                        <div className="mb-8 p-4 bg-sage/5 rounded-lg text-center">
                            <p className="text-gray-600">
                                <a href={`/${lang}/auth/login`} className="text-sage hover:text-sage/80 font-medium">
                                    {dict?.common?.login || 'Login'}
                                </a>
                                {' '}{dict?.article?.login_to_comment || 'to comment'}
                            </p>
                        </div>
                    )}

                    <CommentsList
                        comments={comments}
                        pageId={page.id}
                        pageSlug={slug}
                        currentUserId={user?.id}
                    />
                </div>

                {/* Related Articles */}
                <RelatedArticles articles={relatedPages} lang={lang} />
            </main>
        </div>
    )
}
