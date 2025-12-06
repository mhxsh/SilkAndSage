'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface SharePageClientProps {
    lang: 'zh' | 'en'
    shareCode: string
    dict: any
}

interface ShareContent {
    id: string
    content_type: string
    content_data: any
    poster_image_url: string | null
    view_count: number
    created_at: string
}

export default function SharePageClient({ lang, shareCode, dict }: SharePageClientProps) {
    const [content, setContent] = useState<ShareContent | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchShareContent()
    }, [shareCode])

    const fetchShareContent = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/share/${shareCode}`)
            if (res.ok) {
                const result = await res.json()
                setContent(result.data)
            }
        } catch (error) {
            console.error('Error fetching share content:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-cream p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!content) {
        return (
            <div className="min-h-screen bg-cream p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <p className="text-gray-600 mb-4">
                            {lang === 'zh' ? '分享内容不存在或已失效' : 'Share content not found or expired'}
                        </p>
                        <Link
                            href={`/${lang}`}
                            className="text-sage hover:underline"
                        >
                            {dict.common.back_home}
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-cream p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-sage mb-2">
                            {lang === 'zh' ? '分享内容' : 'Shared Content'}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {lang === 'zh' ? '查看次数' : 'Views'}: {content.view_count}
                        </p>
                    </div>

                    {/* Poster Image */}
                    {content.poster_image_url && (
                        <div className="mb-6">
                            <img
                                src={content.poster_image_url}
                                alt="Shared poster"
                                className="w-full rounded-lg"
                            />
                        </div>
                    )}

                    {/* Content Data */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">
                            {lang === 'zh' ? '内容详情' : 'Content Details'}
                        </h3>
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                            {JSON.stringify(content.content_data, null, 2)}
                        </pre>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex gap-4 justify-center">
                        <Link
                            href={`/${lang}`}
                            className="px-6 py-2 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors"
                        >
                            {dict.common.back_home}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

