'use client'

import { useState, useEffect } from 'react'
import { Lunar, Solar } from 'lunar-javascript'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import { createClient } from '@/lib/supabase/client'

interface BirthdayToolProps {
    dict: any
    lang: string
}

// 星座翻译
const ZODIAC_SIGNS: Record<string, { zh: string; en: string }> = {
    'aquarius': { zh: '水瓶座', en: 'Aquarius' },
    'pisces': { zh: '双鱼座', en: 'Pisces' },
    'aries': { zh: '白羊座', en: 'Aries' },
    'taurus': { zh: '金牛座', en: 'Taurus' },
    'gemini': { zh: '双子座', en: 'Gemini' },
    'cancer': { zh: '巨蟹座', en: 'Cancer' },
    'leo': { zh: '狮子座', en: 'Leo' },
    'virgo': { zh: '处女座', en: 'Virgo' },
    'libra': { zh: '天秤座', en: 'Libra' },
    'scorpio': { zh: '天蝎座', en: 'Scorpio' },
    'sagittarius': { zh: '射手座', en: 'Sagittarius' },
    'capricorn': { zh: '摩羯座', en: 'Capricorn' }
}

// 生肖翻译
const CHINESE_ZODIAC: Record<string, string> = {
    '鼠': 'Rat', '牛': 'Ox', '虎': 'Tiger', '兔': 'Rabbit',
    '龙': 'Dragon', '蛇': 'Snake', '马': 'Horse', '羊': 'Goat',
    '猴': 'Monkey', '鸡': 'Rooster', '狗': 'Dog', '猪': 'Pig'
}

// 五行翻译
const ELEMENTS: Record<string, string> = {
    '木': 'Wood', '火': 'Fire', '土': 'Earth', '金': 'Metal', '水': 'Water'
}

// 颜色翻译
const COLORS: Record<string, string> = {
    '蓝色': 'Blue', '金色': 'Gold', '绿色': 'Green', '黄色': 'Yellow',
    '红色': 'Red', '灰色': 'Gray', '橙色': 'Orange', '粉色': 'Pink',
    '紫色': 'Purple', '银色': 'Silver', '黑色': 'Black', '浅黄色': 'Light Yellow',
    '棕色': 'Brown', '白色': 'White'
}

// 计算星座
const getZodiacSign = (month: number, day: number): string => {
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius'
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'pisces'
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries'
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus'
    if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return 'gemini'
    if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return 'cancer'
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo'
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo'
    if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return 'libra'
    if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return 'scorpio'
    if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return 'sagittarius'
    return 'capricorn'
}

// 时辰对照表
const getChineseHour = (hour: number, lang: string): string => {
    const hours: Record<number, { zh: string; en: string }> = {
        23: { zh: '子时 (23:00-01:00)', en: 'Zi (11pm-1am)' },
        1: { zh: '丑时 (01:00-03:00)', en: 'Chou (1am-3am)' },
        3: { zh: '寅时 (03:00-05:00)', en: 'Yin (3am-5am)' },
        5: { zh: '卯时 (05:00-07:00)', en: 'Mao (5am-7am)' },
        7: { zh: '辰时 (07:00-09:00)', en: 'Chen (7am-9am)' },
        9: { zh: '巳时 (09:00-11:00)', en: 'Si (9am-11am)' },
        11: { zh: '午时 (11:00-13:00)', en: 'Wu (11am-1pm)' },
        13: { zh: '未时 (13:00-15:00)', en: 'Wei (1pm-3pm)' },
        15: { zh: '申时 (15:00-17:00)', en: 'Shen (3pm-5pm)' },
        17: { zh: '酉时 (17:00-19:00)', en: 'You (5pm-7pm)' },
        19: { zh: '戌时 (19:00-21:00)', en: 'Xu (7pm-9pm)' },
        21: { zh: '亥时 (21:00-23:00)', en: 'Hai (9pm-11pm)' }
    }

    let hourKey = 23
    if (hour >= 1 && hour < 3) hourKey = 1
    else if (hour >= 3 && hour < 5) hourKey = 3
    else if (hour >= 5 && hour < 7) hourKey = 5
    else if (hour >= 7 && hour < 9) hourKey = 7
    else if (hour >= 9 && hour < 11) hourKey = 9
    else if (hour >= 11 && hour < 13) hourKey = 11
    else if (hour >= 13 && hour < 15) hourKey = 13
    else if (hour >= 15 && hour < 17) hourKey = 15
    else if (hour >= 17 && hour < 19) hourKey = 17
    else if (hour >= 19 && hour < 21) hourKey = 19
    else if (hour >= 21 && hour < 23) hourKey = 21

    return hours[hourKey][lang === 'zh' ? 'zh' : 'en']
}

