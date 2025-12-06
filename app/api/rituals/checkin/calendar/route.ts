import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())
        const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString())

        // Get all checkins for the month
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`
        const endDate = `${year}-${String(month).padStart(2, '0')}-31`

        const { data, error } = await supabase
            .from('daily_checkins')
            .select('checkin_date, mood')
            .eq('user_id', user.id)
            .gte('checkin_date', startDate)
            .lte('checkin_date', endDate)

        if (error) {
            console.error('Error fetching checkin calendar:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Convert to map for easy lookup
        const checkinMap: Record<string, { date: string; mood: string | null }> = {}
        data?.forEach(checkin => {
            checkinMap[checkin.checkin_date] = {
                date: checkin.checkin_date,
                mood: checkin.mood
            }
        })

        return NextResponse.json({ data: checkinMap })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

