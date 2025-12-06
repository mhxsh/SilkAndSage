import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import TopicDetailClient from '@/components/topics/TopicDetailClient'

export default async function TopicDetailPage({
    params,
}: {
    params: Promise<{ lang: Locale; slug: string }>
}) {
    const { lang, slug } = await params
    const dict = await getDictionary(lang)

    return <TopicDetailClient lang={lang} slug={slug} dict={dict} />
}