// 五行平衡计算
const calculateElementBalance = (zodiac: string) => {
    const elementMap: Record<string, { wood: number; fire: number; earth: number; metal: number; water: number }> = {
        '鼠': { wood: 1, fire: 1, earth: 1, metal: 2, water: 4 },
        '牛': { wood: 1, fire: 1, earth: 4, metal: 2, water: 1 },
        '虎': { wood: 4, fire: 2, earth: 1, metal: 1, water: 1 },
        '兔': { wood: 4, fire: 1, earth: 1, metal: 1, water: 2 },
        '龙': { wood: 2, fire: 1, earth: 4, metal: 1, water: 1 },
        '蛇': { wood: 1, fire: 4, earth: 2, metal: 1, water: 1 },
        '马': { wood: 1, fire: 4, earth: 1, metal: 1, water: 2 },
        '羊': { wood: 1, fire: 2, earth: 4, metal: 1, water: 1 },
        '猴': { wood: 1, fire: 1, earth: 1, metal: 4, water: 2 },
        '鸡': { wood: 1, fire: 1, earth: 2, metal: 4, water: 1 },
        '狗': { wood: 2, fire: 1, earth: 4, metal: 1, water: 1 },
        '猪': { wood: 2, fire: 1, earth: 1, metal: 1, water: 4 }
    }
    return elementMap[zodiac] || { wood: 2, fire: 2, earth: 2, metal: 2, water: 2 }
}

const getLuckyColors = (zodiac: string): string[] => {
    const colorMap: Record<string, string[]> = {
        '鼠': ['蓝色', '金色', '绿色'], '牛': ['黄色', '绿色', '红色'],
        '虎': ['蓝色', '灰色', '橙色'], '兔': ['红色', '粉色', '紫色'],
        '龙': ['金色', '银色', '灰色'], '蛇': ['红色', '浅黄色', '黑色'],
        '马': ['黄色', '棕色', '紫色'], '羊': ['绿色', '红色', '紫色'],
        '猴': ['白色', '金色', '蓝色'], '鸡': ['金色', '棕色', '黄色'],
        '狗': ['红色', '绿色', '紫色'], '猪': ['黄色', '灰色', '蓝色']
    }
    return colorMap[zodiac] || ['绿色', '蓝色', '白色']
}

const getLuckyNumbers = (zodiac: string): number[] => {
    const numberMap: Record<string, number[]> = {
        '鼠': [2, 3, 6], '牛': [1, 4, 9], '虎': [1, 3, 4], '兔': [3, 4, 9],
        '龙': [1, 6, 7], '蛇': [2, 8, 9], '马': [2, 3, 7], '羊': [3, 4, 9],
        '猴': [4, 9], '鸡': [5, 7, 8], '狗': [3, 4, 9], '猪': [2, 5, 8]
    }
    return numberMap[zodiac] || [1, 6, 8]
}

