import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import FootprintSettingsClient from '@/components/share/FootprintSettingsClient'

export default async function FootprintSettingsPage({
    params,
}: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)

    return <FootprintSettingsClient lang={lang} dict={dict} />
}

