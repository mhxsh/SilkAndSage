import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import FootprintList from '@/components/footprint/FootprintList'
import { getFootprints } from '@/lib/actions/footprint'
import Link from 'next/link'

export default async function FootprintsPage({
    params,
    searchParams,
}: {
    params: Promise<{ lang: Locale }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
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

    // Pagination logic (simple)
    const limit = 50
    const { data: footprints } = await getFootprints(limit)

    return (
        <div className="min-h-screen bg-cream px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href={`/${lang}/profile`} className="text-gray-500 hover:text-sage transition-colors">
                        ← {lang === 'zh' ? '返回个人中心' : 'Back to Profile'}
                    </Link>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">
                        {lang === 'zh' ? '我的足迹' : 'My Footprints'}
                    </h1>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <p className="text-gray-500 mb-6">
                        {lang === 'zh'
                            ? '这里记录了您在 Silk & Sage 的所有探索与发现。'
                            : 'A record of all your explorations and discoveries in Silk & Sage.'}
                    </p>
                    <FootprintList footprints={footprints || []} lang={lang} />
                </div>
            </div>
        </div>
    )
}
