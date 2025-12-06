import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data, error } = await supabase
            .from('user_checkin_stats')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (error) {
            // If stats don't exist, create them
            if (error.code === 'PGRST116') {
                const { data: newStats } = await supabase
                    .from('user_checkin_stats')
                    .insert({
                        user_id: user.id,
                        total_checkins: 0,
                        current_streak: 0,
                        longest_streak: 0
                    })
                    .select()
                    .single()

                return NextResponse.json({ data: newStats })
            }
            console.error('Error fetching checkin stats:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ data: data || {
            total_checkins: 0,
            current_streak: 0,
            longest_streak: 0,
            last_checkin_date: null
        }})
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

