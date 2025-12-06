'use client'

import { useState, useEffect } from 'react'

interface TopicSelectorProps {
    value: string[]
    onChange: (topicIds: string[]) => void
    lang: 'zh' | 'en'
    dict: any
}

interface Topic {
    id: string
    name_zh: string
    name_en: string
    slug: string
    type: string
    post_count: number
}

export default function TopicSelector({ value, onChange, lang, dict }: TopicSelectorProps) {
    const [topics, setTopics] = useState<Topic[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTopics()
    }, [])

    const fetchTopics = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/topics?limit=50')
            if (res.ok) {
                const result = await res.json()
                setTopics(result.data || [])
            }
        } catch (error) {
            console.error('Error fetching topics:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleToggle = (topicId: string) => {
        if (value.includes(topicId)) {
            onChange(value.filter(id => id !== topicId))
        } else {
            onChange([...value, topicId])
        }
    }

    if (loading) {
        return (
            <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                <span className="text-gray-500 text-sm">{lang === 'zh' ? '加载中...' : 'Loading...'}</span>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                    <button
                        key={topic.id}
                        type="button"
                        onClick={() => handleToggle(topic.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            value.includes(topic.id)
                                ? 'bg-sage text-white hover:bg-sage/90'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        #{lang === 'zh' ? topic.name_zh : topic.name_en}
                        {value.includes(topic.id) && ' ✓'}
                    </button>
                ))}
            </div>
            {value.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                    {lang === 'zh' ? `已选择 ${value.length} 个话题` : `${value.length} topic(s) selected`}
                </p>
            )}
        </div>
    )
}

