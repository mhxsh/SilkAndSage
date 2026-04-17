import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import TopicsPageClient from '@/components/topics/TopicsPageClient'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function TopicsPage({
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
        redirect(`/${lang}/auth/login?next=/${lang}/topics`)
    }

    return <TopicsPageClient lang={lang} dict={dict} />
}

