import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import TopicsPageClient from '@/components/topics/TopicsPageClient'

export default async function TopicsPage({
    params,
}: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)

    return <TopicsPageClient lang={lang} dict={dict} />
}

