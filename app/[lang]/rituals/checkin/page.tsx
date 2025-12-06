import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import CheckinPageClient from '@/components/rituals/CheckinPageClient'

export default async function CheckinPage({
    params,
}: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)

    return <CheckinPageClient lang={lang} dict={dict} />
}

