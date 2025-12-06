'use client'

import { useState } from 'react'
import { FootprintLog } from '@/types/footprint'
import { deleteFootprint } from '@/lib/actions/footprint'
import { useRouter } from 'next/navigation'

interface FootprintResultRendererProps {
    log: FootprintLog
    lang: string
}

function ResultRenderer({ log, lang }: FootprintResultRendererProps) {
    const data = log.output_result
    if (!data) return null

    // Helper for stars
    const renderStars = (score: number) => (
        <span className="text-yellow-500">
            {'★'.repeat(Math.round(score || 0))}
            <span className="text-gray-300">{'★'.repeat(5 - Math.round(score || 0))}</span>
        </span>
    )

    // 1. Daily Fortune
    if (log.tool_name === 'Daily Fortune' || log.tool_name === 'fortune_history') {
        const d = data as any
        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-purple-600">{d.zodiac}</span>
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">{d.date || d.viewed_at?.split('T')[0]}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>{lang === 'zh' ? '综合' : 'Overall'}: {renderStars(d.overall)}</div>
                    <div>{lang === 'zh' ? '财运' : 'Wealth'}: {renderStars(d.wealth)}</div>
                    {d.luckyColor && (
                        <div className="col-span-2 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.luckyColor === 'Gold' ? '#FFD700' : d.luckyColor }}></span>
                            <span>{d.luckyColor}</span>
                        </div>
                    )}
                </div>
                <p className="text-xs text-gray-500 italic">"{d.advice}"</p>
            </div>
        )
    }

    // 2. Color Harmony
    if (log.tool_name === 'Color Harmony') {
        const d = data as any
        return (
            <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                    {d.palette?.map((c: any, i: number) => (
                        <div key={i} className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full shadow-sm border border-gray-100" style={{ backgroundColor: c.hex }} title={c.usage}></div>
                            <span className="text-[10px] text-gray-500 mt-1 max-w-[60px] truncate">{c.name}</span>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">{d.advice}</p>
            </div>
        )
    }

    // 3. Pattern Harmony
    if (log.tool_name === 'Pattern Harmony') {
        const d = data as any
        return (
            <div className="space-y-2">
                <div className="grid grid-cols-1 gap-2">
                    {d.recommendations?.map((r: any, i: number) => (
                        <div key={i} className="text-xs bg-stone-50 p-2 rounded flex items-start gap-2">
                            <span className="bg-stone-200 text-stone-600 px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap">
                                {r.type}
                            </span>
                            <div>
                                <span className="font-medium text-stone-800">{r.name}</span>
                                <p className="text-gray-500 mt-0.5">{r.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {d.advice && <p className="text-xs text-gray-500 italic">"{d.advice}"</p>}
            </div>
        )
    }

    // 4. Mood Healing
    if (log.tool_name === 'Mood Healing') {
        const d = data as any
        return (
            <div className="space-y-2 bg-blue-50/50 p-2 rounded">
                <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-blue-800">{d.analysis}</p>
                    {d.lucky_color && (
                        <div className="flex flex-col items-end">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: d.lucky_color.hex }}></div>
                            <span className="text-[10px] text-blue-400">{d.lucky_color.name}</span>
                        </div>
                    )}
                </div>
                <p className="text-xs text-blue-600">💡 {d.suggestion}</p>
                <div className="text-[10px] text-blue-400 italic text-right">—— {d.quote}</div>
            </div>
        )
    }

    // 5. Element Quiz & Birthday
    if (log.tool_name === 'Element Quiz' || log.tool_name === 'Birthday Analysis') {
        const d = data as any
        // Check if it is a quiz result or birthday result (structure similar)
        // Log generic objects to debug if needed, but here we try multiple paths
        // In app/api/quiz/submit/route.ts, output_result is just result string e.g. "wood".
        // So 'data' might be the string itself if logged directly, but usually log.output_result is JSONB.
        // If it's a string in JSONB, it parses as string.
        let element = typeof data === 'string' ? data : (d.element || d.result?.element || d.element_type)
        if (!element && d.input_context) {
            // Fallback
        }

        const zodiac = d.chineseZodiac || d.chinese_zodiac || d.zodiac_sign || d.zodiac // Normalize zodiac keys

        return (
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center text-lg font-bold text-sage">
                    {element && (lang === 'zh' ? element[0] : element[0])}
                </div>
                <div>
                    <div className="font-medium text-gray-800">
                        {/* Display Element Name nicely */}
                        {lang === 'zh'
                            ? ({ 'wood': '木', 'fire': '火', 'earth': '土', 'metal': '金', 'water': '水' }[element as string] || element)
                            : (element && element.charAt(0).toUpperCase() + element.slice(1))
                        }
                        {/* Only show Zodiac if available (Birthday Analysis) */}
                        {zodiac && ` - ${zodiac}`}
                    </div>
                    {d.personalityTraits && (
                        <div className="text-xs text-gray-500 flex gap-1">
                            {d.personalityTraits?.slice(0, 3).map((t: string, i: number) => (
                                <span key={i} className="bg-gray-100 px-1 rounded">{t}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // Default Fallback
    return (
        <div className="bg-gray-50 p-2 rounded overflow-auto max-h-40">
            <pre className="text-xs text-gray-500 whitespace-pre-wrap font-mono">
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    )
}

interface FootprintListProps {
    footprints: FootprintLog[]
    lang: string
}

export default function FootprintList({ footprints, lang }: FootprintListProps) {
    const [logs, setLogs] = useState(footprints)
    const router = useRouter()

    const handleDelete = async (id: string) => {
        if (!confirm(lang === 'zh' ? '确定删除这条记录吗？' : 'Delete this record?')) return
        const res = await deleteFootprint(id)
        if (res.success) {
            setLogs(logs.filter(l => l.id !== id))
            router.refresh()
        }
    }

    const toolNameMap: Record<string, string> = {
        'Daily Fortune': '每日运势',
        'fortune_history': '运势历史',
        'Color Harmony': '色彩搭配',
        'Pattern Harmony': '纹理图案',
        'Mood Healing': '情绪疗愈',
        'Element Quiz': '五行测试',
        'Birthday Analysis': '生日解读'
    }

    const getTranslatedToolName = (name: string) => {
        if (lang === 'zh') {
            return toolNameMap[name] || name
        }
        return name === 'fortune_history' ? 'Fortune History' : name // normalize internal name
    }

    return (
        <div className="space-y-4">
            {logs.length === 0 ? (
                <div className="text-center py-10 text-gray-400 bg-white rounded-lg shadow-sm">
                    {lang === 'zh' ? '暂无使用记录' : 'No records found'}
                </div>
            ) : (
                <div className="grid gap-4">
                    {logs.map(log => (
                        <div key={log.id} className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow relative group">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="inline-block px-2.5 py-1 rounded-full bg-sage/10 text-sage text-xs font-semibold">
                                        {getTranslatedToolName(log.tool_name)}
                                    </span>
                                    <div className="text-xs text-gray-400">
                                        {new Date(log.created_at).toLocaleString()}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(log.id)}
                                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                    title={lang === 'zh' ? '删除' : 'Delete'}
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="pt-2 border-t border-gray-50">
                                <ResultRenderer log={log} lang={lang} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
