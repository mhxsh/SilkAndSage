'use client'

import { useState, useTransition } from 'react'
import { toggleLikeAction } from '@/app/actions/interactions'

interface LikeButtonProps {
    targetId: string
    targetType: 'comment' | 'page'
    initialLiked: boolean
    initialCount: number
    pageSlug?: string
}

export default function LikeButton({
    targetId,
    targetType,
    initialLiked,
    initialCount,
    pageSlug,
}: LikeButtonProps) {
    const [liked, setLiked] = useState(initialLiked)
    const [count, setCount] = useState(initialCount)
    const [isPending, startTransition] = useTransition()

    const handleClick = () => {
        startTransition(async () => {
            // 乐观更新
            const wasLiked = liked
            const prevCount = count

            setLiked(!wasLiked)
            setCount(wasLiked ? count - 1 : count + 1)

            const result = await toggleLikeAction(targetId, targetType, pageSlug)

            if (result.error) {
                // 回滚
                setLiked(wasLiked)
                setCount(prevCount)
                alert(result.error)
            }
        })
    }

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${liked
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } disabled:opacity-50`}
        >
            <svg
                className={`w-5 h-5 transition-transform ${liked ? 'scale-110' : ''}`}
                fill={liked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
            <span className="font-medium">{count}</span>
        </button>
    )
}
