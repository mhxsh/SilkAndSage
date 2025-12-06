import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import PublicFootprintClient from '@/components/share/PublicFootprintClient'

export default async function PublicFootprintPage({
    params,
}: {
    params: Promise<{ lang: Locale; username: string }>
}) {
    const { lang, username } = await params
    const dict = await getDictionary(lang)

    return <PublicFootprintClient lang={lang} username={username} dict={dict} />
}

