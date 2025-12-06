import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        const { id } = await params
        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '20')
        const offset = parseInt(searchParams.get('offset') || '0')

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

        if (!circle) {
            return NextResponse.json({ error: 'Circle not found' }, { status: 404 })
        }

        // Get posts for this circle
        const { data: circlePosts, error: circlePostsError } = await supabase
            .from('circle_posts')
            .select('post_id')
            .eq('circle_id', circle.id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        if (circlePostsError) {
            console.error('Error fetching circle posts:', circlePostsError)
            return NextResponse.json({ error: circlePostsError.message }, { status: 500 })
        }

        if (!circlePosts || circlePosts.length === 0) {
            return NextResponse.json({ data: [] })
        }

        // Get actual posts with user info
        const postIds = circlePosts.map(cp => cp.post_id)
        const { data: posts, error: postsError } = await supabase
            .from('ugc_posts')
            .select(`
                *,
                profiles:user_id (
                    id,
                    username,
                    full_name
                )
            `)
            .in('id', postIds)
            .eq('status', 'published')
            .order('created_at', { ascending: false })

        if (postsError) {
            console.error('Error fetching posts:', postsError)
            return NextResponse.json({ error: postsError.message }, { status: 500 })
        }

        return NextResponse.json({ data: posts || [] })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

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
        const body = await request.json()
        const { postId } = body

        if (!postId) {
            return NextResponse.json({ error: 'Missing postId' }, { status: 400 })
        }

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

        // Check if user is a member
        const { data: member } = await supabase
            .from('circle_members')
            .select('*')
            .eq('circle_id', circle.id)
            .eq('user_id', user.id)
            .single()

        if (!member) {
            return NextResponse.json({ error: 'Not a member of this circle' }, { status: 403 })
        }

        // Check if post exists and belongs to user
        const { data: post } = await supabase
            .from('ugc_posts')
            .select('id, user_id')
            .eq('id', postId)
            .eq('user_id', user.id)
            .single()

        if (!post) {
            return NextResponse.json({ error: 'Post not found or not owned by user' }, { status: 404 })
        }

        // Check if already posted to circle
        const { data: existing } = await supabase
            .from('circle_posts')
            .select('*')
            .eq('circle_id', circle.id)
            .eq('post_id', postId)
            .single()

        if (existing) {
            return NextResponse.json({ error: 'Post already in circle' }, { status: 400 })
        }

        // Add post to circle
        const { data, error } = await supabase
            .from('circle_posts')
            .insert({
                circle_id: circle.id,
                post_id: postId
            })
            .select()
            .single()

        if (error) {
            console.error('Error adding post to circle:', error)
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

