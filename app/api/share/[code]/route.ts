import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const supabase = await createClient()
        const { code } = await params

        const { data, error } = await supabase
            .from('shared_content')
            .select('*')
            .eq('share_code', code)
            .eq('is_public', true)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Share not found' }, { status: 404 })
            }
            console.error('Error fetching share:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Increment view count
        await supabase
            .from('shared_content')
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq('id', data.id)

        return NextResponse.json({ data })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

