'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface CirclePostsFeedProps {
    circleId: string
    lang: 'zh' | 'en'
    dict: any
    isMember: boolean
}

interface Post {
    id: string
    title: string
    content: string | null
    cover_image_url: string | null
    images: string[] | null
    post_type: string
    created_at: string
    view_count: number
    like_count: number
    comment_count: number
    profiles: {
        id: string
        username: string
        full_name: string | null
    } | null
}

export default function CirclePostsFeed({ circleId, lang, dict, isMember }: CirclePostsFeedProps) {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [hasMore, setHasMore] = useState(true)
    const [offset, setOffset] = useState(0)

    useEffect(() => {
        fetchPosts()
    }, [circleId])

    const fetchPosts = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/circles/${circleId}/posts?limit=20&offset=${offset}`)
            if (res.ok) {
                const result = await res.json()
                if (result.data) {
                    setPosts(prev => offset === 0 ? result.data : [...prev, ...result.data])
                    setHasMore(result.data.length === 20)
                }
            }
        } catch (error) {
            console.error('Error fetching posts:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadMore = () => {
        const newOffset = offset + 20
        setOffset(newOffset)
        fetchPosts()
    }

    if (loading && posts.length === 0) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 mb-4">
                    {lang === 'zh' ? '还没有动态，快来发布第一条吧！' : 'No posts yet. Be the first to share!'}
                </p>
                {isMember && (
                    <Link
                        href={`/${lang}/ugc/create?circle=${circleId}`}
                        className="inline-block px-6 py-2 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors"
                    >
                        {lang === 'zh' ? '发布动态' : 'Create Post'}
                    </Link>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Post Header */}
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center">
                                <span className="text-sage font-semibold">
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
                        </div>
                    </div>

                    {/* Post Content */}
                    <Link href={`/${lang}/ugc/${post.id}`}>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-sage transition-colors">
                                {post.title}
                            </h3>
                            {post.content && (
                                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                    {post.content}
                                </p>
                            )}
                            
                            {/* Images */}
                            {post.cover_image_url && (
                                <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
                                    <Image
                                        src={post.cover_image_url}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            {post.images && post.images.length > 0 && !post.cover_image_url && (
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    {post.images.slice(0, 4).map((img, idx) => (
                                        <div key={idx} className="relative w-full h-32 rounded-lg overflow-hidden">
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

                            {/* Post Stats */}
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>👁 {post.view_count || 0}</span>
                                <span>❤️ {post.like_count || 0}</span>
                                <span>💬 {post.comment_count || 0}</span>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}

            {/* Load More */}
            {hasMore && (
                <div className="text-center">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        {loading
                            ? (lang === 'zh' ? '加载中...' : 'Loading...')
                            : (lang === 'zh' ? '加载更多' : 'Load More')}
                    </button>
                </div>
            )}
        </div>
    )
}