const getPersonality = (zodiac: string, lang: string): string => {
    const personalities: Record<string, { zh: string; en: string }> = {
        '鼠': {
            zh: '机智灵活，适应力强，善于社交。您拥有敏锐的洞察力和灵活的思维，能够在不同环境中游刃有余。勤奋务实是您的特质，但有时也要学会放慢脚步，享受生活。',
            en: 'Quick-witted, adaptable, and sociable. You have sharp insight and flexible thinking, thriving in different environments. Diligent and practical, but remember to slow down and enjoy life.'
        },
        '牛': {
            zh: '稳重踏实，勤劳务实，有责任心。您是天生的实干家，做事认真，值得信赖。虽然有时显得固执，但这正是您坚持原则的体现。耐心和毅力是您最大的优势。',
            en: 'Steady, diligent, and responsible. A natural doer who is reliable and trustworthy. Though sometimes stubborn, this reflects your principled nature. Patience and perseverance are your greatest strengths.'
        },
        '虎': {
            zh: '勇敢自信，具有领导力，热情洋溢。您天生具有王者风范，勇于接受挑战，不畏困难。强烈的正义感和责任感让您成为值得依赖的朋友。',
            en: 'Brave, confident, and charismatic leader. Born with regal bearing, you embrace challenges fearlessly. Your strong sense of justice makes you a dependable friend.'
        },
        '兔': {
            zh: '温柔善良，细腻敏感，追求和平。您拥有优雅的气质和艺术天赋，善于创造美好的氛围。虽然偶尔会过于敏感，但这正是您富有同理心的表现。',
            en: 'Gentle, kind, and peace-loving. You possess elegance and artistic talent, creating beautiful atmospheres. Your sensitivity shows your empathetic nature.'
        },
        '龙': {
            zh: '充满活力，雄心勃勃，具有创造力。您天生就是焦点，拥有强大的个人魅力和领导才能。自信和热情是您的标志。',
            en: 'Energetic, ambitious, and creative. A natural center of attention with powerful charisma and leadership. Confidence and passion define you.'
        },
        '蛇': {
            zh: '智慧深邃，神秘优雅，直觉敏锐。您拥有深刻的洞察力和独特的魅力，善于分析和思考。',
            en: 'Wise, mysterious, and intuitive. You possess deep insight and unique charm, excelling at analysis and contemplation.'
        },
        '马': {
            zh: '热情奔放，自由独立，精力充沛。您热爱自由，追求梦想，不愿受到束缚。乐观开朗的性格让您广受欢迎。',
            en: 'Passionate, free-spirited, and energetic. You love freedom and pursue dreams without constraints. Your optimism makes you popular.'
        },
        '羊': {
            zh: '温和友善，富有同情心，艺术气质。您温柔体贴，善解人意，拥有出色的审美能力。',
            en: 'Gentle, compassionate, and artistic. Tender and understanding with excellent aesthetic sense.'
        },
        '猴': {
            zh: '聪明机智，活泼好动，善于解决问题。您思维敏捷，学习能力强，总能想出创新的解决方案。',
            en: 'Clever, lively, and problem-solving. Quick-thinking with strong learning ability, always finding innovative solutions.'
        },
        '鸡': {
            zh: '勤奋认真，追求完美，诚实坦率。您做事有条理，注重细节，是团队中不可或缺的成员。',
            en: 'Diligent, perfectionist, and honest. Organized and detail-oriented, an indispensable team member.'
        },
        '狗': {
            zh: '忠诚可靠，正直善良，具有正义感。您是值得信赖的朋友，对待感情真诚专一。',
            en: 'Loyal, honest, and just. A trustworthy friend who is sincere and devoted in relationships.'
        },
        '猪': {
            zh: '善良真诚，乐观开朗，享受生活。您心地纯良，对生活充满热情。慷慨和真诚是您最大的优点。',
            en: 'Kind, optimistic, and life-loving. Pure-hearted with enthusiasm for life. Generosity and sincerity are your greatest virtues.'
        }
    }
    return personalities[zodiac]?.[lang === 'zh' ? 'zh' : 'en'] || (lang === 'zh' ? '您拥有独特的性格魅力' : 'You have unique personality charm')
}

