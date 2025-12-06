'use client'

import { useState, useEffect } from 'react'
import { Lunar, Solar } from 'lunar-javascript'
import { createClient } from '@/lib/supabase/client'
import { recordToolUsage } from '@/lib/actions/footprint'

interface FortuneToolProps {
    dict: any
    lang: string
}

interface FortuneData {
    date: string
    zodiac: string
    overall: number
    love: number
    career: number
    health: number
    wealth: number
    luckyColor: string
    luckyDirection: string
    luckyFood: string
    advice: string
    auspicious: string[]
    inauspicious: string[]
}

// 生肖翻译
const CHINESE_ZODIAC: Record<string, string> = {
    '鼠': 'Rat', '牛': 'Ox', '虎': 'Tiger', '兔': 'Rabbit',
    '龙': 'Dragon', '蛇': 'Snake', '马': 'Horse', '羊': 'Goat',
    '猴': 'Monkey', '鸡': 'Rooster', '狗': 'Dog', '猪': 'Pig'
}

export default function FortuneTool({ dict, lang }: FortuneToolProps) {
    const [birthDate, setBirthDate] = useState('')
    const [fortune, setFortune] = useState<FortuneData | null>(null)
    const [isRevealing, setIsRevealing] = useState(false)
    const [showResult, setShowResult] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [saveMessage, setSaveMessage] = useState('')
    const [userNotes, setUserNotes] = useState('')

    const t = dict.tools.fortune
    const supabase = createClient()

    // Check user and load birthday
    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)

            if (user) {
                try {
                    const response = await fetch('/api/profile/birth-info')
                    const data = await response.json()

                    if (data.data && data.data.birth_date) {
                        setBirthDate(data.data.birth_date)
                    } else {
                        // Fallback to profile
                        const { data: profileData, error } = await supabase
                            .from('profiles')
                            .select('birth_date')
                            .eq('id', user.id)
                            .single()

                        if (profileData?.birth_date) {
                            setBirthDate(profileData.birth_date)
                        }
                    }
                } catch (error) {
                    console.error('Load birthday error:', error)
                }
            }
        }
        init()
    }, [supabase])

    // Save fortune function
    const handleSaveFortune = async () => {
        if (!fortune || !user) return

        setIsSaving(true)
        setSaveMessage('')

        try {
            const response = await fetch('/api/fortune/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fortuneData: fortune,
                    userNotes
                })
            })

            if (response.ok) {
                setSaveMessage(lang === 'zh' ? '✓ 运势已保存到历史记录' : '✓ Fortune saved to history')
                setUserNotes('')
            } else {
                setSaveMessage(lang === 'zh' ? '✗ 保存失败，请重试' : '✗ Save failed, please retry')
            }
        } catch (error) {
            console.error('Save fortune error:', error)
            setSaveMessage(lang === 'zh' ? '✗ 保存失败，请重试' : '✗ Save failed, please retry')
        } finally {
            setIsSaving(false)
        }
    }

    const generateFortune = (): void => {
        if (!birthDate) {
            alert(lang === 'zh' ? '请先输入您的生日' : 'Please enter your birthday first')
            return
        }

        setIsRevealing(true)
        setShowResult(false)

        const date = new Date(birthDate)
        const solar = Solar.fromDate(date)
        const lunar = solar.getLunar()
        const zodiacCh = lunar.getYearShengXiao()
        const zodiac = lang === 'zh' ? zodiacCh : CHINESE_ZODIAC[zodiacCh]

        setTimeout(() => {
            const fortuneData = generateFortuneData(zodiacCh, zodiac)
            setFortune(fortuneData)
            setIsRevealing(false)
            setShowResult(true)

            // Auto record footprint
            recordToolUsage('Daily Fortune', { date: new Date().toISOString() }, fortuneData)
        }, 2000)
    }

    const generateFortuneData = (zodiacCh: string, zodiac: string): FortuneData => {
        const today = new Date()
        const seed = today.getDate() + zodiacCh.charCodeAt(0)
        const randomScore = (base: number) => Math.min(5, Math.max(1, Math.floor((seed % 5) + base)))

        const luckyColors = lang === 'zh'
            ? ['红色', '蓝色', '绿色', '紫色', '金色', '粉色']
            : ['Red', 'Blue', 'Green', 'Purple', 'Gold', 'Pink']

        const directions = lang === 'zh'
            ? ['东方', '南方', '西方', '北方', '东南', '西南', '东北', '西北']
            : ['East', 'South', 'West', 'North', 'Southeast', 'Southwest', 'Northeast', 'Northwest']

        const foods = lang === 'zh'
            ? ['绿色蔬菜', '坚果', '水果', '鱼类', '豆制品', '全谷物']
            : ['Green vegetables', 'Nuts', 'Fruits', 'Fish', 'Soy products', 'Whole grains']

        const advices = lang === 'zh' ? [
            '今天是充满机遇的一天，保持开放的心态，您会发现意想不到的收获。',
            '专注于当下的事务，不要被琐事分散注意力。您的耐心会得到回报。',
            '今天适合与他人沟通交流，分享您的想法会带来新的启发。',
            '保持内心的平静，今天可能会遇到一些挑战，但您有能力克服。',
            '今天是展现创造力的好时机，不要害怕尝试新的想法。'
        ] : [
            'Today is full of opportunities. Keep an open mind and you\'ll find unexpected rewards.',
            'Focus on the present. Don\'t let trivial matters distract you. Your patience will be rewarded.',
            'Today is great for communication. Sharing your ideas will bring new inspiration.',
            'Stay calm. You may face challenges today, but you have the strength to overcome them.',
            'Today is perfect for creativity. Don\'t be afraid to try new ideas.'
        ]

        const auspiciousList = lang === 'zh' ? [
            ['参加社交活动', '学习新知识', '整理空间'],
            ['冥想放松', '阅读好书', '烹饪美食'],
            ['运动健身', '拜访朋友', '计划旅行'],
            ['创意工作', '整理思绪', '亲近自然']
        ] : [
            ['Social activities', 'Learn something new', 'Organize space'],
            ['Meditate', 'Read a good book', 'Cook'],
            ['Exercise', 'Visit friends', 'Plan a trip'],
            ['Creative work', 'Organize thoughts', 'Connect with nature']
        ]

        const inauspiciousList = lang === 'zh' ? [
            ['冲动决策', '过度劳累', '消极思考'],
            ['拖延重要事项', '暴饮暴食', '熬夜'],
            ['与人争执', '冒险投资', '忽视健康'],
            ['过度消费', '自我怀疑', '封闭自我']
        ] : [
            ['Impulsive decisions', 'Overworking', 'Negative thinking'],
            ['Procrastination', 'Overeating', 'Staying up late'],
            ['Arguments', 'Risky investments', 'Ignoring health'],
            ['Overspending', 'Self-doubt', 'Isolation']
        ]

        return {
            date: today.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US'),
            zodiac,
            overall: randomScore(3),
            love: randomScore(3),
            career: randomScore(2),
            health: randomScore(4),
            wealth: randomScore(2),
            luckyColor: luckyColors[seed % luckyColors.length],
            luckyDirection: directions[seed % directions.length],
            luckyFood: foods[seed % foods.length],
            advice: advices[seed % advices.length],
            auspicious: auspiciousList[seed % auspiciousList.length],
            inauspicious: inauspiciousList[seed % inauspiciousList.length]
        }
    }

    const renderStars = (score: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= score ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                    </span>
                ))}
            </div>
        )
    }

    // Fix hydration mismatch for random values or dynamic content
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-stone-900 mb-4">
                        🔮 {t.title}
                    </h1>
                    <p className="text-lg text-stone-600">{t.subtitle}</p>
                </div>

                {!showResult && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8">
                        <label className="block text-sm font-medium text-stone-700 mb-3">
                            {t.enter_birthday}
                        </label>
                        <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            lang={lang === 'zh' ? 'zh-CN' : 'en-US'}
                            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 mb-2"
                        />

                        {!birthDate && user && (
                            <div className="text-xs text-stone-500 mb-6 flex items-center gap-1">
                                <span>💡</span>
                                <a href={`/${lang}/profile`} className="text-purple-600 hover:underline">
                                    {lang === 'zh'
                                        ? '前往个人中心设置生日，下次自动加载'
                                        : 'Set birthday in Profile to auto-load next time'
                                    }
                                </a>
                            </div>
                        )}
                        {!birthDate && !user && (
                            <div className="text-xs text-stone-500 mb-6">
                                {lang === 'zh'
                                    ? '登录并设置生日可自动加载'
                                    : 'Login and set birthday to auto-load'
                                }
                            </div>
                        )}
                        {birthDate && (
                            <div className="mb-6"></div> // Spacer if no hint
                        )}

                        <button
                            onClick={generateFortune}
                            disabled={!birthDate || isRevealing}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-medium text-lg hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                        >
                            {isRevealing ? t.revealing : t.check_fortune}
                        </button>
                    </div>
                )}

                {isRevealing && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-16 flex flex-col items-center justify-center">
                        <div className="relative w-32 h-32 mb-6">
                            <div className="absolute inset-0 border-8 border-purple-200 rounded-full animate-ping"></div>
                            <div className="absolute inset-0 border-8 border-purple-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-4xl">🔮</div>
                        </div>
                        <p className="text-xl font-medium text-stone-700 animate-pulse">{t.revealing_message}</p>
                    </div>
                )}

                {showResult && fortune && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-xl p-8 text-white text-center">
                            <div className="text-sm opacity-90 mb-2">{fortune.date}</div>
                            <h2 className="text-3xl font-serif font-bold mb-2">
                                {t.fortune_for.replace('{zodiac}', fortune.zodiac)}
                            </h2>
                            <div className="flex items-center justify-center gap-2 mt-4">
                                <span className="text-lg">{t.overall}</span>
                                {renderStars(fortune.overall)}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: t.love, score: fortune.love, icon: '💕' },
                                { label: t.career, score: fortune.career, icon: '💼' },
                                { label: t.health, score: fortune.health, icon: '🏃' },
                                { label: t.wealth, score: fortune.wealth, icon: '💰' }
                            ].map((item) => (
                                <div key={item.label} className="bg-white rounded-xl shadow-lg p-6 text-center">
                                    <div className="text-3xl mb-2">{item.icon}</div>
                                    <div className="text-sm text-stone-500 mb-2">{item.label}</div>
                                    {renderStars(item.score)}
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-6">{t.lucky_elements}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg">
                                    <div className="text-sm text-stone-500 mb-2">{t.lucky_color}</div>
                                    <div className="text-xl font-bold text-pink-600">{fortune.luckyColor}</div>
                                </div>
                                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                                    <div className="text-sm text-stone-500 mb-2">{t.lucky_direction}</div>
                                    <div className="text-xl font-bold text-blue-600">{fortune.luckyDirection}</div>
                                </div>
                                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                                    <div className="text-sm text-stone-500 mb-2">{t.lucky_food}</div>
                                    <div className="text-xl font-bold text-green-600">{fortune.luckyFood}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-lg p-8">
                            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4 flex items-center gap-2">
                                <span>💡</span>{t.daily_advice}
                            </h3>
                            <p className="text-stone-700 leading-relaxed text-lg">{fortune.advice}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-green-50 rounded-2xl shadow-lg p-8">
                                <h3 className="text-xl font-serif font-bold text-green-800 mb-4">✅ {t.auspicious}</h3>
                                <ul className="space-y-2">
                                    {fortune.auspicious.map((item, index) => (
                                        <li key={index} className="flex items-center gap-2 text-green-700">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-red-50 rounded-2xl shadow-lg p-8">
                                <h3 className="text-xl font-serif font-bold text-red-800 mb-4">❌ {t.inauspicious}</h3>
                                <ul className="space-y-2">
                                    {fortune.inauspicious.map((item, index) => (
                                        <li key={index} className="flex items-center gap-2 text-red-700">
                                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Save Fortune Section */}
                        {user && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h3 className="text-xl font-serif font-bold text-stone-900 mb-4">
                                    📝 {lang === 'zh' ? '添加笔记' : 'Add Notes'}
                                </h3>
                                <textarea
                                    value={userNotes}
                                    onChange={(e) => setUserNotes(e.target.value)}
                                    placeholder={lang === 'zh' ? '记录今天的感受、发生的事情...' : 'Record your thoughts and what happened today...'}
                                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none mb-4"
                                    rows={4}
                                />

                                {saveMessage && (
                                    <div className={`mb-4 p-4 rounded-lg ${saveMessage.includes('✓')
                                        ? 'bg-green-50 border border-green-200 text-green-700'
                                        : 'bg-red-50 border border-red-200 text-red-700'
                                        }`}>
                                        {saveMessage}
                                    </div>
                                )}

                                <button
                                    onClick={handleSaveFortune}
                                    disabled={isSaving}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                                >
                                    {isSaving
                                        ? (lang === 'zh' ? '💾 保存中...' : '💾 Saving...')
                                        : (lang === 'zh' ? '💾 保存运势' : '💾 Save Fortune')
                                    }
                                </button>

                                {saveMessage.includes('✓') && (
                                    <p className="mt-3 text-sm text-center text-gray-600">
                                        <a href={`/${lang}/profile`} className="text-purple-600 hover:underline">
                                            {lang === 'zh' ? '→ 在个人中心查看历史' : '→ View history in Profile'}
                                        </a>
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="text-center pt-4">
                            <button
                                onClick={() => {
                                    setShowResult(false)
                                    setBirthDate('')
                                    setFortune(null)
                                }}
                                className="px-8 py-3 border-2 border-purple-500 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                            >
                                {t.recheck}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
            `}</style>
        </div>
    )
}
