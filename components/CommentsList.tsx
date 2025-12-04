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
}

function CommentItem({
    comment,
    pageId,
    pageSlug,
    currentUserId,
    isReply = false,
}: {
    comment: Comment
    pageId: string
    pageSlug: string
    currentUserId?: string
    isReply?: boolean
}) {
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [deleting, setDeleting] = useState(false)

    // Handle missing user data
    if (!comment.user) {
        return (
            <div className={isReply ? 'ml-12' : ''}>
                <div className="text-gray-500 italic py-2">
                    评论用户已删除或不存在
                </div>
            </div>
        )
    }

    const handleDelete = async () => {
        if (!confirm('确定要删除这条评论吗？')) return

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

        if (seconds < 60) return '刚刚'
        if (seconds < 3600) return `${Math.floor(seconds / 60)} 分钟前`
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} 小时前`
        if (seconds < 604800) return `${Math.floor(seconds / 86400)} 天前`
        return commentDate.toLocaleDateString('zh-CN')
    }

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
                                回复
                            </button>
                        )}

                        {currentUserId === comment.user?.id && (
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="text-sm text-red-600 hover:text-red-500 disabled:opacity-50"
                            >
                                {deleting ? '删除中...' : '删除'}
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
                                placeholder={`回复 @${comment.user.username}...`}
                                buttonText="发送回复"
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
}: CommentsListProps) {
    return (
        <div className="space-y-6">
            {comments.length === 0 ? (
                <p className="text-center text-gray-500 py-8">暂无评论，来发表第一条评论吧！</p>
            ) : (
                comments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        pageId={pageId}
                        pageSlug={pageSlug}
                        currentUserId={currentUserId}
                    />
                ))
            )}
        </div>
    )
}
