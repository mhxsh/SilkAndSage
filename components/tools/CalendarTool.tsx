'use client'

import { useState } from 'react'
import { Lunar, Solar } from 'lunar-javascript'

interface CalendarToolProps {
    dict: any
    lang: string
}

// 天干翻译
const HEAVENLY_STEMS: Record<string, string> = {
    '甲': 'Jia', '乙': 'Yi', '丙': 'Bing', '丁': 'Ding',
    '戊': 'Wu', '己': 'Ji', '庚': 'Geng', '辛': 'Xin',
    '壬': 'Ren', '癸': 'Gui'
}

// 地支翻译
const EARTHLY_BRANCHES: Record<string, string> = {
    '子': 'Zi', '丑': 'Chou', '寅': 'Yin', '卯': 'Mao',
    '辰': 'Chen', '巳': 'Si', '午': 'Wu', '未': 'Wei',
    '申': 'Shen', '酉': 'You', '戌': 'Xu', '亥': 'Hai'
}

// 生肖翻译
const ZODIAC_TRANSLATION: Record<string, string> = {
    '鼠': 'Rat', '牛': 'Ox', '虎': 'Tiger', '兔': 'Rabbit',
    '龙': 'Dragon', '蛇': 'Snake', '马': 'Horse', '羊': 'Goat',
    '猴': 'Monkey', '鸡': 'Rooster', '狗': 'Dog', '猪': 'Pig'
}

// 农历月份翻译
const LUNAR_MONTH: Record<string, string> = {
    '正': '1st', '二': '2nd', '三': '3rd', '四': '4th',
    '五': '5th', '六': '6th', '七': '7th', '八': '8th',
    '九': '9th', '十': '10th', '冬': '11th', '腊': '12th'
}

// 农历日期翻译
const LUNAR_DAY: Record<string, string> = {
    '初一': '1st', '初二': '2nd', '初三': '3rd', '初四': '4th', '初五': '5th',
    '初六': '6th', '初七': '7th', '初八': '8th', '初九': '9th', '初十': '10th',
    '十一': '11th', '十二': '12th', '十三': '13th', '十四': '14th', '十五': '15th',
    '十六': '16th', '十七': '17th', '十八': '18th', '十九': '19th', '二十': '20th',
    '廿一': '21st', '廿二': '22nd', '廿三': '23rd', '廿四': '24th', '廿五': '25th',
    '廿六': '26th', '廿七': '27th', '廿八': '28th', '廿九': '29th', '三十': '30th'
}

// 二十四节气翻译
const SOLAR_TERMS: Record<string, string> = {
    '立春': 'Start of Spring',
    '雨水': 'Rain Water',
    '惊蛰': 'Awakening of Insects',
    '春分': 'Spring Equinox',
    '清明': 'Pure Brightness',
    '谷雨': 'Grain Rain',
    '立夏': 'Start of Summer',
    '小满': 'Grain Buds',
    '芒种': 'Grain in Ear',
    '夏至': 'Summer Solstice',
    '小暑': 'Slight Heat',
    '大暑': 'Great Heat',
    '立秋': 'Start of Autumn',
    '处暑': 'End of Heat',
    '白露': 'White Dew',
    '秋分': 'Autumn Equinox',
    '寒露': 'Cold Dew',
    '霜降': 'Descent of Frost',
    '立冬': 'Start of Winter',
    '小雪': 'Slight Snow',
    '大雪': 'Great Snow',
    '冬至': 'Winter Solstice',
    '小寒': 'Slight Cold',
    '大寒': 'Great Cold'
}

