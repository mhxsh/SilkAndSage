import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type') // 'challenge', 'wish', 'discussion', 'share'
        const featured = searchParams.get('featured') === 'true'
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')

        let query = supabase
            .from('topics')
            .select('*')
            .order('participant_count', { ascending: false })
            .range(offset, offset + limit - 1)

        if (type) {
            query = query.eq('type', type)
        }
        if (featured) {
            query = query.eq('is_featured', true)
        }

        const { data, error } = await query

        if (error) {
            console.error('Error fetching topics:', error)
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

