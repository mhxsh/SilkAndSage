'use client'

import { useState } from 'react'
import { FootprintLog, UserPersona } from '@/types/footprint'
import { deleteFootprint, generateAndSavePersona, updatePersonaNotes } from '@/lib/actions/footprint'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface FootprintSectionProps {
    footprints: FootprintLog[]
    persona: UserPersona | null
    lang: string
}

function ResultRenderer({ log, lang }: { log: FootprintLog; lang: string }) {
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
    if (log.tool_name === 'Daily Fortune') {
        const d = data as any
        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-purple-600">{d.zodiac}</span>
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">{d.date}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>{lang === 'zh' ? '综合' : 'Overall'}: {renderStars(d.overall)}</div>
                    <div>{lang === 'zh' ? '财运' : 'Wealth'}: {renderStars(d.wealth)}</div>
                    <div className="col-span-2 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.luckyColor === 'Gold' ? '#FFD700' : d.luckyColor }}></span>
                        <span>{d.luckyColor}</span>
                    </div>
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
        const element = d.element || d.result?.element // Handle different structures

        return (
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center text-lg font-bold text-sage">
                    {element && (lang === 'zh' ? element[0] : element[0])}
                </div>
                <div>
                    <div className="font-medium text-gray-800">
                        {d.chineseZodiac || d.chinese_zodiac} {d.zodiacSign || d.zodiac_sign}
                    </div>
                    <div className="text-xs text-gray-500 flex gap-1">
                        {d.personalityTraits?.slice(0, 3).map((t: string, i: number) => (
                            <span key={i} className="bg-gray-100 px-1 rounded">{t}</span>
                        ))}
                    </div>
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

export default function FootprintSection({ footprints, persona, lang }: FootprintSectionProps) {
    const [activeTab, setActiveTab] = useState<'timeline' | 'persona'>('timeline')
    const [logs, setLogs] = useState(footprints)
    const [currentPersona, setCurrentPersona] = useState(persona)
    const [isGenerating, setIsGenerating] = useState(false)
    const [showPromptInput, setShowPromptInput] = useState(false)
    const [prompt, setPrompt] = useState('')
    const [notes, setNotes] = useState(persona?.user_notes || '')
    const [isEditingNotes, setIsEditingNotes] = useState(false)
    const router = useRouter()

    const handleDelete = async (id: string) => {
        if (!confirm(lang === 'zh' ? '确定删除这条记录吗？' : 'Delete this record?')) return
        const res = await deleteFootprint(id)
        if (res.success) {
            setLogs(logs.filter(l => l.id !== id))
        }
    }

    const handleGenerate = async () => {
        setIsGenerating(true)
        const res = await generateAndSavePersona(prompt)
        setIsGenerating(false)
        if (res.success) {
            setShowPromptInput(false)
            router.refresh() // Refresh to get new persona data
            // In a real app we'd probably optimistically update or fetch the new one here
            window.location.reload()
        } else {
            alert('Generation failed: ' + res.error)
        }
    }

    const handleSaveNotes = async () => {
        if (!currentPersona) return
        await updatePersonaNotes(currentPersona.id, notes)
        setIsEditingNotes(false)
        router.refresh()
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-100">
                <button
                    onClick={() => setActiveTab('timeline')}
                    className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'timeline'
                        ? 'text-sage border-b-2 border-sage bg-sage/5'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    {lang === 'zh' ? '足迹记录' : 'Footprints'}
                </button>
                <button
                    onClick={() => setActiveTab('persona')}
                    className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'persona'
                        ? 'text-sage border-b-2 border-sage bg-sage/5'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    {lang === 'zh' ? 'AI 画像' : 'AI Persona'}
                </button>
            </div>

            <div className="p-6">
                <AnimatePresence mode="wait">
                    {activeTab === 'timeline' ? (
                        <motion.div
                            key="timeline"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-4"
                        >
                            {logs.length === 0 ? (
                                <div className="text-center py-10 text-gray-400">
                                    {lang === 'zh' ? '暂无使用记录' : 'No records found'}
                                </div>
                            ) : (
                                logs.map(log => (
                                    <div key={log.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow relative group">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="inline-block px-2 py-1 rounded bg-stone-100 text-stone-600 text-xs font-medium mb-2">
                                                    {log.tool_name}
                                                </span>
                                                <div className="text-sm text-gray-500 mb-2">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(log.id)}
                                                className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        <details className="text-sm text-gray-600">
                                            <summary className="cursor-pointer hover:text-sage transition-colors select-none">
                                                {lang === 'zh' ? '查看详情' : 'View Details'}
                                            </summary>
                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <ResultRenderer log={log} lang={lang} />
                                            </div>
                                        </details>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="persona"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {!currentPersona ? (
                                <div className="text-center py-10">
                                    <div className="text-6xl mb-4">🧬</div>
                                    <h3 className="text-xl font-serif mb-2">
                                        {lang === 'zh' ? '生成你的专属画像' : 'Generate Your Persona'}
                                    </h3>
                                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                        {lang === 'zh'
                                            ? 'AI 将根据你的足迹记录，分析你的性格特质并提供建议。'
                                            : 'AI will analyze your footprints to generate a personality profile and suggestions.'}
                                    </p>
                                    <button
                                        onClick={() => setShowPromptInput(true)}
                                        className="bg-sage text-white px-6 py-2 rounded-full hover:bg-sage/90 transition-colors"
                                    >
                                        {lang === 'zh' ? '开始生成' : 'Start Generation'}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-sm text-slate-500 mb-1">
                                                {new Date(currentPersona.created_at).toLocaleDateString()}
                                            </div>
                                            <h2 className="text-2xl font-serif font-bold text-gray-800">
                                                {currentPersona.persona_traits.personality_type || 'User Persona'}
                                            </h2>
                                        </div>
                                        <button
                                            onClick={() => setShowPromptInput(true)}
                                            className="text-sage text-sm hover:underline"
                                        >
                                            {lang === 'zh' ? '重新生成' : 'Regenerate'}
                                        </button>
                                    </div>

                                    {/* Traits */}
                                    <div className="flex flex-wrap gap-2">
                                        {currentPersona.persona_traits.keywords?.map((k, i) => (
                                            <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                                                {k}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Analysis */}
                                    <div className="bg-stone-50 p-5 rounded-lg border border-stone-100">
                                        <h4 className="font-serif font-bold mb-2 flex items-center gap-2">
                                            📝 {lang === 'zh' ? '性格分析' : 'Analysis'}
                                        </h4>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                            {currentPersona.analysis_text}
                                        </p>
                                    </div>

                                    {/* Suggestions */}
                                    <div className="bg-sage/10 p-5 rounded-lg border border-sage/20">
                                        <h4 className="font-serif font-bold mb-2 flex items-center gap-2 text-sage-dark">
                                            💡 {lang === 'zh' ? '建议' : 'Suggestions'}
                                        </h4>
                                        <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                                            {currentPersona.suggestions}
                                        </p>
                                    </div>

                                    {/* User Notes */}
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-medium text-gray-600">
                                                {lang === 'zh' ? '备注 / 修改' : 'Notes / Adjustments'}
                                            </h4>
                                            {!isEditingNotes && (
                                                <button
                                                    onClick={() => setIsEditingNotes(true)}
                                                    className="text-xs text-gray-400 hover:text-gray-600"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </div>
                                        {isEditingNotes ? (
                                            <div className="space-y-2">
                                                <textarea
                                                    value={notes}
                                                    onChange={(e) => setNotes(e.target.value)}
                                                    className="w-full p-2 border rounded-md text-sm focus:ring-1 focus:ring-sage focus:outline-none"
                                                    rows={3}
                                                />
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => setIsEditingNotes(false)}
                                                        className="px-3 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleSaveNotes}
                                                        className="px-3 py-1 text-xs bg-sage text-white rounded"
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">
                                                {currentPersona.user_notes || (lang === 'zh' ? '暂无备注' : 'No notes')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Prompt Modal Overlay */}
                            {showPromptInput && (
                                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                                        <h3 className="font-serif text-lg font-bold mb-4">
                                            {lang === 'zh' ? '生成设置' : 'Generation Settings'}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            {lang === 'zh'
                                                ? '你可以添加一些额外的提示词，帮助 AI 更准确地生成画像。'
                                                : 'Add extra prompts to help AI generate a more accurate persona.'}
                                        </p>
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder={lang === 'zh' ? '例如：我最近比较关注职场发展...' : 'E.g., I am focusing on career growth...'}
                                            className="w-full p-3 border rounded-md mb-4 focus:ring-2 focus:ring-sage/50 outline-none"
                                            rows={4}
                                        />
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => setShowPromptInput(false)}
                                                className="px-4 py-2 text-gray-500 hover:bg-gray-50 rounded"
                                                disabled={isGenerating}
                                            >
                                                {lang === 'zh' ? '取消' : 'Cancel'}
                                            </button>
                                            <button
                                                onClick={handleGenerate}
                                                className="px-4 py-2 bg-sage text-white rounded hover:bg-sage/90 disabled:opacity-50 flex items-center"
                                                disabled={isGenerating}
                                            >
                                                {isGenerating && <span className="animate-spin mr-2">⏳</span>}
                                                {lang === 'zh' ? '开始生成' : 'Generate'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