export default function CalendarTool({ dict, lang }: CalendarToolProps) {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [lunarInfo, setLunarInfo] = useState<any>(null)

    const t = dict.tools.calendar

    // 翻译天干地支
    const translateGanZhi = (ganZhi: string): string => {
        if (lang === 'zh') return ganZhi
        let result = ganZhi
        Object.entries(HEAVENLY_STEMS).forEach(([zh, en]) => {
            result = result.replace(zh, en)
        })
        Object.entries(EARTHLY_BRANCHES).forEach(([zh, en]) => {
            result = result.replace(zh, en)
        })
        return result
    }

    // 翻译生肖
    const translateZodiac = (zodiac: string): string => {
        if (lang === 'zh') return zodiac
        return ZODIAC_TRANSLATION[zodiac] || zodiac
    }

    // 翻译农历月
    const translateLunarMonth = (month: string): string => {
        if (lang === 'zh') return month
        const monthChar = month.replace('月', '').replace('闰', '')
        const isLeap = month.includes('闰')
        const translated = LUNAR_MONTH[monthChar] || month
        return isLeap ? `Leap ${translated}` : translated
    }

    // 翻译农历日
    const translateLunarDay = (day: string): string => {
        if (lang === 'zh') return day
        return LUNAR_DAY[day] || day
    }

    // 翻译节气
    const translateSolarTerm = (term: string): string => {
        if (lang === 'zh') return term
        return SOLAR_TERMS[term] || term
    }

    // 格式化完整农历日期
    const formatLunarDate = (lunar: any): string => {
        if (lang === 'zh') {
            return lunar.toString()
        }

        // 英文格式：Year of Rat, 1st Month, 15th
        const yearGanZhi = translateGanZhi(lunar.getYearInGanZhi())
        const zodiac = translateZodiac(lunar.getYearShengXiao())
        const month = translateLunarMonth(lunar.getMonthInChinese())
        const day = translateLunarDay(lunar.getDayInChinese())

        return `Year of ${zodiac} (${yearGanZhi}), ${month} Month, ${day}`
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = new Date(e.target.value)
        setSelectedDate(date)
        calculateLunarData(date)
    }

    const calculateLunarData = (date: Date) => {
        const solar = Solar.fromDate(date)
        const lunar = solar.getLunar()

        const ganZhiYear = lunar.getYearInGanZhi()
        const lunarMonth = lunar.getMonthInChinese()
        const lunarDay = lunar.getDayInChinese()
        const zodiac = lunar.getYearShengXiao()

        // 格式化公历日期 - 根据语言
        const locale = lang === 'zh' ? 'zh-CN' : 'en-US'
        const dateOptions: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }
        const formattedSolarDate = date.toLocaleDateString(locale, dateOptions)

        const info = {
            solarDate: formattedSolarDate,
            lunarDate: formatLunarDate(lunar),
            yearInChinese: translateGanZhi(ganZhiYear) + (lang === 'zh' ? '年' : ''),
            monthInChinese: translateLunarMonth(lunarMonth) + (lang === 'zh' ? '' : ' Month'),
            dayInChinese: translateLunarDay(lunarDay),
            zodiac: translateZodiac(zodiac),
            solarTerm: lunar.getCurrentJieQi(),
            nextSolarTerm: lunar.getNextJie(),
            festivals: [...lunar.getFestivals(), ...lunar.getOtherFestivals()]
        }

        setLunarInfo(info)
    }

    useState(() => {
        calculateLunarData(selectedDate)
    })

    return (
        <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-stone-900 mb-4">
                        📅 {t.title}
                    </h1>
                    <p className="text-lg text-stone-600">
                        {t.subtitle}
                    </p>
                </div>

                {/* Date Picker */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                        {t.select_date}
                    </label>
                    <input
                        type="date"
                        value={selectedDate.toISOString().split('T')[0]}
                        onChange={handleDateChange}
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage"
                    />
                </div>

                {/* Lunar Info Display */}
                {lunarInfo && (
                    <div className="space-y-6">
                        {/* Main Info Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="text-sm text-stone-500 mb-1">{t.gregorian}</div>
                                    <div className="text-2xl font-bold text-stone-900">{lunarInfo.solarDate}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-stone-500 mb-1">{t.lunar}</div>
                                    <div className="text-xl font-bold text-sage">{lunarInfo.lunarDate}</div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-stone-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="text-sm text-stone-500 mb-1">{t.lunar_year}</div>
                                    <div className="text-lg font-semibold text-stone-900">{lunarInfo.yearInChinese}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-stone-500 mb-1">{t.zodiac}</div>
                                    <div className="text-lg font-semibold text-stone-900">{lunarInfo.zodiac}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-stone-500 mb-1">{t.lunar_month}</div>
                                    <div className="text-lg font-semibold text-stone-900">{lunarInfo.monthInChinese}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-stone-500 mb-1">{t.lunar_day}</div>
                                    <div className="text-lg font-semibold text-stone-900">{lunarInfo.dayInChinese}</div>
                                </div>
                            </div>
                        </div>

                        {/* Solar Terms Card */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8">
                            <h3 className="text-xl font-serif font-bold text-stone-900 mb-4 flex items-center gap-2">
                                <span>🌿</span>
                                {t.solar_terms}
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {lunarInfo.solarTerm && lunarInfo.solarTerm.getName() && (
                                    <div>
                                        <div className="text-sm text-stone-600 mb-1">{t.current_term}</div>
                                        <div className="text-lg font-semibold text-emerald-700">
                                            {translateSolarTerm(lunarInfo.solarTerm.getName())}
                                        </div>
                                    </div>
                                )}
                                {lunarInfo.nextSolarTerm && lunarInfo.nextSolarTerm.getName() && (
                                    <div>
                                        <div className="text-sm text-stone-600 mb-1">{t.next_term}</div>
                                        <div className="text-lg font-semibold text-emerald-700">
                                            {translateSolarTerm(lunarInfo.nextSolarTerm.getName())}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Festivals Card */}
                        {lunarInfo.festivals && lunarInfo.festivals.length > 0 && (
                            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg p-8">
                                <h3 className="text-xl font-serif font-bold text-stone-900 mb-4 flex items-center gap-2">
                                    <span>🎊</span>
                                    {t.festivals}
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {lunarInfo.festivals.map((festival: string, index: number) => (
                                        <span
                                            key={index}
                                            className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-red-700 font-medium shadow-sm"
                                        >
                                            {festival}
                                        </span>
                                    ))}
                                </div>
                                {lang === 'en' && (
                                    <p className="text-sm text-stone-600 mt-4 italic">
                                        * Festival names shown in Chinese
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
