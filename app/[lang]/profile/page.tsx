import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserFavorites } from '@/lib/data/interactions'
import Link from 'next/link'
import Image from 'next/image'
import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import ProfileCardClient from '@/components/ProfileCardClient'
// import FootprintSection from '@/components/footprint/FootprintSection' // Removed
import PersonaCard from '@/components/profile/PersonaCard' // New
import { getLatestPersona } from '@/lib/actions/footprint'

// Translation maps
const EN_TO_ZH: Record<string, string> = {
    'Aries': '白羊座', 'Taurus': '金牛座', 'Gemini': '双子座', 'Cancer': '巨蟹座',
    'Leo': '狮子座', 'Virgo': '处女座', 'Libra': '天秤座', 'Scorpio': '天蝎座',
    'Sagittarius': '射手座', 'Capricorn': '摩羯座', 'Aquarius': '水瓶座', 'Pisces': '双鱼座',
    'Rat': '鼠', 'Ox': '牛', 'Tiger': '虎', 'Rabbit': '兔', 'Dragon': '龙', 'Snake': '蛇',
    'Horse': '马', 'Goat': '羊', 'Monkey': '猴', 'Rooster': '鸡', 'Dog': '狗', 'Pig': '猪'
}

const ZH_TO_EN: Record<string, string> = {
    '白羊座': 'Aries', '金牛座': 'Taurus', '双子座': 'Gemini', '巨蟹座': 'Cancer',
    '狮子座': 'Leo', '处女座': 'Virgo', '天秤座': 'Libra', '天蝎座': 'Scorpio',
    '射手座': 'Sagittarius', '摩羯座': 'Capricorn', '水瓶座': 'Aquarius', '双鱼座': 'Pisces',
    '鼠': 'Rat', '牛': 'Ox', '虎': 'Tiger', '兔': 'Rabbit', '龙': 'Dragon', '蛇': 'Snake',
    '马': 'Horse', '羊': 'Goat', '猴': 'Monkey', '鸡': 'Rooster', '狗': 'Dog', '猪': 'Pig'
}

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

    // 获取生日解读信息
    const { data: birthProfile } = await supabase
        .from('user_birth_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

    // 获取运势历史（最近5条）
    const { data: fortuneHistory } = await supabase
        .from('user_fortune_history')
        .select('*')
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(5)

    // 获取画像
    // const { data: footprints } = await getFootprints(20) // Moved to separate page
    const { data: latestPersona } = await getLatestPersona()

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

    const translate = (text: string | null) => {
        if (!text) return ''
        if (lang === 'zh') {
            return EN_TO_ZH[text] || text
        } else {
            return ZH_TO_EN[text] || text
        }
    }

    return (
        <div className="min-h-screen bg-cream px-4 py-12">
            <div className="max-w-5xl mx-auto">
                {/* Profile Card */}
                <ProfileCardClient profile={{ ...profile, email: user.email }} lang={lang}>
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
                                    {profile?.zodiac_sign && (
                                        <p className="text-sm text-sage mt-1">
                                            ✨ {translate(profile.zodiac_sign)}
                                            {profile.chinese_zodiac && ` • ${translate(profile.chinese_zodiac)}`}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
                            {/* Footprint Link (New) */}
                            <Link
                                href={`/${lang}/profile/footprints`}
                                className="p-4 bg-stone-50 rounded-lg border-2 border-stone-200 hover:border-sage hover:shadow-md transition-all group"
                            >
                                <div className="text-sm text-gray-600 mb-1">{lang === 'zh' ? '我的足迹' : 'My Footprints'}</div>
                                <div className="text-2xl font-bold text-stone-700 group-hover:text-sage">👣</div>
                                <div className="text-xs text-gray-500 mt-2">
                                    {lang === 'zh' ? '查看记录 →' : 'View History →'}
                                </div>
                            </Link>

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
                                        {lang === 'zh' && dict.elements[profile.inner_element]
                                            ? dict.elements[profile.inner_element]
                                            : (profile.inner_element.charAt(0).toUpperCase() + profile.inner_element.slice(1))}
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
                </ProfileCardClient>

                {/* Zodiac Info / Birthday Prompt */}
                {!profile?.birth_date ? (
                    <div className="bg-gradient-to-r from-sage/10 to-sage/5 border border-sage/20 rounded-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                ✨ {lang === 'zh' ? '完善星座信息' : 'Complete Zodiac Info'}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">
                                {lang === 'zh'
                                    ? '设置生日后，我们将为您提供专属的星座运势和性格解读。'
                                    : 'Set your birthday to get exclusive zodiac fortunes and personality analysis.'}
                            </p>
                        </div>
                        {/* ProfileCardClient's edit button handles this, but we can have a direct prompt if we expose the modal differently,
                            but for now let's guide them to edit. ProfileCardClient already has an edit button. 
                            We can perhaps just show a static guide/visual. */}
                        <div className="text-sm text-sage font-medium bg-white px-4 py-2 rounded-full shadow-sm">
                            {lang === 'zh' ? '↗ 请点击右上方编辑资料' : '↗ Click Edit Profile above'}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-serif font-bold text-indigo-900 flex items-center gap-2">
                                ✨ {lang === 'zh' ? '我的星座解读' : 'My Zodiac Analysis'}
                            </h2>
                        </div>
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="flex-shrink-0 text-center">
                                <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center text-4xl mb-2 mx-auto">
                                    {/* Map zodiac to icon if possible, usage fallback */}
                                    🌟
                                </div>
                                <div className="font-bold text-xl text-indigo-900">
                                    {translate(profile.zodiac_sign)}
                                </div>
                                <div className="text-sm text-indigo-600">
                                    {translate(profile.chinese_zodiac)}
                                </div>
                            </div>
                            <div className="flex-grow space-y-4">
                                <div className="p-4 bg-indigo-50/50 rounded-lg">
                                    <h4 className="font-bold text-indigo-800 mb-1">{lang === 'zh' ? '基本性格' : 'Basic Traits'}</h4>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {/* Placeholder logic: In a real app we might query a "ZodiacTable" or use AI to generate this initially. 
                                            For now we show a generic friendly message or derived info if available. 
                                            Since user wants "Integrate generation", this connects to the AI Persona below. */}
                                        {lang === 'zh'
                                            ? '您的星座与生肖结合，展现出独特的能量场。下方的 AI 画像将为您进行更深度的灵性整合解读。'
                                            : 'Your zodiac and Chinese zodiac combine to create a unique energy field. See the AI Persona below for a deeper spiritual integration.'}
                                    </p>
                                </div>
                                <div className="flex gap-4 text-sm">
                                    <div className="bg-white px-3 py-1 rounded border border-indigo-100 text-indigo-600">
                                        {lang === 'zh' ? '性别' : 'Gender'}: {profile.gender === 'male' ? '♂' : (profile.gender === 'female' ? '♀' : '-')}
                                    </div>
                                    <div className="bg-white px-3 py-1 rounded border border-indigo-100 text-indigo-600">
                                        {lang === 'zh' ? '生日' : 'Birthday'}: {profile.birth_date}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Birth Profile Section */}
                {birthProfile && (
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
                                🎂 {lang === 'zh' ? '我的生日解读' : 'My Birth Analysis'}
                            </h2>
                            <Link
                                href={`/${lang}/tools/birthday`}
                                className="text-sage hover:text-sage/80 text-sm font-medium"
                            >
                                {lang === 'zh' ? '重新解读 →' : 'Analyze Again →'}
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-stone-50 rounded-lg">
                                <div className="text-sm text-gray-600 mb-2">{lang === 'zh' ? '生肖' : 'Zodiac'}</div>
                                <div className="text-2xl font-semibold text-stone-900">
                                    {birthProfile.chinese_zodiac}
                                </div>
                            </div>
                            <div className="text-center p-4 bg-stone-50 rounded-lg">
                                <div className="text-sm text-gray-600 mb-2">{lang === 'zh' ? '星座' : 'Star Sign'}</div>
                                <div className="text-lg font-semibold text-stone-900">
                                    {birthProfile.zodiac_sign}
                                </div>
                            </div>
                            <div className="text-center p-4 bg-stone-50 rounded-lg">
                                <div className="text-sm text-gray-600 mb-2">{lang === 'zh' ? '主导元素' : 'Element'}</div>
                                <div className="text-lg font-semibold text-stone-900">
                                    {birthProfile.element}
                                </div>
                            </div>
                            <div className="text-center p-4 bg-stone-50 rounded-lg">
                                <div className="text-sm text-gray-600 mb-2">{lang === 'zh' ? '农历生日' : 'Lunar'}</div>
                                <div className="text-sm font-medium text-stone-900">
                                    {birthProfile.lunar_birth_date}
                                </div>
                            </div>
                        </div>

                        {birthProfile.lucky_colors && birthProfile.lucky_colors.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="text-sm text-gray-600 mb-3">{lang === 'zh' ? '幸运颜色' : 'Lucky Colors'}</div>
                                <div className="flex flex-wrap gap-2">
                                    {birthProfile.lucky_colors.map((color: string, index: number) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 rounded-full text-sm font-medium"
                                        >
                                            {color}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Persona Card (New) */}
                <PersonaCard persona={latestPersona} lang={lang} userProfile={profile} />

                {/* Fortune History Section */}
                {fortuneHistory && fortuneHistory.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
                                🔮 {lang === 'zh' ? '运势历史' : 'Fortune History'}
                            </h2>
                            <Link
                                href={`/${lang}/tools/fortune`}
                                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                            >
                                {lang === 'zh' ? '查看今日运势 →' : 'Check Today →'}
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {fortuneHistory.map((item: any) => (
                                <div
                                    key={item.id}
                                    className="border-l-4 border-purple-500 pl-4 py-3 hover:bg-purple-50 transition-colors rounded-r"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-sm text-gray-500">
                                            {new Date(item.viewed_at).toLocaleDateString(
                                                lang === 'zh' ? 'zh-CN' : 'en-US',
                                                { year: 'numeric', month: 'long', day: 'numeric' }
                                            )}
                                        </div>
                                        {item.is_favorite && (
                                            <span className="text-yellow-500">⭐</span>
                                        )}
                                    </div>

                                    {item.fortune_data && (
                                        <div className="text-sm text-gray-700 mb-2">
                                            <span className="font-medium">
                                                {translate(item.fortune_data.zodiac)}
                                            </span>
                                            {' - '}
                                            <span>{lang === 'zh' ? '综合运势' : 'Overall'}: </span>
                                            <span className="text-yellow-500">
                                                {'★'.repeat(item.fortune_data.overall || 0)}
                                                {'☆'.repeat(5 - (item.fortune_data.overall || 0))}
                                            </span>
                                        </div>
                                    )}

                                    {item.user_notes && (
                                        <div className="text-gray-700 mt-2 p-3 bg-gray-50 rounded text-sm">
                                            💭 {item.user_notes}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {fortuneHistory && fortuneHistory.length >= 5 && (
                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-500">
                                    {lang === 'zh'
                                        ? '显示最近 5 条记录'
                                        : 'Showing recent 5 records'
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                )}

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
        </div >
    )
}
