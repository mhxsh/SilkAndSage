import { getQuizQuestions } from '@/lib/data/quiz'
import QuizForm from '@/components/QuizForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params
    const dict = await getDictionary(lang)
    return {
        title: `${dict.quiz.title} | Silk & Sage`,
        description: dict.quiz.desc.replace('{count}', '5'),
    }
}

export default async function QuizPage({
    params,
}: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect(`/${lang}/auth/login?redirect=/${lang}/quiz`)
    }

    const questions = await getQuizQuestions(lang)

    return (
        <div className="min-h-screen bg-cream py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">
                        {dict.quiz.title}
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {dict.quiz.desc.replace('{count}', questions.length.toString())}
                    </p>
                </div>

                {questions.length > 0 ? (
                    <QuizForm questions={questions} dict={dict.quiz} />
                ) : (
                    <div className="text-center py-16">
                        <p className="text-gray-500">{dict.quiz.no_questions}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
