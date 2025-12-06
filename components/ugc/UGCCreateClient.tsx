'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import ImageUpload from './ImageUpload'
import CircleSelector from './CircleSelector'
import TopicSelector from './TopicSelector'

interface UGCCreateClientProps {
    lang: 'zh' | 'en'
    initialCircle?: string
    initialTopic?: string
    dict: any
}

export default function UGCCreateClient({ lang, initialCircle, initialTopic, dict }: UGCCreateClientProps) {
    const router = useRouter()
    const supabase = createClient()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        postType: 'buyer_show' as 'buyer_show' | 'outfit' | 'review' | 'inspiration' | 'other',
        images: [] as string[],
        coverImageUrl: '',
        selectedCircle: initialCircle || '',
        selectedTopics: initialTopic ? [initialTopic] : [] as string[],
        tags: [] as string[]
    })

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            if (!user) {
                router.push(`/${lang}/auth/login`)
            }
            setLoading(false)
        }
        checkUser()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        if (!formData.title.trim()) {
            alert(lang === 'zh' ? '请输入标题' : 'Please enter a title')
            return
        }

        setSubmitting(true)
        try {
            // Create post
            const res = await fetch('/api/ugc/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: formData.title,
                    content: formData.content || null,
                    postType: formData.postType,
                    images: formData.images,
                    coverImageUrl: formData.coverImageUrl || formData.images[0] || null,
                    tags: formData.tags
                })
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || 'Failed to create post')
            }

            const result = await res.json()
            const postId = result.data.id

            // Associate with circle if selected
            if (formData.selectedCircle) {
                await fetch(`/api/circles/${formData.selectedCircle}/posts`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ postId })
                })
            }

            // Associate with topics if selected
            if (formData.selectedTopics.length > 0) {
                await Promise.all(
                    formData.selectedTopics.map(topicId =>
                        fetch(`/api/topics/${topicId}/posts`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ postId })
                        })
                    )
                )
            }

            // Redirect based on where user came from
            if (formData.selectedCircle) {
                router.push(`/${lang}/circles/${formData.selectedCircle}`)
            } else if (formData.selectedTopics.length > 0) {
                router.push(`/${lang}/topics/${formData.selectedTopics[0]}`)
            } else {
                router.push(`/${lang}/ugc/${postId}`)
            }
        } catch (error: any) {
            console.error('Error creating post:', error)
            alert(lang === 'zh' ? `发布失败: ${error.message}` : `Failed to create post: ${error.message}`)
        } finally {
            setSubmitting(false)
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

    if (!user) {
        return null
    }

    return (
        <div className="min-h-screen bg-cream p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-sage mb-2">
                        {lang === 'zh' ? '发布内容' : 'Create Post'}
                    </h1>
                    <p className="text-gray-600">
                        {lang === 'zh' ? '分享你的穿搭、买家秀或灵感' : 'Share your outfit, buyer show, or inspiration'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {lang === 'zh' ? '标题 *' : 'Title *'}
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder={lang === 'zh' ? '给你的内容起个标题...' : 'Give your post a title...'}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {lang === 'zh' ? '内容' : 'Content'}
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder={lang === 'zh' ? '分享你的想法、感受或搭配心得...' : 'Share your thoughts, feelings, or styling tips...'}
                            rows={6}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Post Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {lang === 'zh' ? '内容类型' : 'Post Type'}
                        </label>
                        <select
                            value={formData.postType}
                            onChange={(e) => setFormData({ ...formData, postType: e.target.value as any })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                        >
                            <option value="buyer_show">{lang === 'zh' ? '买家秀' : 'Buyer Show'}</option>
                            <option value="outfit">{lang === 'zh' ? '穿搭分享' : 'Outfit'}</option>
                            <option value="review">{lang === 'zh' ? '产品评价' : 'Review'}</option>
                            <option value="inspiration">{lang === 'zh' ? '灵感分享' : 'Inspiration'}</option>
                            <option value="other">{lang === 'zh' ? '其他' : 'Other'}</option>
                        </select>
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {lang === 'zh' ? '图片' : 'Images'}
                        </label>
                        <ImageUpload
                            onUploadComplete={(urls) => {
                                setFormData({
                                    ...formData,
                                    images: urls,
                                    coverImageUrl: urls[0] || ''
                                })
                            }}
                            maxImages={9}
                            lang={lang}
                        />
                    </div>

                    {/* Circle Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {lang === 'zh' ? '发布到圈子（可选）' : 'Post to Circle (Optional)'}
                        </label>
                        <CircleSelector
                            value={formData.selectedCircle}
                            onChange={(circleId) => setFormData({ ...formData, selectedCircle: circleId })}
                            lang={lang}
                            dict={dict}
                        />
                    </div>

                    {/* Topic Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {lang === 'zh' ? '关联话题（可选）' : 'Associate Topics (Optional)'}
                        </label>
                        <TopicSelector
                            value={formData.selectedTopics}
                            onChange={(topicIds) => setFormData({ ...formData, selectedTopics: topicIds })}
                            lang={lang}
                            dict={dict}
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {lang === 'zh' ? '标签（用逗号分隔）' : 'Tags (comma-separated)'}
                        </label>
                        <input
                            type="text"
                            value={formData.tags.join(', ')}
                            onChange={(e) => {
                                const tags = e.target.value.split(',').map(t => t.trim()).filter(t => t)
                                setFormData({ ...formData, tags })
                            }}
                            placeholder={lang === 'zh' ? '例如: 穿搭, 日常, 简约' : 'e.g., outfit, daily, minimal'}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                        />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-6 py-3 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors disabled:opacity-50"
                        >
                            {submitting
                                ? (lang === 'zh' ? '发布中...' : 'Publishing...')
                                : (lang === 'zh' ? '发布' : 'Publish')}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            {lang === 'zh' ? '取消' : 'Cancel'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

