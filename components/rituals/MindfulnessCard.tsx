'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface MindfulnessCardProps {
    lang: 'zh' | 'en'
    dict: any
}

interface TodayData {
    quote: {
        id: string
        text: string
        author: string | null
        element: string | null
    } | null
    greeting: {
        id: string
        text: string
        advice: string | null
        element: string | null
    } | null
    checkin: any
    hasCheckedIn: boolean
}

export default function MindfulnessCard({ lang, dict }: MindfulnessCardProps) {
    const [data, setData] = useState<TodayData | null>(null)
    const [loading, setLoading] = useState(true)
    const [mood, setMood] = useState<string>('')
    const [moodNote, setMoodNote] = useState('')
    const [saving, setSaving] = useState(false)
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        checkUser()
        fetchTodayData()
    }, [])

    const fetchTodayData = async () => {
        try {
            const res = await fetch(`/api/rituals/today?lang=${lang}`)
            const result = await res.json()
            setData(result)
            if (result.checkin) {
                setMood(result.checkin.mood || '')
                setMoodNote(result.checkin.mood_note || '')
            }
        } catch (error) {
            console.error('Error fetching today data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCheckin = async () => {
        if (!user) {
            window.location.href = `/${lang}/auth/login`
            return
        }

        setSaving(true)
        try {
            const res = await fetch('/api/rituals/checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mood: mood || null,
                    moodNote: moodNote || null,
                    morningGreetingId: data?.greeting?.id,
                    mindfulnessQuoteId: data?.quote?.id
                })
            })

            if (res.ok) {
                await fetchTodayData()
            }
        } catch (error) {
            console.error('Error saving checkin:', error)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
            </div>
        )
    }

    if (!data) return null

    const elementColors: Record<string, string> = {
        wood: 'text-green-600',
        fire: 'text-red-600',
        earth: 'text-yellow-600',
        metal: 'text-gray-600',
        water: 'text-blue-600'
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            {/* Quote Section */}
            {data.quote && (
                <div className="border-l-4 border-sage pl-4">
                    <p className="text-lg text-gray-800 italic mb-2">
                        "{data.quote.text}"
                    </p>
                    {data.quote.author && (
                        <p className="text-sm text-gray-600">
                            — {data.quote.author}
                        </p>
                    )}
                    {data.quote.element && (
                        <span className={`inline-block mt-2 text-xs px-2 py-1 rounded ${elementColors[data.quote.element] || 'text-gray-600'}`}>
                            {dict.elements[data.quote.element]}
                        </span>
                    )}
                </div>
            )}

            {/* Morning Greeting */}
            {data.greeting && (
                <div className="bg-cream rounded-lg p-4">
                    <h3 className="font-semibold text-sage mb-2">
                        {dict.rituals.morning.greeting} ✨
                    </h3>
                    <p className="text-gray-700 mb-2">{data.greeting.text}</p>
                    {data.greeting.advice && (
                        <p className="text-sm text-gray-600 italic">
                            {data.greeting.advice}
                        </p>
                    )}
                </div>
            )}

            {/* Check-in Section */}
            {user && (
                <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-semibold text-gray-800">
                        {dict.rituals.mindfulness.checkin_today}
                    </h4>

                    {/* Mood Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {dict.rituals.mindfulness.mood}
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {Object.entries(dict.rituals.mindfulness.mood_options).map(([key, label]) => (
                                <button
                                    key={key}
                                    onClick={() => setMood(key)}
                                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                                        mood === key
                                            ? 'bg-sage text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {label as string}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mood Note */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {dict.rituals.mindfulness.mood_note}
                        </label>
                        <textarea
                            value={moodNote}
                            onChange={(e) => setMoodNote(e.target.value)}
                            placeholder={dict.rituals.mindfulness.mood_note_placeholder}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                            rows={3}
                        />
                    </div>

                    {/* Check-in Button */}
                    <button
                        onClick={handleCheckin}
                        disabled={saving || data.hasCheckedIn}
                        className={`w-full py-3 rounded-lg font-medium transition-colors ${
                            data.hasCheckedIn
                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                : saving
                                ? 'bg-sage/70 text-white cursor-wait'
                                : 'bg-sage text-white hover:bg-sage/90'
                        }`}
                    >
                        {saving
                            ? dict.rituals.mindfulness.saving
                            : data.hasCheckedIn
                            ? dict.rituals.mindfulness.already_checked_in
                            : dict.rituals.mindfulness.checkin}
                    </button>
                </div>
            )}

            {!user && (
                <div className="text-center py-4">
                    <p className="text-gray-600 mb-4">{dict.rituals.login_required}</p>
                    <a
                        href={`/${lang}/auth/login`}
                        className="inline-block px-6 py-2 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors"
                    >
                        {dict.common.login}
                    </a>
                </div>
            )}
        </div>
    )
}

