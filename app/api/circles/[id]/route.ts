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
            .from('circles')
            .select('*')
        
        if (isUUID) {
            query = query.eq('id', id)
        } else {
            query = query.eq('slug', id)
        }
        
        const { data, error } = await query.single()

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Circle not found' }, { status: 404 })
            }
            console.error('Error fetching circle:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Check if user is a member
        const { data: { user } } = await supabase.auth.getUser()
        let isMember = false
        if (user) {
            const { data: member } = await supabase
                .from('circle_members')
                .select('role')
                .eq('circle_id', data.id)
                .eq('user_id', user.id)
                .single()
            isMember = !!member
        }

        return NextResponse.json({
            ...data,
            isMember
        })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

