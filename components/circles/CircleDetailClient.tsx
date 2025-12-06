'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import CirclePostsFeed from './CirclePostsFeed'

interface CircleDetailClientProps {
    lang: 'zh' | 'en'
    slug: string
    dict: any
}

interface CircleDetail {
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
    isMember: boolean
}

export default function CircleDetailClient({ lang, slug, dict }: CircleDetailClientProps) {
    const [circle, setCircle] = useState<CircleDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [joining, setJoining] = useState(false)
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        checkUser()
        fetchCircle()
    }, [slug])

    const fetchCircle = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/circles/${slug}`)
            if (res.ok) {
                const result = await res.json()
                setCircle(result)
            }
        } catch (error) {
            console.error('Error fetching circle:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleJoin = async () => {
        if (!user) {
            window.location.href = `/${lang}/auth/login`
            return
        }

        if (!circle) return

        setJoining(true)
        try {
            const res = await fetch(`/api/circles/${circle.id}/join`, {
                method: 'POST'
            })
            if (res.ok) {
                await fetchCircle()
            }
        } catch (error) {
            console.error('Error joining circle:', error)
        } finally {
            setJoining(false)
        }
    }

    const handleLeave = async () => {
        if (!circle) return

        setJoining(true)
        try {
            const res = await fetch(`/api/circles/${circle.id}/leave`, {
                method: 'POST'
            })
            if (res.ok) {
                await fetchCircle()
            }
        } catch (error) {
            console.error('Error leaving circle:', error)
        } finally {
            setJoining(false)
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

    if (!circle) {
        return (
            <div className="min-h-screen bg-cream p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <p className="text-gray-600">{dict.circles.error}</p>
                        <Link href={`/${lang}/circles`} className="text-sage hover:underline mt-4 inline-block">
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
                    {circle.cover_image_url && (
                        <img
                            src={circle.cover_image_url}
                            alt={lang === 'zh' ? circle.name_zh : circle.name_en}
                            className="w-full h-64 object-cover rounded-lg mb-6"
                        />
                    )}
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-sage mb-2">
                                {lang === 'zh' ? circle.name_zh : circle.name_en}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                <span>
                                    {dict.circles.member_count.replace('{count}', circle.member_count.toString())}
                                </span>
                                <span>
                                    {dict.circles.post_count.replace('{count}', circle.post_count.toString())}
                                </span>
                            </div>
                            {circle.description_zh && (
                                <p className="text-gray-700">
                                    {lang === 'zh' ? circle.description_zh : circle.description_en}
                                </p>
                            )}
                        </div>
                        {user && (
                            <button
                                onClick={circle.isMember ? handleLeave : handleJoin}
                                disabled={joining}
                                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                    circle.isMember
                                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        : 'bg-sage text-white hover:bg-sage/90'
                                } ${joining ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {joining
                                    ? (lang === 'zh' ? '处理中...' : 'Processing...')
                                    : circle.isMember
                                    ? dict.circles.leave
                                    : dict.circles.join}
                            </button>
                        )}
                    </div>
                </div>

                {/* Posts Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {dict.circles.posts}
                        </h2>
                        {user && circle.isMember && (
                            <Link
                                href={`/${lang}/ugc/create?circle=${circle.id}`}
                                className="px-4 py-2 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors text-sm"
                            >
                                {lang === 'zh' ? '+ 发布动态' : '+ Create Post'}
                            </Link>
                        )}
                    </div>
                    <CirclePostsFeed 
                        circleId={circle.id} 
                        lang={lang} 
                        dict={dict}
                        isMember={circle.isMember}
                    />
                </div>

                {/* Back Link */}
                <div className="mt-6 text-center">
                    <Link
                        href={`/${lang}/circles`}
                        className="text-sage hover:underline"
                    >
                        ← {lang === 'zh' ? '返回圈子列表' : 'Back to Circles'}
                    </Link>
                </div>
            </div>
        </div>
    )
}

