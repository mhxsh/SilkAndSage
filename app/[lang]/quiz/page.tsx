import { getQuizQuestions } from '@/lib/data/quiz'
import QuizForm from '@/components/QuizForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = {
    title: '发现你的内在元素 | Silk & Sage',
    description: '通过五行测试，发现你的内在元素属性',
}

export default async function QuizPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login?redirect=/quiz')
    }

    const questions = await getQuizQuestions()

    return (
        <div className="min-h-screen bg-cream py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">
                        发现你的内在元素
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        基于东方五行哲学，通过 {questions.length} 个问题，我们将帮助你找到属于自己的内在元素。
                    </p>
                </div>

                {questions.length > 0 ? (
                    <QuizForm questions={questions} />
                ) : (
                    <div className="text-center py-16">
                        <p className="text-gray-500">暂无测试题目...</p>
                    </div>
                )}
            </div>
        </div>
    )
}
