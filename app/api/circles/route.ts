import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type') // 'element', 'mbti', 'custom'
        const typeValue = searchParams.get('typeValue') // specific value like 'wood', 'INFJ'
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')

        let query = supabase
            .from('circles')
            .select('*')
            .eq('is_public', true)
            .order('member_count', { ascending: false })
            .range(offset, offset + limit - 1)

        if (type) {
            query = query.eq('type', type)
        }
        if (typeValue) {
            query = query.eq('type_value', typeValue)
        }

        const { data, error } = await query

        if (error) {
            console.error('Error fetching circles:', error)
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

