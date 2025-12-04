'use client'

import { useState } from 'react'
import { postComment } from '@/app/actions/interactions'

interface CommentFormProps {
    pageId: string
    pageSlug: string
    parentId?: string
    onSuccess?: () => void
    dict?: any
}

export default function CommentForm({
    pageId,
    pageSlug,
    parentId,
    onSuccess,
    dict,
}: CommentFormProps) {
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const placeholder = dict?.article?.write_comment || 'Write a comment...'
    const buttonText = dict?.article?.submit_comment || 'Post'
    const loadingText = dict?.common?.loading || 'Posting...'
    const emptyError = dict?.article?.comment_empty || 'Comment cannot be empty'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!content.trim()) {
            setError(emptyError)
            return
        }

        setLoading(true)
        setError(null)

        const result = await postComment(pageId, pageSlug, content.trim(), parentId)

        if (result.error) {
            setError(result.error)
        } else {
            setContent('')
            onSuccess?.()
        }

        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent resize-none"
                disabled={loading}
            />

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading || !content.trim()}
                    className="px-6 py-2 bg-sage text-white rounded-lg hover:bg-sage/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? loadingText : buttonText}
                </button>
            </div>
        </form>
    )
}
