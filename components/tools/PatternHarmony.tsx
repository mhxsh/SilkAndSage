'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import ToolShareButton from '@/components/share/ToolShareButton'

interface Recommendation {
    type: string
    name: string
    description: string
    usage: string
}

interface PatternResult {
    recommendations: Recommendation[]
    advice: string
}

interface PatternHarmonyProps {
    lang: string
}

const SCENARIOS = {
    zh: [
        { id: 'ootd_texture', label: '穿搭质感提升', icon: '👗' },
        { id: 'home_soft', label: '家居软装搭配', icon: '🛋️' },
        { id: 'workspace', label: '办公环境优化', icon: '🖥️' },
        { id: 'accessory', label: '配饰与包袋', icon: '👜' },
        { id: 'bedding', label: '寝具与睡眠', icon: '🛏️' }
    ],
    en: [
        { id: 'ootd_texture', label: 'Outfit Texture', icon: '👗' },
        { id: 'home_soft', label: 'Home Soft Furnishing', icon: '🛋️' },
        { id: 'workspace', label: 'Workspace Optimization', icon: '🖥️' },
        { id: 'accessory', label: 'Accessories & Bags', icon: '👜' },
        { id: 'bedding', label: 'Bedding & Sleep', icon: '🛏️' }
    ]
}

export default function PatternHarmony({ lang }: PatternHarmonyProps) {
    const [step, setStep] = useState<'select' | 'generating' | 'result'>('select')
    const [selectedScenario, setSelectedScenario] = useState<string>('')
    const [customScenario, setCustomScenario] = useState('')
    const [result, setResult] = useState<PatternResult | null>(null)
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        checkUser()
    }, [])

    const handleGenerate = async () => {
        if (!user) {
            window.location.href = `/${lang}/auth/login`
            return
        }

        const scenario = customScenario || SCENARIOS[lang as 'zh' | 'en'].find(s => s.id === selectedScenario)?.label || selectedScenario
        if (!scenario) return

        setStep('generating')
        try {
            const res = await fetch('/api/ai/pattern-harmony/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scenario, lang })
            })
            const data = await res.json()
            setResult(data)
            setStep('result')
        } catch (e) {
            console.error(e)
            alert('Error generating recommendations')
            setStep('select')
        }
    }

    const scenarios = lang === 'zh' ? SCENARIOS.zh : SCENARIOS.en

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                    {lang === 'zh' ? '纹理图案搭配师' : 'Pattern & Texture Harmony'}
                </h1>
                <p className="text-gray-600">
                    {lang === 'zh'
                        ? '探索最适合您能量场的材质与图案，提升生活质感'
                        : 'Discover textures and patterns that harmonize with your energy field'}
                </p>
            </div>

            {step === 'select' && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                        {lang === 'zh' ? '请选择搭配场景' : 'Select a Scenario'}
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                        {scenarios.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => {
                                    setSelectedScenario(s.id)
                                    setCustomScenario('')
                                }}
                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${selectedScenario === s.id && !customScenario
                                        ? 'border-amber-400 bg-amber-50 text-amber-700'
                                        : 'border-gray-100 hover:border-amber-200 text-gray-600'
                                    }`}
                            >
                                <span className="text-3xl">{s.icon}</span>
                                <span className="font-medium">{s.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {lang === 'zh' ? '或输入自定义场景' : 'Or enter custom scenario'}
                        </label>
                        <input
                            type="text"
                            value={customScenario}
                            onChange={(e) => {
                                setCustomScenario(e.target.value)
                                setSelectedScenario('')
                            }}
                            placeholder={lang === 'zh' ? '例如：面试时的领带图案...' : 'e.g., Tie pattern for interview...'}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={!selectedScenario && !customScenario}
                        className="w-full py-4 bg-amber-500 text-white rounded-full text-lg font-medium hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                    >
                        {lang === 'zh' ? '获取搭配建议' : 'Get Recommendations'}
                    </button>

                    {!user && (
                        <p className="text-center mt-4 text-amber-600 text-sm">
                            {lang === 'zh' ? '* 需要登录' : '* Login required'}
                        </p>
                    )}
                </div>
            )}

            {step === 'generating' && (
                <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                    <div className="animate-pulse text-5xl mb-6">🧶</div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                        {lang === 'zh' ? 'AI 正在甄选材质...' : 'AI is selecting textures...'}
                    </h3>
                    <p className="text-gray-500">
                        {lang === 'zh' ? '正在匹配您的五行能量与触觉体验' : 'Matching your energy with tactile experiences'}
                    </p>
                </div>
            )}

            {step === 'result' && result && (
                <div className="space-y-8">
                    {/* Recommendations Grid */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {result.recommendations.map((item, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-400 hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">
                                        {item.type}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 italic">
                                    "{item.description}"
                                </p>
                                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                                    <span className="font-bold mr-1">💡 {lang === 'zh' ? '应用:' : 'Usage:'}</span>
                                    {item.usage}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Advice Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-amber-500">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            ✨ {lang === 'zh' ? '搭配心法' : 'Styling Philosophy'}
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            {result.advice}
                        </p>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={() => setStep('select')}
                            className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-all"
                        >
                            {lang === 'zh' ? '尝试其他场景' : 'Try Another Scenario'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
