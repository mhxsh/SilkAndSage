'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import TopicPostsFeed from './TopicPostsFeed'

interface TopicDetailClientProps {
    lang: 'zh' | 'en'
    slug: string
    dict: any
}

interface TopicDetail {
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
    isFollowing: boolean
}

export default function TopicDetailClient({ lang, slug, dict }: TopicDetailClientProps) {
    const [topic, setTopic] = useState<TopicDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [following, setFollowing] = useState(false)
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        checkUser()
        fetchTopic()
    }, [slug])

    const fetchTopic = async () => {
        setLoading(true)
        try {
            // Use slug as id parameter (API supports both ID and slug)
            const res = await fetch(`/api/topics/${slug}`)
            if (res.ok) {
                const result = await res.json()
                setTopic(result)
                setFollowing(result.isFollowing || false)
            }
        } catch (error) {
            console.error('Error fetching topic:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleFollow = async () => {
        if (!user) {
            window.location.href = `/${lang}/auth/login`
            return
        }

        if (!topic) return

        const action = following ? 'DELETE' : 'POST'
        try {
            const res = await fetch(`/api/topics/${topic.id}/follow`, {
                method: action
            })
            if (res.ok) {
                setFollowing(!following)
            }
        } catch (error) {
            console.error('Error toggling follow:', error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-cream p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!topic) {
        return (
            <div className="min-h-screen bg-cream p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <p className="text-gray-600">{dict.topics.error}</p>
                        <Link href={`/${lang}/topics`} className="text-sage hover:underline mt-4 inline-block">
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
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            {topic.icon && (
                                <span className="text-5xl">{topic.icon}</span>
                            )}
                            <div>
                                <h1 className="text-3xl font-bold text-sage mb-2">
                                    #{topic.name}
                                </h1>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                    <span>
                                        {dict.topics.participant_count.replace('{count}', topic.participant_count.toString())}
                                    </span>
                                    <span>
                                        {dict.topics.post_count.replace('{count}', topic.post_count.toString())}
                                    </span>
                                </div>
                                {topic.description_zh && (
                                    <p className="text-gray-700">
                                        {lang === 'zh' ? topic.description_zh : topic.description_en}
                                    </p>
                                )}
                            </div>
                        </div>
                        {user && (
                            <button
                                onClick={handleFollow}
                                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                    following
                                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        : 'bg-sage text-white hover:bg-sage/90'
                                }`}
                            >
                                {following ? dict.topics.unfollow : dict.topics.follow}
                            </button>
                        )}
                    </div>
                </div>

                {/* Posts Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {dict.topics.posts}
                        </h2>
                        {user && (
                            <Link
                                href={`/${lang}/ugc/create?topic=${topic.id}`}
                                className="px-4 py-2 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors text-sm"
                            >
                                {lang === 'zh' ? '+ 发布内容' : '+ Create Post'}
                            </Link>
                        )}
                    </div>
                    <TopicPostsFeed 
                        topicId={topic.id} 
                        lang={lang} 
                        dict={dict}
                    />
                </div>

                {/* Back Link */}
                <div className="mt-6 text-center">
                    <Link
                        href={`/${lang}/topics`}
                        className="text-sage hover:underline"
                    >
                        ← {lang === 'zh' ? '返回话题列表' : 'Back to Topics'}
                    </Link>
                </div>
            </div>
        </div>
    )
}

