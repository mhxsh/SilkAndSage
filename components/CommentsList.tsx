'use client'

import { useState } from 'react'
import CommentForm from './CommentForm'
import { removeComment } from '@/app/actions/interactions'

interface Comment {
    id: string
    content: string
    created_at: string
    user_id?: string
    user?: {
        id: string
        username: string
    } | null
    replies?: Comment[]
}

interface CommentsListProps {
    comments: Comment[]
    pageId: string
    pageSlug: string
    currentUserId?: string
    dict?: any
}

function CommentItem({
    comment,
    pageId,
    pageSlug,
    currentUserId,
    isReply = false,
    dict,
}: {
    comment: Comment
    pageId: string
    pageSlug: string
    currentUserId?: string
    isReply?: boolean
    dict?: any
}) {
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [deleting, setDeleting] = useState(false)

    // Handle missing user data
    if (!comment.user) {
        return (
            <div className={isReply ? 'ml-12' : ''}>
                <div className="text-gray-500 italic py-2">
                    {dict?.article?.user_deleted || 'User deleted or not found'}
                </div>
            </div>
        )
    }

    const handleDelete = async () => {
        const confirmMessage = dict?.article?.confirm_delete || 'Are you sure you want to delete this comment?'
        if (!confirm(confirmMessage)) return

        setDeleting(true)
        const result = await removeComment(comment.id, pageSlug)

        if (result.error) {
            alert(result.error)
            setDeleting(false)
        }
    }

    const timeAgo = (date: string) => {
        const now = new Date()
        const commentDate = new Date(date)
        const seconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000)

        if (seconds < 60) return dict?.article?.time_just_now || 'Just now'
        if (seconds < 3600) return `${Math.floor(seconds / 60)} ${dict?.article?.time_minutes_ago || 'minutes ago'}`
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} ${dict?.article?.time_hours_ago || 'hours ago'}`
        if (seconds < 604800) return `${Math.floor(seconds / 86400)} ${dict?.article?.time_days_ago || 'days ago'}`

        // Format date based on locale
        const locale = dict?.article?.locale || 'en-US'
        return commentDate.toLocaleDateString(locale)
    }

    const replyText = dict?.article?.reply || 'Reply'
    const deleteText = dict?.article?.delete || 'Delete'
    const deletingText = dict?.article?.deleting || 'Deleting...'

    return (
        <div className={`${isReply ? 'ml-12' : ''} ${deleting ? 'opacity-50' : ''}`}>
            <div className="flex gap-4">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center">
                        <span className="text-sage font-semibold">
                            {comment.user.username[0].toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{comment.user.username}</span>
                        <span className="text-sm text-gray-500">{timeAgo(comment.created_at)}</span>
                    </div>

                    <p className="text-gray-700 whitespace-pre-wrap break-words">{comment.content}</p>

                    <div className="flex items-center gap-4 mt-2">
                        {!isReply && (
                            <button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="text-sm text-sage hover:text-sage/80"
                            >
                                {replyText}
                            </button>
                        )}

                        {currentUserId === comment.user?.id && (
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="text-sm text-red-600 hover:text-red-500 disabled:opacity-50"
                            >
                                {deleting ? deletingText : deleteText}
                            </button>
                        )}
                    </div>

                    {showReplyForm && !isReply && (
                        <div className="mt-4">
                            <CommentForm
                                pageId={pageId}
                                pageSlug={pageSlug}
                                parentId={comment.id}
                                onSuccess={() => setShowReplyForm(false)}
                                dict={dict}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* 回复列表 */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 space-y-4">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            pageId={pageId}
                            pageSlug={pageSlug}
                            currentUserId={currentUserId}
                            isReply
                            dict={dict}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default function CommentsList({
    comments,
    pageId,
    pageSlug,
    currentUserId,
    dict,
}: CommentsListProps) {
    const noCommentsText = dict?.article?.no_comments || 'No comments yet. Be the first to comment!'

    return (
        <div className="space-y-6">
            {comments.length === 0 ? (
                <p className="text-center text-gray-500 py-8">{noCommentsText}</p>
            ) : (
                comments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        pageId={pageId}
                        pageSlug={pageSlug}
                        currentUserId={currentUserId}
                        dict={dict}
                    />
                ))
            )}
        </div>
    )
}
