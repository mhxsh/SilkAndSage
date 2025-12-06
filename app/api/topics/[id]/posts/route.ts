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

        // Get topic by ID or slug
        let { data: topic, error: topicError } = await supabase
            .from('topics')
            .select('id')
            .eq('id', id)
            .single()

        if (topicError && topicError.code === 'PGRST116') {
            // Try by slug
            const { data: slugTopic } = await supabase
                .from('topics')
                .select('id')
                .eq('slug', id)
                .single()
            if (slugTopic) {
                topic = slugTopic
            } else {
                return NextResponse.json({ error: 'Topic not found' }, { status: 404 })
            }
        } else if (topicError) {
            return NextResponse.json({ error: topicError.message }, { status: 500 })
        }

        if (!topic) {
            return NextResponse.json({ error: 'Topic not found' }, { status: 404 })
        }

        // Get posts for this topic
        const { data: topicPosts, error: topicPostsError } = await supabase
            .from('topic_posts')
            .select('post_id')
            .eq('topic_id', topic.id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        if (topicPostsError) {
            console.error('Error fetching topic posts:', topicPostsError)
            return NextResponse.json({ error: topicPostsError.message }, { status: 500 })
        }

        if (!topicPosts || topicPosts.length === 0) {
            return NextResponse.json({ data: [] })
        }

        // Get actual posts
        const postIds = topicPosts.map(tp => tp.post_id)
        const { data: posts, error: postsError } = await supabase
            .from('ugc_posts')
            .select('*')
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

        // Get topic by ID or slug
        let { data: topic, error: topicError } = await supabase
            .from('topics')
            .select('id')
            .eq('id', id)
            .single()

        if (topicError && topicError.code === 'PGRST116') {
            const { data: slugTopic } = await supabase
                .from('topics')
                .select('id')
                .eq('slug', id)
                .single()
            if (slugTopic) {
                topic = slugTopic
            } else {
                return NextResponse.json({ error: 'Topic not found' }, { status: 404 })
            }
        } else if (topicError) {
            return NextResponse.json({ error: topicError.message }, { status: 500 })
        }

        if (!topic) {
            return NextResponse.json({ error: 'Topic not found' }, { status: 404 })
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

        // Check if already associated with topic
        const { data: existing } = await supabase
            .from('topic_posts')
            .select('*')
            .eq('topic_id', topic.id)
            .eq('post_id', postId)
            .single()

        if (existing) {
            return NextResponse.json({ error: 'Post already associated with topic' }, { status: 400 })
        }

        // Associate post with topic
        const { data, error } = await supabase
            .from('topic_posts')
            .insert({
                topic_id: topic.id,
                post_id: postId
            })
            .select()
            .single()

        if (error) {
            console.error('Error associating post with topic:', error)
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
