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
        const { fortuneData, userNotes } = body

        // Save fortune to history
        const { data, error } = await supabase
            .from('user_fortune_history')
            .insert({
                user_id: user.id,
                fortune_data: fortuneData,
                user_notes: userNotes || null,
                is_favorite: false,
                shared_count: 0,
                viewed_at: new Date().toISOString()
            })
            .select()
            .single()

        if (error) {
            console.error('Error saving fortune:', error)
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

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data, error } = await supabase
            .from('user_fortune_history')
            .select('*')
            .eq('user_id', user.id)
            .order('viewed_at', { ascending: false })
            .limit(30)

        if (error) {
            console.error('Error fetching fortune history:', error)
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
