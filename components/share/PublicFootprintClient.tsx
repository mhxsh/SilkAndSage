'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface PublicFootprintClientProps {
    lang: 'zh' | 'en'
    username: string
    dict: any
}

interface PublicProfile {
    username: string
    bio: string | null
    avatar: string | null
    element: string | null
}

interface Footprint {
    id: string
    tool_name: string
    input_context: any
    output_result: any
    created_at: string
}

export default function PublicFootprintClient({ lang, username, dict }: PublicFootprintClientProps) {
    const [profile, setProfile] = useState<PublicProfile | null>(null)
    const [footprints, setFootprints] = useState<Footprint[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPublicFootprints()
    }, [username])

    const fetchPublicFootprints = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/footprints/public/${username}?lang=${lang}`)
            if (res.ok) {
                const result = await res.json()
                setProfile(result.profile)
                setFootprints(result.footprints || [])
            }
        } catch (error) {
            console.error('Error fetching public footprints:', error)
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

    if (!profile) {
        return (
            <div className="min-h-screen bg-cream p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <p className="text-gray-600 mb-4">
                            {lang === 'zh' ? '用户不存在或足迹未公开' : 'User not found or footprints not public'}
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

    const toolNames: Record<string, string> = {
        color_harmony: lang === 'zh' ? '色彩搭配' : 'Color Harmony',
        mood_healing: lang === 'zh' ? '情绪疗愈' : 'Mood Healing',
        pattern_harmony: lang === 'zh' ? '纹理图案' : 'Pattern Harmony',
        fortune: lang === 'zh' ? '每日运势' : 'Daily Fortune',
        birthday: lang === 'zh' ? '生日解读' : 'Birthday Analysis',
        quiz: lang === 'zh' ? '五行测试' : 'Element Quiz'
    }

    return (
        <div className="min-h-screen bg-cream p-6">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                    <div className="flex items-center gap-6">
                        {profile.avatar ? (
                            <img
                                src={profile.avatar}
                                alt={profile.username}
                                className="w-20 h-20 rounded-full"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-sage/10 flex items-center justify-center">
                                <span className="text-3xl font-bold text-sage">
                                    {profile.username[0]?.toUpperCase() || 'U'}
                                </span>
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                {profile.username}
                            </h1>
                            {profile.bio && (
                                <p className="text-gray-600">{profile.bio}</p>
                            )}
                            {profile.element && (
                                <span className="inline-block mt-2 px-3 py-1 bg-sage/10 text-sage rounded-full text-sm">
                                    {dict.elements[profile.element]}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footprints */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        {lang === 'zh' ? '灵性足迹' : 'Spiritual Footprints'}
                    </h2>

                    {footprints.length === 0 ? (
                        <p className="text-gray-600 text-center py-8">
                            {lang === 'zh' ? '还没有足迹记录' : 'No footprints yet'}
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {footprints.map((footprint) => (
                                <div
                                    key={footprint.id}
                                    className="border-l-4 border-sage pl-4 py-3 hover:bg-gray-50 transition-colors rounded-r"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-sage">
                                            {toolNames[footprint.tool_name] || footprint.tool_name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(footprint.created_at).toLocaleDateString(
                                                lang === 'zh' ? 'zh-CN' : 'en-US'
                                            )}
                                        </span>
                                    </div>
                                    {footprint.output_result && (
                                        <div className="text-sm text-gray-700 mt-2">
                                            {typeof footprint.output_result === 'string'
                                                ? footprint.output_result
                                                : JSON.stringify(footprint.output_result, null, 2)}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Back Link */}
                <div className="mt-6 text-center">
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

