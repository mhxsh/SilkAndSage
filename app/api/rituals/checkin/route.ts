import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { mood, moodNote, morningGreetingId, mindfulnessQuoteId } = body

        const today = new Date().toISOString().split('T')[0]

        // Get today's quote and greeting if not provided
        let quoteId = mindfulnessQuoteId
        let greetingId = morningGreetingId

        if (!quoteId || !greetingId) {
            const { data: todayData } = await supabase
                .from('daily_checkins')
                .select('morning_greeting_id, mindfulness_quote_id')
                .eq('user_id', user.id)
                .eq('checkin_date', today)
                .single()

            if (todayData) {
                quoteId = quoteId || todayData.mindfulness_quote_id
                greetingId = greetingId || todayData.morning_greeting_id
            }
        }

        // Upsert checkin
        const { data, error } = await supabase
            .from('daily_checkins')
            .upsert({
                user_id: user.id,
                checkin_date: today,
                mood: mood || null,
                mood_note: moodNote || null,
                morning_greeting_id: greetingId || null,
                mindfulness_quote_id: quoteId || null
            }, {
                onConflict: 'user_id,checkin_date'
            })
            .select()
            .single()

        if (error) {
            console.error('Error saving checkin:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '30')
        const offset = parseInt(searchParams.get('offset') || '0')

        const { data, error } = await supabase
            .from('daily_checkins')
            .select('*')
            .eq('user_id', user.id)
            .order('checkin_date', { ascending: false })
            .range(offset, offset + limit - 1)

        if (error) {
            console.error('Error fetching checkins:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ data: data || [] })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

