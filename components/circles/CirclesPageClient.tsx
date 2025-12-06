'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface CirclesPageClientProps {
    lang: 'zh' | 'en'
    dict: any
}

interface Circle {
    id: string
    name_zh: string
    name_en: string
    slug: string
    type: string
    type_value: string | null
    description_zh: string | null
    description_en: string | null
    cover_image_url: string | null
    member_count: number
    post_count: number
    is_public: boolean
}

export default function CirclesPageClient({ lang, dict }: CirclesPageClientProps) {
    const [circles, setCircles] = useState<Circle[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<string>('all') // 'all', 'element', 'mbti'
    const supabase = createClient()

    useEffect(() => {
        fetchCircles()
    }, [filter])

    const fetchCircles = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (filter !== 'all') {
                params.append('type', filter)
            }
            const res = await fetch(`/api/circles?${params.toString()}`)
            const result = await res.json()
            setCircles(result.data || [])
        } catch (error) {
            console.error('Error fetching circles:', error)
        } finally {
            setLoading(false)
        }
    }

    const elementColors: Record<string, string> = {
        wood: 'bg-green-100 text-green-800 border-green-300',
        fire: 'bg-red-100 text-red-800 border-red-300',
        earth: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        metal: 'bg-gray-100 text-gray-800 border-gray-300',
        water: 'bg-blue-100 text-blue-800 border-blue-300'
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-cream p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-cream p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-sage mb-4">
                        {dict.circles.title}
                    </h1>
                    <p className="text-gray-600">
                        {dict.circles.discover}
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-6 flex gap-4">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            filter === 'all'
                                ? 'bg-sage text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {lang === 'zh' ? '全部' : 'All'}
                    </button>
                    <button
                        onClick={() => setFilter('element')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            filter === 'element'
                                ? 'bg-sage text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {dict.circles.type.element}
                    </button>
                    <button
                        onClick={() => setFilter('mbti')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            filter === 'mbti'
                                ? 'bg-sage text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {dict.circles.type.mbti}
                    </button>
                </div>

                {/* Circles Grid */}
                {circles.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <p className="text-gray-600 text-lg">
                            {dict.circles.no_circles}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {circles.map((circle) => (
                            <Link
                                key={circle.id}
                                href={`/${lang}/circles/${circle.slug}`}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                            >
                                {circle.cover_image_url && (
                                    <img
                                        src={circle.cover_image_url}
                                        alt={lang === 'zh' ? circle.name_zh : circle.name_en}
                                        className="w-full h-32 object-cover rounded-lg mb-4"
                                    />
                                )}
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {lang === 'zh' ? circle.name_zh : circle.name_en}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {lang === 'zh' ? circle.description_zh : circle.description_en}
                                </p>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>
                                        {dict.circles.member_count.replace('{count}', circle.member_count.toString())}
                                    </span>
                                    <span>
                                        {dict.circles.post_count.replace('{count}', circle.post_count.toString())}
                                    </span>
                                </div>
                                {circle.type_value && circle.type === 'element' && (
                                    <div className={`mt-3 inline-block px-3 py-1 rounded-full text-xs border ${
                                        elementColors[circle.type_value] || 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {dict.elements[circle.type_value]}
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

