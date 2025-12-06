import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import { createClient } from '@/lib/supabase/server'
import FeedbackForm from '@/components/FeedbackForm'

export default async function FeedbackPage({
    params,
}: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    return <FeedbackForm dict={dict} lang={lang} user={user} />
}
