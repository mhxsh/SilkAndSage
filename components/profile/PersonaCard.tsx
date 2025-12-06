'use client'

import { useState } from 'react'
import { UserPersona } from '@/types/footprint'
import { generateAndSavePersona, updatePersonaNotes } from '@/lib/actions/footprint'
import { useRouter } from 'next/navigation'

interface PersonaCardProps {
    persona: UserPersona | null
    lang: string
    userProfile: any // Basic user profile (username, email, etc.)
}

export default function PersonaCard({ persona, lang, userProfile }: PersonaCardProps) {
    const [currentPersona, setCurrentPersona] = useState(persona)
    const [isGenerating, setIsGenerating] = useState(false)
    const [showPromptInput, setShowPromptInput] = useState(false)
    const [prompt, setPrompt] = useState('')
    const [notes, setNotes] = useState(persona?.user_notes || '')
    const [isEditingNotes, setIsEditingNotes] = useState(false)
    const router = useRouter()

    const handleGenerate = async () => {
        setIsGenerating(true)
        // Pass extra context from profile if needed, though server action pulls DB directly.
        // We can just rely on the prompt from here.
        const res = await generateAndSavePersona(prompt, lang)
        setIsGenerating(false)
        if (res.success) {
            setShowPromptInput(false)
            router.refresh()
            window.location.reload() // Force reload to see new data immediately
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
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 mb-8 border-l-4 border-sage">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
                    🧬 {lang === 'zh' ? 'AI 灵性画像' : 'AI Spiritual Persona'}
                </h2>
                {!currentPersona && (
                    <button
                        onClick={() => setShowPromptInput(true)}
                        className="text-sm bg-sage text-white px-4 py-2 rounded-full hover:bg-sage/90 transition-colors"
                    >
                        {lang === 'zh' ? '生成画像' : 'Generate Persona'}
                    </button>
                )}
            </div>

            {!currentPersona ? (
                <div className="text-center py-8 bg-stone-50 rounded-lg">
                    <p className="text-gray-500 mb-4">
                        {lang === 'zh'
                            ? '暂无画像。AI 可以根据您的足迹和个人信息，为您生成专属的性格与灵性分析。'
                            : 'No persona yet. AI can generate a unique spiritual analysis based on your footprints and profile.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-sm text-slate-500 mb-1">
                                {new Date(currentPersona.created_at).toLocaleDateString()}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">
                                {currentPersona.persona_traits.personality_type || 'User Persona'}
                            </h3>
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
                            📝 {lang === 'zh' ? '深层解析' : 'Deep Analysis'}
                        </h4>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                            {currentPersona.analysis_text}
                        </p>
                    </div>

                    {/* Suggestions */}
                    <div className="bg-sage/10 p-5 rounded-lg border border-sage/20">
                        <h4 className="font-serif font-bold mb-2 flex items-center gap-2 text-sage-dark">
                            💡 {lang === 'zh' ? '灵性建议' : 'Guidance'}
                        </h4>
                        <p className="text-gray-800 leading-relaxed whitespace-pre-line text-sm">
                            {currentPersona.suggestions}
                        </p>
                    </div>

                    {/* User Notes */}
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium text-gray-600 text-sm">
                                {lang === 'zh' ? '我的备注' : 'My Notes'}
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
                            {lang === 'zh' ? '生成画像设置' : 'Persona Settings'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            {lang === 'zh'
                                ? 'AI 将结合你的足迹、生肖、星座等信息。你可以添加额外提示词：'
                                : 'AI combines your footprints, zodiac, and profile. Adding extra context:'}
                        </p>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={lang === 'zh' ? '例如：我最近在做重大职业选择...' : 'E.g., I am making a career choice...'}
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
        </div>
    )
}
