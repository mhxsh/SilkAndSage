import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserFavorites } from '@/lib/data/interactions'
import Link from 'next/link'
import Image from 'next/image'
import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import ProfileCardClient from '@/components/ProfileCardClient'
import PersonaCard from '@/components/profile/PersonaCard'
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

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    const { data: latestPersona } = await getLatestPersona()

    const translate = (text: string | null) => {
        if (!text) return ''
        return lang === 'zh' ? (EN_TO_ZH[text] || text) : (ZH_TO_EN[text] || text)
    }

    return (
        <div className="min-h-screen bg-cream px-4 py-12">
            <div className="max-w-5xl mx-auto">
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
                                    <h1 className="text-3xl font-serif font-bold text-gray-900">{profile?.username || '用户'}</h1>
                                    <p className="text-gray-600 mt-1">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* AI Persona Section */}
                        <div className="mb-8 mt-8">
                            <PersonaCard persona={latestPersona} lang={lang} userProfile={profile} />
                        </div>
                    </div>
                </ProfileCardClient>
            </div>
        </div>
    )
}
