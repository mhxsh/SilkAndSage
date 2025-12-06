import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import CalendarTool from '@/components/tools/CalendarTool'

export default async function CalendarPage({
    params,
}: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)

    return <CalendarTool dict={dict} lang={lang} />
}
