'use client'

import { useState, useRef } from 'react'
// @ts-ignore - html2canvas types may not be available until package is installed
// import html2canvas from 'html2canvas'

interface PosterGeneratorProps {
    content: {
        title: string
        subtitle?: string
        data: any
        type: 'tool_result' | 'footprint' | 'post' | 'persona'
    }
    lang: 'zh' | 'en'
    onShare?: (shareCode: string, shareUrl: string) => void
}

export default function PosterGenerator({ content, lang, onShare }: PosterGeneratorProps) {
    const [generating, setGenerating] = useState(false)
    const [shareCode, setShareCode] = useState<string | null>(null)
    const posterRef = useRef<HTMLDivElement>(null)

    const generatePoster = async () => {
        setGenerating(true)
        try {
            // For now, create share record without generating image
            // Image generation will be implemented after html2canvas is installed
            const res = await fetch('/api/share/generate-poster', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contentType: content.type,
                    contentData: content.data
                })
            })

            if (res.ok) {
                const result = await res.json()
                setShareCode(result.data.shareCode)
                if (onShare) {
                    onShare(result.data.shareCode, result.data.shareUrl)
                }
            }

            // TODO: After installing html2canvas, uncomment this to generate actual poster image
            // if (!posterRef.current) return
            // const html2canvas = (await import('html2canvas')).default
            // const canvas = await html2canvas(posterRef.current, {
            //     backgroundColor: '#ffffff',
            //     scale: 2,
            //     logging: false
            // })
            // canvas.toBlob(async (blob: Blob | null) => {
            //     if (!blob) return
            //     // Upload to Supabase Storage and update poster_image_url
            // }, 'image/png')
        } catch (error) {
            console.error('Error generating poster:', error)
        } finally {
            setGenerating(false)
        }
    }

    return (
        <div>
            {/* Hidden poster template */}
            <div ref={posterRef} className="hidden">
                <div className="w-[800px] h-[1200px] bg-gradient-to-br from-sage/10 to-cream p-12 flex flex-col justify-between">
                    <div>
                        <h1 className="text-5xl font-bold text-sage mb-4">{content.title}</h1>
                        {content.subtitle && (
                            <p className="text-2xl text-gray-700 mb-8">{content.subtitle}</p>
                        )}
                        <div className="text-lg text-gray-600">
                            {JSON.stringify(content.data, null, 2)}
                        </div>
                    </div>
                    <div className="text-center text-gray-500 text-sm">
                        <p>Silk & Sage</p>
                        <p>silkandsage.co</p>
                    </div>
                </div>
            </div>

            {/* Generate button */}
            <button
                onClick={generatePoster}
                disabled={generating}
                className="px-6 py-3 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors disabled:opacity-50"
            >
                {generating
                    ? (lang === 'zh' ? '生成中...' : 'Generating...')
                    : (lang === 'zh' ? '生成海报' : 'Generate Poster')}
            </button>

            {shareCode && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                        {lang === 'zh' ? '海报已生成！' : 'Poster generated!'}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                        {lang === 'zh' ? '分享码：' : 'Share code: '}{shareCode}
                    </p>
                </div>
            )}
        </div>
    )
}

