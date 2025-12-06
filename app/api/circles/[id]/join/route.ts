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

        // Check if already a member
        const { data: existingMember } = await supabase
            .from('circle_members')
            .select('*')
            .eq('circle_id', circle.id)
            .eq('user_id', user.id)
            .single()

        if (existingMember) {
            return NextResponse.json({ error: 'Already a member' }, { status: 400 })
        }

        // Join circle
        const { data, error } = await supabase
            .from('circle_members')
            .insert({
                circle_id: circle.id,
                user_id: user.id,
                role: 'member'
            })
            .select()
            .single()

        if (error) {
            console.error('Error joining circle:', error)
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

