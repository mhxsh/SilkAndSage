import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        // Get circle by ID or slug
        let { data: circle, error: circleError } = await supabase
            .from('circles')
            .select('id')
            .eq('id', id)
            .single()

        if (circleError && circleError.code === 'PGRST116') {
            const { data: slugCircle } = await supabase
                .from('circles')
                .select('id')
                .eq('slug', id)
                .single()
            if (slugCircle) {
                circle = slugCircle
            } else {
                return NextResponse.json({ error: 'Circle not found' }, { status: 404 })
            }
        } else if (circleError) {
            return NextResponse.json({ error: circleError.message }, { status: 500 })
        }

        // Leave circle
        const { error } = await supabase
            .from('circle_members')
            .delete()
            .eq('circle_id', circle.id)
            .eq('user_id', user.id)

        if (error) {
            console.error('Error leaving circle:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

