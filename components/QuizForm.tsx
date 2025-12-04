'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface QuizQuestion {
    id: number
    question_text: string
    answers: Array<{
        text: string
        element: string
    }>
}

interface QuizFormProps {
    questions: QuizQuestion[]
}

export default function QuizForm({ questions }: QuizFormProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleAnswer = (element: string) => {
        const newAnswers = {
            ...answers,
            [questions[currentQuestion].id]: element,
        }
        setAnswers(newAnswers)

        if (currentQuestion < questions.length - 1) {
            // 进入下一题
            setCurrentQuestion(currentQuestion + 1)
        } else {
            // 完成测试，提交结果
            submitQuiz(newAnswers)
        }
    }

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1)
        }
    }

    const submitQuiz = async (finalAnswers: Record<number, string>) => {
        setLoading(true)

        try {
            const response = await fetch('/api/quiz/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers: finalAnswers }),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || '提交失败')
            }

            const { result } = await response.json()
            router.push(`/quiz/result?element=${result}`)
        } catch (error: any) {
            alert(error.message)
            setLoading(false)
        }
    }

    const progress = ((currentQuestion + 1) / questions.length) * 100
    const question = questions[currentQuestion]

    return (
        <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>问题 {currentQuestion + 1} / {questions.length}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-sage transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-8 text-center">
                    {question.question_text}
                </h2>

                <div className="space-y-3">
                    {question.answers.map((answer, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(answer.element)}
                            disabled={loading}
                            className="w-full text-left px-6 py-4 bg-gray-50 hover:bg-sage/10 border-2 border-transparent hover:border-sage rounded-lg transition-all disabled:opacity-50"
                        >
                            <span className="text-lg">{answer.text}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
                <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0 || loading}
                    className="px-6 py-2 text-sage border border-sage rounded-lg hover:bg-sage/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    上一题
                </button>
                <div className="text-sm text-gray-500 self-center">
                    {Object.keys(answers).length > 0 && `已回答 ${Object.keys(answers).length} 题`}
                </div>
            </div>
        </div>
    )
}
