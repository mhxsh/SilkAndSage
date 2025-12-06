import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import SharePageClient from '@/components/share/SharePageClient'

export default async function SharePage({
    params,
}: {
    params: Promise<{ lang: Locale; code: string }>
}) {
    const { lang, code } = await params
    const dict = await getDictionary(lang)

    return <SharePageClient lang={lang} shareCode={code} dict={dict} />
}

