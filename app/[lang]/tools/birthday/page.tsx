import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import BirthdayTool from '@/components/tools/BirthdayTool'

export default async function BirthdayPage({
    params,
}: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)

    return <BirthdayTool dict={dict} lang={lang} />
}
