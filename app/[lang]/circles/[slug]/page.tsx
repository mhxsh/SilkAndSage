import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import CircleDetailClient from '@/components/circles/CircleDetailClient'

export default async function CircleDetailPage({
    params,
}: {
    params: Promise<{ lang: Locale; slug: string }>
}) {
    const { lang, slug } = await params
    const dict = await getDictionary(lang)

    return <CircleDetailClient lang={lang} slug={slug} dict={dict} />
}

