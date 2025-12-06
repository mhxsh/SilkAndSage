import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import UGCDetailClient from '@/components/ugc/UGCDetailClient'

export default async function UGCDetailPage({
    params,
}: {
    params: Promise<{ lang: Locale; id: string }>
}) {
    const { lang, id } = await params
    const dict = await getDictionary(lang)

    return <UGCDetailClient lang={lang} postId={id} dict={dict} />
}

