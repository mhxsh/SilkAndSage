'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Color {
    hex: string
    name: string
    usage: string
}

interface PaletteResult {
    palette: Color[]
    advice: string
}

interface ColorHarmonyProps {
    lang: string
}

const SCENARIOS = {
    zh: [
        { id: 'ootd_casual', label: '日常休闲穿搭', icon: '👕' },
        { id: 'ootd_business', label: '商务职场穿搭', icon: '💼' },
        { id: 'makeup_date', label: '约会桃花妆容', icon: '💄' },
        { id: 'home_living', label: '客厅能量软装', icon: '🛋️' },
        { id: 'home_bedroom', label: '卧室助眠氛围', icon: '🛏️' },
        { id: 'creative_art', label: '艺术创作灵感', icon: '🎨' }
    ],
    en: [
        { id: 'ootd_casual', label: 'Casual Outfit', icon: '👕' },
        { id: 'ootd_business', label: 'Business Attire', icon: '💼' },
        { id: 'makeup_date', label: 'Date Night Makeup', icon: '💄' },
        { id: 'home_living', label: 'Living Room Decor', icon: '🛋️' },
        { id: 'home_bedroom', label: 'Bedroom Ambience', icon: '🛏️' },
        { id: 'creative_art', label: 'Artistic Inspiration', icon: '🎨' }
    ]
}

export default function ColorHarmony({ lang }: ColorHarmonyProps) {
    const [step, setStep] = useState<'select' | 'generating' | 'result'>('select')
    const [selectedScenario, setSelectedScenario] = useState<string>('')
    const [customScenario, setCustomScenario] = useState('')
    const [result, setResult] = useState<PaletteResult | null>(null)
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
            const res = await fetch('/api/ai/color-harmony/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scenario, lang })
            })
            const data = await res.json()
            setResult(data)
            setStep('result')
        } catch (e) {
            console.error(e)
            alert('Error generating palette')
            setStep('select')
        }
    }

    const copyToClipboard = (hex: string) => {
        navigator.clipboard.writeText(hex)
        // Could add a toast notification here
    }

    const scenarios = lang === 'zh' ? SCENARIOS.zh : SCENARIOS.en

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                    {lang === 'zh' ? '色彩搭配大师' : 'Color Harmony AI'}
                </h1>
                <p className="text-gray-600">
                    {lang === 'zh'
                        ? '基于您的五行能量，为您定制专属的场景配色方案'
                        : 'Personalized color palettes based on your energy profile and scenario'}
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
                                        ? 'border-sage bg-sage/10 text-sage'
                                        : 'border-gray-100 hover:border-sage/50 text-gray-600'
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
                            placeholder={lang === 'zh' ? '例如：参加前任婚礼的战袍...' : 'e.g., Outfit for ex\'s wedding...'}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sage focus:border-transparent"
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={!selectedScenario && !customScenario}
                        className="w-full py-4 bg-sage text-white rounded-full text-lg font-medium hover:bg-sage/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                    >
                        {lang === 'zh' ? '生成配色方案' : 'Generate Palette'}
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
                    <div className="animate-spin text-5xl mb-6">🎨</div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                        {lang === 'zh' ? 'AI 正在调色中...' : 'AI is mixing colors...'}
                    </h3>
                    <p className="text-gray-500">
                        {lang === 'zh' ? '正在分析您的五行能量与场景需求' : 'Analyzing your energy profile and scenario requirements'}
                    </p>
                </div>
            )}

            {step === 'result' && result && (
                <div className="space-y-8">
                    {/* Palette Display */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="h-48 md:h-64 flex">
                            {result.palette.map((color, i) => (
                                <div
                                    key={i}
                                    className="flex-1 group relative flex items-end justify-center pb-4 transition-all hover:flex-[1.5]"
                                    style={{ backgroundColor: color.hex }}
                                >
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm cursor-pointer"
                                        onClick={() => copyToClipboard(color.hex)}>
                                        Copy {color.hex}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                🎨 {lang === 'zh' ? '配色详情' : 'Palette Details'}
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                {result.palette.map((color, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                        <div
                                            className="w-12 h-12 rounded-full shadow-inner border-2 border-white shrink-0"
                                            style={{ backgroundColor: color.hex }}
                                        />
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-gray-900">{color.name}</span>
                                                <span className="text-xs font-mono text-gray-400 bg-white px-2 py-0.5 rounded border">{color.hex}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                {color.usage}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Advice Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-sage">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            💡 {lang === 'zh' ? '搭配建议' : 'Style Advice'}
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
