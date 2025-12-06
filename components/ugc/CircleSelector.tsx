'use client'

import { useState, useEffect } from 'react'

interface CircleSelectorProps {
    value: string
    onChange: (circleId: string) => void
    lang: 'zh' | 'en'
    dict: any
}

interface Circle {
    id: string
    name_zh: string
    name_en: string
    type: string
    member_count: number
}

export default function CircleSelector({ value, onChange, lang, dict }: CircleSelectorProps) {
    const [circles, setCircles] = useState<Circle[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCircles()
    }, [])

    const fetchCircles = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/circles?limit=50')
            if (res.ok) {
                const result = await res.json()
                setCircles(result.data || [])
            }
        } catch (error) {
            console.error('Error fetching circles:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                <span className="text-gray-500 text-sm">{lang === 'zh' ? '加载中...' : 'Loading...'}</span>
            </div>
        )
    }

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
        >
            <option value="">{lang === 'zh' ? '不发布到圈子' : 'Don\'t post to circle'}</option>
            {circles.map((circle) => (
                <option key={circle.id} value={circle.id}>
                    {lang === 'zh' ? circle.name_zh : circle.name_en} ({circle.member_count} {lang === 'zh' ? '成员' : 'members'})
                </option>
            ))}
        </select>
    )
}

