'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface CheckinPageClientProps {
    lang: 'zh' | 'en'
    dict: any
}

interface CheckinStats {
    total_checkins: number
    current_streak: number
    longest_streak: number
    last_checkin_date: string | null
}

export default function CheckinPageClient({ lang, dict }: CheckinPageClientProps) {
    const [user, setUser] = useState<any>(null)
    const [stats, setStats] = useState<CheckinStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [calendarData, setCalendarData] = useState<Record<string, any>>({})
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            if (user) {
                fetchStats()
                fetchCalendar()
            } else {
                setLoading(false)
            }
        }
        checkUser()
    }, [])

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/rituals/checkin/stats')
            const result = await res.json()
            setStats(result.data)
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchCalendar = async () => {
        try {
            const today = new Date()
            const year = today.getFullYear()
            const month = today.getMonth() + 1
            const res = await fetch(`/api/rituals/checkin/calendar?year=${year}&month=${month}`)
            const result = await res.json()
            setCalendarData(result.data || {})
        } catch (error) {
            console.error('Error fetching calendar:', error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-cream p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-cream p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <p className="text-gray-600 mb-4">{dict.rituals.login_required}</p>
                        <Link
                            href={`/${lang}/auth/login`}
                            className="inline-block px-6 py-2 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors"
                        >
                            {dict.common.login}
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-cream p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold text-sage mb-2">
                        {dict.rituals.checkin.title}
                    </h1>
                    <p className="text-gray-600">
                        {dict.rituals.checkin.stats.total}: {stats?.total_checkins || 0}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-sm text-gray-600 mb-2">
                            {dict.rituals.checkin.stats.total}
                        </h3>
                        <p className="text-3xl font-bold text-sage">
                            {stats?.total_checkins || 0}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-sm text-gray-600 mb-2">
                            {dict.rituals.checkin.stats.current_streak}
                        </h3>
                        <p className="text-3xl font-bold text-sage">
                            {stats?.current_streak || 0} {dict.rituals.checkin.stats.days}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-sm text-gray-600 mb-2">
                            {dict.rituals.checkin.stats.longest_streak}
                        </h3>
                        <p className="text-3xl font-bold text-sage">
                            {stats?.longest_streak || 0} {dict.rituals.checkin.stats.days}
                        </p>
                    </div>
                </div>

                {/* Calendar */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        {dict.rituals.checkin.calendar.title}
                    </h2>
                    <CalendarView data={calendarData} dict={dict} />
                </div>

                {/* Back Link */}
                <div className="text-center">
                    <Link
                        href={`/${lang}`}
                        className="text-sage hover:underline"
                    >
                        ← {dict.common.back_home}
                    </Link>
                </div>
            </div>
        </div>
    )
}

function CalendarView({ data, dict }: { data: Record<string, any>, dict: any }) {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null)
    }
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        days.push({
            day,
            date: dateStr,
            checked: !!data[dateStr]
        })
    }

    return (
        <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {['日', '一', '二', '三', '四', '五', '六'].map((day, idx) => (
                <div key={idx} className="text-center text-sm font-semibold text-gray-600 py-2">
                    {day}
                </div>
            ))}
            {/* Calendar days */}
            {days.map((item, idx) => {
                if (!item) {
                    return <div key={idx} className="aspect-square"></div>
                }
                const isToday = item.date === today.toISOString().split('T')[0]
                return (
                    <div
                        key={idx}
                        className={`aspect-square rounded-lg flex items-center justify-center text-sm ${
                            item.checked
                                ? 'bg-sage text-white'
                                : isToday
                                ? 'bg-cream border-2 border-sage'
                                : 'bg-gray-100 text-gray-600'
                        }`}
                        title={item.date}
                    >
                        {item.day}
                    </div>
                )
            })}
        </div>
    )
}

