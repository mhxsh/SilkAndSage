import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import MoodTest from '@/components/tools/MoodTest'

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params
    const dict = await getDictionary(lang)
    return {
        title: `${lang === 'zh' ? 'AI 每日心情疗愈' : 'AI Daily Mood Healing'} | Silk & Sage`,
        description: lang === 'zh' ? '基于AI与五行能量的个性化心情测试' : 'Personalized mood test based on AI and Five Elements energy.',
    }
}

export default async function MoodPage({
    params,
}: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 via-sage/5 to-stone-100 py-12">
            <MoodTest lang={lang} />
        </div>
    )
}
