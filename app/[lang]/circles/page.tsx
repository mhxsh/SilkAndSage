import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import CirclesPageClient from '@/components/circles/CirclesPageClient'

export default async function CirclesPage({
    params,
}: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)

    return <CirclesPageClient lang={lang} dict={dict} />
}

