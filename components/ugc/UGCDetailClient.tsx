'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface UGCDetailClientProps {
    lang: 'zh' | 'en'
    postId: string
    dict: any
}

interface Post {
    id: string
    title: string
    content: string | null
    cover_image_url: string | null
    images: string[] | null
    post_type: string
    tags: string[] | null
    created_at: string
    view_count: number
    like_count: number
    comment_count: number
    user_id: string
    profiles: {
        id: string
        username: string
        full_name: string | null
    } | null
}

export default function UGCDetailClient({ lang, postId, dict }: UGCDetailClientProps) {
    const router = useRouter()
    const [post, setPost] = useState<Post | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPost()
    }, [postId])

    const fetchPost = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/ugc/posts/${postId}`)
            if (res.ok) {
                const result = await res.json()
                setPost(result.data)
            } else if (res.status === 404) {
                // Post not found
            }
        } catch (error) {
            console.error('Error fetching post:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-cream p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-cream p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <p className="text-gray-600 mb-4">
                            {lang === 'zh' ? '内容不存在' : 'Post not found'}
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

    const postTypeNames: Record<string, { zh: string; en: string }> = {
        buyer_show: { zh: '买家秀', en: 'Buyer Show' },
        outfit: { zh: '穿搭分享', en: 'Outfit' },
        review: { zh: '产品评价', en: 'Review' },
        inspiration: { zh: '灵感分享', en: 'Inspiration' },
        other: { zh: '其他', en: 'Other' }
    }

    return (
        <div className="min-h-screen bg-cream p-6">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <div className="mb-6">
                    <button
                        onClick={() => router.back()}
                        className="text-gray-500 hover:text-sage transition-colors flex items-center gap-2"
                    >
                        ← {lang === 'zh' ? '返回' : 'Back'}
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center">
                                <span className="text-sage font-semibold text-lg">
                                    {post.profiles?.username?.[0]?.toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">
                                    {post.profiles?.username || 'Anonymous'}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {new Date(post.created_at).toLocaleDateString(
                                        lang === 'zh' ? 'zh-CN' : 'en-US',
                                        { year: 'numeric', month: 'long', day: 'numeric' }
                                    )}
                                </p>
                            </div>
                            <div className="ml-auto">
                                <span className="px-3 py-1 bg-sage/10 text-sage rounded-full text-sm">
                                    {lang === 'zh' 
                                        ? postTypeNames[post.post_type]?.zh || post.post_type
                                        : postTypeNames[post.post_type]?.en || post.post_type}
                                </span>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {post.title}
                        </h1>
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {post.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {post.content && (
                            <div className="prose max-w-none mb-6">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {post.content}
                                </p>
                            </div>
                        )}

                        {/* Images */}
                        {post.cover_image_url && (
                            <div className="relative w-full h-96 mb-6 rounded-lg overflow-hidden">
                                <Image
                                    src={post.cover_image_url}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        {post.images && post.images.length > 0 && !post.cover_image_url && (
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {post.images.map((img, idx) => (
                                    <div key={idx} className="relative w-full h-64 rounded-lg overflow-hidden">
                                        <Image
                                            src={img}
                                            alt={`${post.title} ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-sm text-gray-500 pt-4 border-t border-gray-100">
                            <span>👁 {post.view_count || 0}</span>
                            <span>❤️ {post.like_count || 0}</span>
                            <span>💬 {post.comment_count || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

