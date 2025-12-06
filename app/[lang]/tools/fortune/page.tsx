import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import FortuneTool from '@/components/tools/FortuneTool'

export default async function FortunePage({
    params,
}: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)

    return <FortuneTool dict={dict} lang={lang} />
}
