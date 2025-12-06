import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        const { id } = await params

        // Check if id is UUID format, if not, treat as slug
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
        
        let query = supabase
            .from('topics')
            .select('*')
        
        if (isUUID) {
            query = query.eq('id', id)
        } else {
            query = query.eq('slug', id)
        }
        
        const { data, error } = await query.single()

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Topic not found' }, { status: 404 })
            }
            console.error('Error fetching topic:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Check if user is following
        const { data: { user } } = await supabase.auth.getUser()
        let isFollowing = false
        if (user) {
            const { data: follow } = await supabase
                .from('user_topic_follows')
                .select('*')
                .eq('topic_id', data.id)
                .eq('user_id', user.id)
                .single()
            isFollowing = !!follow
        }

        return NextResponse.json({
            ...data,
            isFollowing
        })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

