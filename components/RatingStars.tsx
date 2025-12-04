'use client'

import { useState, useTransition } from 'react'

interface RatingStarsProps {
    pageId: string
    pageSlug: string
    initialRating: number
    userRating: number | null
}

export default function RatingStars({
    pageId,
    pageSlug,
    initialRating,
    userRating,
}: RatingStarsProps) {
    const [hoverRating, setHoverRating] = useState(0)
    const [currentRating, setCurrentRating] = useState(userRating || 0)
    const [isPending, startTransition] = useTransition()

    const handleRate = async (rating: number) => {
        startTransition(async () => {
            setCurrentRating(rating)

            try {
                const response = await fetch('/api/rate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pageId, rating, pageSlug }),
                })

                if (!response.ok) {
                    const data = await response.json()
                    throw new Error(data.error || '评分失败')
                }
            } catch (error: any) {
                alert(error.message)
                setCurrentRating(userRating || 0)
            }
        })
    }

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => handleRate(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        disabled={isPending}
                        className="transition-transform hover:scale-110 disabled:opacity-50"
                    >
                        <svg
                            className={`w-8 h-8 transition-colors ${star <= (hoverRating || currentRating)
                                    ? 'fill-gold text-gold'
                                    : 'fill-none text-gray-300'
                                }`}
                            viewBox="0 0 20 20"
                            stroke="currentColor"
                            strokeWidth={1}
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </button>
                ))}
            </div>
            <div className="text-sm text-gray-600">
                {currentRating > 0 ? (
                    <span>你的评分: {currentRating} 星</span>
                ) : (
                    <span>点击星星进行评分</span>
                )}
            </div>
            <div className="text-xs text-gray-500">
                平均评分: {initialRating.toFixed(1)} 星
            </div>
        </div>
    )
}
