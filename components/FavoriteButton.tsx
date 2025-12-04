'use client'

import { useState, useTransition } from 'react'
import { toggleFavoriteAction } from '@/app/actions/interactions'

interface FavoriteButtonProps {
    pageId: string
    pageSlug: string
    initialFavorited: boolean
    dict?: any
}

export default function FavoriteButton({
    pageId,
    pageSlug,
    initialFavorited,
    dict,
}: FavoriteButtonProps) {
    const [favorited, setFavorited] = useState(initialFavorited)
    const [isPending, startTransition] = useTransition()

    const handleClick = () => {
        startTransition(async () => {
            // 乐观更新
            const wasFavorited = favorited
            setFavorited(!wasFavorited)

            const result = await toggleFavoriteAction(pageId, pageSlug)

            if (result.error) {
                // 回滚
                setFavorited(wasFavorited)
                alert(result.error)
            }
        })
    }

    const favoritedText = dict?.article?.favorited || 'Favorited'
    const favoriteText = dict?.article?.favorite || 'Favorite'

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${favorited
                ? 'bg-gold/10 text-gold hover:bg-gold/20'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } disabled:opacity-50`}
        >
            <svg
                className={`w-5 h-5 transition-transform ${favorited ? 'scale-110' : ''}`}
                fill={favorited ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
            </svg>
            <span className="font-medium">{favorited ? favoritedText : favoriteText}</span>
        </button>
    )
}
