'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Question {
    id: number
    text: string
    options: string[]
}

interface AnalysisResult {
    analysis: string
    suggestion: string
    lucky_color: {
        name: string
        hex: string
    }
    quote: string
}

interface MoodTestProps {
    lang: string
}

export default function MoodTest({ lang }: MoodTestProps) {
    const [step, setStep] = useState<'start' | 'loading_questions' | 'testing' | 'analyzing' | 'result'>('start')
    const [questions, setQuestions] = useState<Question[]>([])
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [result, setResult] = useState<AnalysisResult | null>(null)
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        checkUser()
    }, [])

    const startTest = async () => {
        if (!user) {
            window.location.href = `/${lang}/auth/login`
            return
        }

        setStep('loading_questions')
        try {
            const res = await fetch('/api/ai/mood-test/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lang })
            })
            const data = await res.json()
            if (data.questions) {
                setQuestions(data.questions)
                setStep('testing')
            } else {
                alert('Failed to load questions')
                setStep('start')
            }
        } catch (e) {
            console.error(e)
            alert('Error loading questions')
            setStep('start')
        }
    }

    const handleAnswer = (questionId: number, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }))
    }

    const submitTest = async () => {
        setStep('analyzing')
        try {
            const res = await fetch('/api/ai/mood-test/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    answers,
                    questions,
                    lang
                })
            })
            const data = await res.json()
            setResult(data)
            setStep('result')
        } catch (e) {
            console.error(e)
            alert('Error analyzing results')
            setStep('testing')
        }
    }

    const allAnswered = questions.length > 0 && questions.every(q => answers[q.id])

    return (
        <div className="max-w-2xl mx-auto p-6">
            {step === 'start' && (
                <div className="text-center bg-white rounded-2xl shadow-lg p-10">
                    <div className="text-6xl mb-6">🧠</div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                        {lang === 'zh' ? 'AI 每日心情疗愈' : 'AI Daily Mood Healing'}
                    </h1>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        {lang === 'zh'
                            ? '结合您的五行与星座能量，为您定制专属的心情测试。AI 将为您分析当下的能量状态，并提供疗愈建议。'
                            : 'Personalized mood test based on your Zodiac and Element. AI will analyze your current energy state and provide healing advice.'}
                    </p>
                    <button
                        onClick={startTest}
                        className="px-8 py-4 bg-sage text-white rounded-full text-lg font-medium hover:bg-sage/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                        {lang === 'zh' ? '开始测试' : 'Start Test'}
                    </button>
                    {!user && (
                        <p className="mt-4 text-sm text-amber-600">
                            {lang === 'zh' ? '* 需要登录以获取个性化体验' : '* Login required for personalized experience'}
                        </p>
                    )}
                </div>
            )}

            {step === 'loading_questions' && (
                <div className="text-center py-20">
                    <div className="animate-spin text-4xl mb-4">🌀</div>
                    <p className="text-gray-600">
                        {lang === 'zh' ? 'AI 正在为您生成专属题目...' : 'AI is generating personalized questions...'}
                    </p>
                </div>
            )}

            {step === 'testing' && (
                <div className="space-y-8">
                    {questions.map((q, index) => (
                        <div key={q.id} className="bg-white rounded-xl shadow-md p-6 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                            <h3 className="text-xl font-medium text-gray-900 mb-4">
                                <span className="text-sage mr-2">{index + 1}.</span>
                                {q.text}
                            </h3>
                            <div className="space-y-3">
                                {q.options.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => handleAnswer(q.id, opt)}
                                        className={`w-full text-left px-5 py-3 rounded-lg border-2 transition-all ${answers[q.id] === opt
                                                ? 'border-sage bg-sage/10 text-sage font-medium'
                                                : 'border-transparent bg-gray-50 hover:bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="text-center pt-4">
                        <button
                            onClick={submitTest}
                            disabled={!allAnswered}
                            className="px-10 py-3 bg-sage text-white rounded-full text-lg font-medium hover:bg-sage/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {lang === 'zh' ? '生成疗愈报告' : 'Generate Healing Report'}
                        </button>
                    </div>
                </div>
            )}

            {step === 'analyzing' && (
                <div className="text-center py-20">
                    <div className="animate-pulse text-6xl mb-6">✨</div>
                    <h2 className="text-2xl font-serif text-gray-900 mb-2">
                        {lang === 'zh' ? '正在分析您的能量场...' : 'Analyzing your energy field...'}
                    </h2>
                    <p className="text-gray-500">
                        {lang === 'zh' ? 'AI 正在调制您的专属疗愈配方' : 'AI is formulating your healing prescription'}
                    </p>
                </div>
            )}

            {step === 'result' && result && (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
                    <div className="bg-sage/10 p-8 text-center border-b border-sage/10">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                            {lang === 'zh' ? '今日疗愈报告' : 'Daily Healing Report'}
                        </h2>
                        <div className="text-sm text-gray-500">
                            {new Date().toLocaleDateString()}
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Analysis */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                🔍 {lang === 'zh' ? '情绪洞察' : 'Mood Insight'}
                            </h3>
                            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                                {result.analysis}
                            </p>
                        </div>

                        {/* Suggestion */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                💊 {lang === 'zh' ? '疗愈建议' : 'Healing Advice'}
                            </h3>
                            <p className="text-gray-700 leading-relaxed bg-green-50 p-4 rounded-lg border border-green-100">
                                {result.suggestion}
                            </p>
                        </div>

                        {/* Lucky Color */}
                        <div className="flex items-center gap-6 bg-stone-50 p-4 rounded-lg">
                            <div
                                className="w-16 h-16 rounded-full shadow-inner border-4 border-white"
                                style={{ backgroundColor: result.lucky_color.hex }}
                            />
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                                    {lang === 'zh' ? '今日能量色' : 'Energy Color'}
                                </h3>
                                <div className="text-xl font-serif font-bold text-gray-900">
                                    {result.lucky_color.name}
                                </div>
                                <div className="text-xs text-gray-400 font-mono mt-1">
                                    {result.lucky_color.hex}
                                </div>
                            </div>
                        </div>

                        {/* Quote */}
                        <div className="text-center pt-4 border-t border-gray-100">
                            <p className="text-xl font-serif italic text-sage">
                                "{result.quote}"
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 text-center">
                        <button
                            onClick={() => setStep('start')}
                            className="text-gray-600 hover:text-sage font-medium transition-colors"
                        >
                            {lang === 'zh' ? '再测一次' : 'Test Again'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
