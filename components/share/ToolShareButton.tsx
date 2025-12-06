'use client'

import { useState } from 'react'
import PosterGenerator from './PosterGenerator'

interface ToolShareButtonProps {
    toolName: string
    toolResult: any
    lang: 'zh' | 'en'
    dict: any
}

export default function ToolShareButton({ toolName, toolResult, lang, dict }: ToolShareButtonProps) {
    const [showPosterGenerator, setShowPosterGenerator] = useState(false)
    const [shareCode, setShareCode] = useState<string | null>(null)
    const [shareUrl, setShareUrl] = useState<string | null>(null)

    const toolNames: Record<string, { zh: string; en: string }> = {
        color_harmony: { zh: '色彩搭配', en: 'Color Harmony' },
        mood_healing: { zh: '情绪疗愈', en: 'Mood Healing' },
        pattern_harmony: { zh: '纹理图案', en: 'Pattern Harmony' },
        fortune: { zh: '每日运势', en: 'Daily Fortune' },
        birthday: { zh: '生日解读', en: 'Birthday Analysis' },
        quiz: { zh: '五行测试', en: 'Element Quiz' }
    }

    const toolTitle = toolNames[toolName] 
        ? (lang === 'zh' ? toolNames[toolName].zh : toolNames[toolName].en)
        : toolName

    const handleShare = (code: string, url: string) => {
        setShareCode(code)
        setShareUrl(url)
    }

    const copyShareLink = async () => {
        if (shareUrl) {
            await navigator.clipboard.writeText(shareUrl)
            alert(lang === 'zh' ? '分享链接已复制！' : 'Share link copied!')
        }
    }

    return (
        <div className="space-y-4">
            <button
                onClick={() => setShowPosterGenerator(!showPosterGenerator)}
                className="flex items-center gap-2 px-6 py-3 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                </svg>
                <span>{lang === 'zh' ? '生成分享海报' : 'Generate Share Poster'}</span>
            </button>

            {showPosterGenerator && (
                <div className="bg-white rounded-lg shadow-md p-6 border-2 border-sage/20">
                    <PosterGenerator
                        content={{
                            title: toolTitle,
                            subtitle: lang === 'zh' ? '我的工具结果' : 'My Tool Result',
                            data: toolResult,
                            type: 'tool_result'
                        }}
                        lang={lang}
                        onShare={handleShare}
                    />
                </div>
            )}

            {shareCode && shareUrl && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800 mb-2">
                        {lang === 'zh' ? '✅ 海报已生成！' : '✅ Poster generated!'}
                    </p>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={shareUrl}
                            readOnly
                            className="flex-1 px-3 py-2 bg-white border border-green-300 rounded text-sm"
                        />
                        <button
                            onClick={copyShareLink}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                        >
                            {lang === 'zh' ? '复制' : 'Copy'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

