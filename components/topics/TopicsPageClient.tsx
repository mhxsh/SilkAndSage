'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface TopicsPageClientProps {
    lang: 'zh' | 'en'
    dict: any
}

interface Topic {
    id: string
    name: string
    slug: string
    description_zh: string | null
    description_en: string | null
    icon: string | null
    type: string
    is_featured: boolean
    participant_count: number
    post_count: number
}

export default function TopicsPageClient({ lang, dict }: TopicsPageClientProps) {
    const [topics, setTopics] = useState<Topic[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<string>('all')

    useEffect(() => {
        fetchTopics()
    }, [filter])

    const fetchTopics = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (filter !== 'all') {
                params.append('type', filter)
            }
            if (filter === 'all') {
                params.append('featured', 'true')
            }
            const res = await fetch(`/api/topics?${params.toString()}`)
            const result = await res.json()
            setTopics(result.data || [])
        } catch (error) {
            console.error('Error fetching topics:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-cream p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                                <div className="h-20 bg-gray-200 rounded"></div>
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
                        {dict.topics.title}
                    </h1>
                    <p className="text-gray-600">
                        {dict.topics.trending}
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-6 flex gap-4 flex-wrap">
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
                        onClick={() => setFilter('challenge')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            filter === 'challenge'
                                ? 'bg-sage text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {lang === 'zh' ? '挑战' : 'Challenges'}
                    </button>
                    <button
                        onClick={() => setFilter('wish')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            filter === 'wish'
                                ? 'bg-sage text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {lang === 'zh' ? '许愿' : 'Wishes'}
                    </button>
                    <button
                        onClick={() => setFilter('discussion')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            filter === 'discussion'
                                ? 'bg-sage text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {lang === 'zh' ? '讨论' : 'Discussions'}
                    </button>
                </div>

                {/* Topics Grid */}
                {topics.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <p className="text-gray-600 text-lg">
                            {dict.topics.no_topics}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {topics.map((topic) => (
                            <Link
                                key={topic.id}
                                href={`/${lang}/topics/${topic.slug}`}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start gap-3 mb-4">
                                    {topic.icon && (
                                        <span className="text-3xl">{topic.icon}</span>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                            #{topic.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm line-clamp-2">
                                            {lang === 'zh' ? topic.description_zh : topic.description_en}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                                    <span>
                                        {dict.topics.participant_count.replace('{count}', topic.participant_count.toString())}
                                    </span>
                                    <span>
                                        {dict.topics.post_count.replace('{count}', topic.post_count.toString())}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

