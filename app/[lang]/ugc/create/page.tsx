import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import UGCCreateClient from '@/components/ugc/UGCCreateClient'

export default async function UGCCreatePage({
    params,
    searchParams,
}: {
    params: Promise<{ lang: Locale }>
    searchParams: Promise<{ circle?: string; topic?: string }>
}) {
    const { lang } = await params
    const { circle, topic } = await searchParams
    const dict = await getDictionary(lang)

    return <UGCCreateClient lang={lang} initialCircle={circle} initialTopic={topic} dict={dict} />
}