export default function BirthdayTool({ dict, lang }: BirthdayToolProps) {
    const [birthDate, setBirthDate] = useState('')
    const [birthTime, setBirthTime] = useState('')
    const [result, setResult] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [saveMessage, setSaveMessage] = useState('')

    const t = dict.tools.birthday
    const supabase = createClient()

    // Check user login status
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        checkUser()
    }, [])

    // Save to profile function
    const handleSave = async () => {
        if (!result || !user) return

        setIsSaving(true)
        setSaveMessage('')

        try {
            const response = await fetch('/api/profile/birth-info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    birthDate,
                    birthTime,
                    zodiacSign: result.zodiacSign,
                    chineseZodiac: result.chineseZodiac,
                    lunarBirthDate: result.lunarDate,
                    birthHour: result.chineseHour,
                    element: result.dominantElement,
                    elementBalance: result.elementBalance,
                    personalityTraits: result.personality,
                    luckyColors: result.luckyColors,
                    luckyNumbers: result.luckyNumbers
                })
            })

            if (response.ok) {
                setSaveMessage(lang === 'zh' ? '✓ 已保存到个人资料' : '✓ Saved to profile')
            } else {
                setSaveMessage(lang === 'zh' ? '✗ 保存失败，请重试' : '✗ Save failed, please retry')
            }
        } catch (error) {
            console.error('Save error:', error)
            setSaveMessage(lang === 'zh' ? '✗ 保存失败，请重试' : '✗ Save failed, please retry')
        } finally {
            setIsSaving(false)
        }
    }

    const handleAnalyze = () => {
        if (!birthDate) return

        const date = new Date(birthDate)
        const solar = Solar.fromDate(date)
        const lunar = solar.getLunar()

        const month = date.getMonth() + 1
        const day = date.getDate()
        const zodiacSignKey = getZodiacSign(month, day)
        const zodiacSign = ZODIAC_SIGNS[zodiacSignKey][lang === 'zh' ? 'zh' : 'en']

        let chineseHour = ''
        if (birthTime) {
            const [hour] = birthTime.split(':').map(Number)
            chineseHour = getChineseHour(hour, lang)
        }

        const chineseZodiac = lunar.getYearShengXiao()
        const translatedZodiac = lang === 'zh' ? chineseZodiac : CHINESE_ZODIAC[chineseZodiac]
        const elementBalance = calculateElementBalance(chineseZodiac)

        const dominantElement = Object.entries(elementBalance).reduce((a, b) =>
            elementBalance[a[0] as keyof typeof elementBalance] > elementBalance[b[0] as keyof typeof elementBalance] ? a : b
        )[0]

        const elementNames: Record<string, string> = lang === 'zh'
            ? { wood: '木', fire: '火', earth: '土', metal: '金', water: '水' }
            : { wood: 'Wood', fire: 'Fire', earth: 'Earth', metal: 'Metal', water: 'Water' }

        const radarData = [
            { element: elementNames.wood, value: elementBalance.wood },
            { element: elementNames.fire, value: elementBalance.fire },
            { element: elementNames.earth, value: elementBalance.earth },
            { element: elementNames.metal, value: elementBalance.metal },
            { element: elementNames.water, value: elementBalance.water }
        ]

        const luckyColors = getLuckyColors(chineseZodiac).map(color =>
            lang === 'zh' ? color : (COLORS[color] || color)
        )

        setResult({
            lunarDate: lunar.toString(),
            chineseZodiac: translatedZodiac,
            zodiacSign,
            chineseHour,
            yearInGanZhi: lunar.getYearInGanZhi(),
            dominantElement: elementNames[dominantElement as keyof typeof elementNames],
            elementBalance,
            radarData,
            luckyColors,
            luckyNumbers: getLuckyNumbers(chineseZodiac),
            personality: getPersonality(chineseZodiac, lang)
        })
    }

    return (
        <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-stone-900 mb-4">
                        🎂 {t.title}
                    </h1>
                    <p className="text-lg text-stone-600">{t.subtitle}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                {t.birth_date_required}
                            </label>
                            <input
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                lang={lang === 'zh' ? 'zh-CN' : 'en-US'}
                                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                {t.birth_time_optional}
                            </label>
                            <input
                                type="time"
                                value={birthTime}
                                onChange={(e) => setBirthTime(e.target.value)}
                                lang={lang === 'zh' ? 'zh-CN' : 'en-US'}
                                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleAnalyze}
                        disabled={!birthDate}
                        className="mt-6 w-full bg-sage text-white py-3 rounded-lg font-medium hover:bg-sage/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {t.analyze}
                    </button>
                </div>

                {result && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-6">{t.basic_info}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="text-center p-4 bg-stone-50 rounded-lg">
                                    <div className="text-sm text-stone-500 mb-1">{t.zodiac}</div>
                                    <div className="text-2xl font-bold text-stone-900">{result.chineseZodiac}</div>
                                </div>
                                <div className="text-center p-4 bg-stone-50 rounded-lg">
                                    <div className="text-sm text-stone-500 mb-1">{t.star_sign}</div>
                                    <div className="text-2xl font-bold text-stone-900">{result.zodiacSign}</div>
                                </div>
                                <div className="text-center p-4 bg-stone-50 rounded-lg">
                                    <div className="text-sm text-stone-500 mb-1">{t.lunar_birthday}</div>
                                    <div className="text-lg font-bold text-stone-900">{result.lunarDate}</div>
                                </div>
                                {result.chineseHour && (
                                    <div className="text-center p-4 bg-stone-50 rounded-lg">
                                        <div className="text-sm text-stone-500 mb-1">{t.hour}</div>
                                        <div className="text-lg font-bold text-stone-900">{result.chineseHour.split(' ')[0]}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-lg p-8">
                            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-6 flex items-center gap-2">
                                <span>⚖️</span>{t.element_balance}
                            </h3>
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="w-full md:w-1/2">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <RadarChart data={result.radarData}>
                                            <PolarGrid stroke="#cbd5e1" />
                                            <PolarAngleAxis dataKey="element" tick={{ fill: '#475569', fontSize: 14 }} />
                                            <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: '#64748b' }} />
                                            <Radar name={lang === 'zh' ? '五行' : 'Elements'} dataKey="value" stroke="#059669" fill="#10b981" fillOpacity={0.6} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="w-full md:w-1/2">
                                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6">
                                        <div className="mb-4">
                                            <span className="text-sm text-stone-600">{t.dominant_element}</span>
                                            <div className="text-3xl font-bold text-emerald-700 mt-1">{result.dominantElement}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">{t.personality}</h3>
                            <p className="text-stone-700 leading-relaxed">{result.personality}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8">
                                <h3 className="text-xl font-serif font-bold text-stone-900 mb-4">{t.lucky_colors}</h3>
                                <div className="flex flex-wrap gap-3">
                                    {result.luckyColors.map((color: string) => (
                                        <span key={color} className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-purple-700 font-medium">
                                            {color}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-lg p-8">
                                <h3 className="text-xl font-serif font-bold text-stone-900 mb-4">{t.lucky_numbers}</h3>
                                <div className="flex flex-wrap gap-3">
                                    {result.luckyNumbers.map((num: number) => (
                                        <span key={num} className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full text-amber-700 font-bold flex items-center justify-center text-lg">
                                            {num}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Save to Profile Section */}
                        <div className="mt-8">
                            {saveMessage && (
                                <div className={`mb-4 p-4 rounded-lg text-center animate-fade-in ${saveMessage.includes('✓')
                                    ? 'bg-green-50 border border-green-200 text-green-700'
                                    : 'bg-red-50 border border-red-200 text-red-700'
                                    }`}>
                                    {saveMessage}
                                </div>
                            )}

                            {user ? (
                                <div className="text-center">
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="px-8 py-3 bg-sage text-white rounded-lg font-medium hover:bg-sage/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                                    >
                                        {isSaving
                                            ? (lang === 'zh' ? '💾 保存中...' : '💾 Saving...')
                                            : (lang === 'zh' ? '💾 保存到个人资料' : '💾 Save to Profile')
                                        }
                                    </button>
                                    {saveMessage.includes('✓') && (
                                        <p className="mt-3 text-sm text-gray-600">
                                            <a href={`/${lang}/profile`} className="text-sage hover:underline">
                                                {lang === 'zh' ? '→ 在个人中心查看' : '→ View in Profile'}
                                            </a>
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center p-6 bg-amber-50 border-2 border-amber-200 rounded-xl">
                                    <p className="text-amber-800 font-medium mb-3">
                                        {lang === 'zh'
                                            ? '🔒 登录后可保存您的生日解读到个人资料'
                                            : '🔒 Login to save your birth analysis to profile'
                                        }
                                    </p>
                                    <a
                                        href={`/${lang}/auth/login`}
                                        className="inline-block px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                                    >
                                        {lang === 'zh' ? '立即登录' : 'Login Now'}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
