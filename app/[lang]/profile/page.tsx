import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserFavorites } from '@/lib/data/interactions'
import Link from 'next/link'
import Image from 'next/image'
import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'

export default async function ProfilePage({
    params,
}: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // 获取用户 profile
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

    // 获取收藏的文章
    const favorites = await getUserFavorites(user.id, lang)

    // 登出 action
    async function signOut() {
        'use server'
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect('/auth/login')
    }

    const elementColors: Record<string, string> = {
        wood: '#8A9A5B',
        fire: '#D4524F',
        earth: '#8B7355',
        metal: '#C0C0C0',
        water: '#4A5F7F',
    }

    return (
        <div className="min-h-screen bg-cream px-4 py-12">
            <div className="max-w-5xl mx-auto">
                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-sage/10 flex items-center justify-center">
                                <span className="text-3xl font-serif font-bold text-sage">
                                    {profile?.username?.[0]?.toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-serif font-bold text-gray-900">
                                    {profile?.username || '用户'}
                                </h1>
                                <p className="text-gray-600 mt-1">{user.email}</p>
                            </div>
                        </div>
                        <form action={signOut}>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            >
                                {dict.common.logout}
                            </button>
                        </form>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                        {/* Element Card */}
                        {profile?.inner_element ? (
                            <div
                                className="p-4 rounded-lg border-2"
                                style={{
                                    backgroundColor: `${elementColors[profile.inner_element]}10`,
                                    borderColor: elementColors[profile.inner_element],
                                }}
                            >
                                <div className="text-sm text-gray-600 mb-1">{dict.profile.inner_element}</div>
                                <div
                                    className="text-2xl font-serif font-bold"
                                    style={{ color: elementColors[profile.inner_element] }}
                                >
                                    {/* @ts-ignore */}
                                    {dict.elements[profile.inner_element] || profile.inner_element}
                                </div>
                                <Link
                                    href={`/${lang}/quiz/result?element=${profile.inner_element}`}
                                    className="text-sm hover:underline mt-2 inline-block"
                                    style={{ color: elementColors[profile.inner_element] }}
                                >
                                    {dict.common.view_details} →
                                </Link>
                            </div>
                        ) : (
                            <Link
                                href={`/${lang}/quiz`}
                                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-sage hover:bg-sage/5 transition-all"
                            >
                                <div className="text-sm text-gray-600 mb-1">{dict.profile.inner_element}</div>
                                <div className="text-lg font-semibold text-gray-900">{dict.profile.not_tested}</div>
                                <div className="text-sm text-sage mt-2">{dict.profile.start_test} →</div>
                            </Link>
                        )}

                        {/* Favorites Count */}
                        <div className="p-4 bg-gold/10 rounded-lg border-2 border-gold/30">
                            <div className="text-sm text-gray-600 mb-1">{dict.profile.favorites}</div>
                            <div className="text-2xl font-bold text-gold">{favorites.length}</div>
                            <Link href="#favorites" className="text-sm text-gold hover:underline mt-2 inline-block">
                                {dict.profile.my_favorites} ↓
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="p-4 bg-sage/10 rounded-lg border-2 border-sage/30">
                            <div className="text-sm text-gray-600 mb-1">{dict.profile.account_status}</div>
                            <div className="text-lg font-semibold text-sage">{dict.profile.active}</div>
                            <div className="text-xs text-gray-500 mt-2">
                                {dict.profile.registered_at.replace('{date}', new Date(user.created_at).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US'))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Favorites Section */}
                {favorites.length > 0 && (
                    <div id="favorites" className="bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-2xl font-serif font-bold mb-6">{dict.profile.my_favorites}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favorites.map((fav: any) => {
                                const page = fav.page
                                if (!page) return null

                                return (
                                    <Link
                                        key={page.slug}
                                        href={`/${lang}/${page.slug}`}
                                        className="group block bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        {page.generated_image_url ? (
                                            <div className="relative h-40 bg-gray-100">
                                                <Image
                                                    src={page.generated_image_url}
                                                    alt={page.translations?.[0]?.title || ''}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-40 bg-sage/10 flex items-center justify-center">
                                                <span className="text-4xl">🌿</span>
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <h3 className="font-serif font-semibold group-hover:text-sage transition-colors line-clamp-2">
                                                {page.translations?.[0]?.title || 'Untitled'}
                                            </h3>
                                            {page.translations?.[0]?.tags && page.translations[0].tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {page.translations[0].tags.slice(0, 2).map((tag: string) => (
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
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
