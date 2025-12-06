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

        // Check if already following
        const { data: existingFollow } = await supabase
            .from('user_topic_follows')
            .select('*')
            .eq('topic_id', topic.id)
            .eq('user_id', user.id)
            .single()

        if (existingFollow) {
            return NextResponse.json({ error: 'Already following' }, { status: 400 })
        }

        // Follow topic
        const { data, error } = await supabase
            .from('user_topic_follows')
            .insert({
                topic_id: topic.id,
                user_id: user.id
            })
            .select()
            .single()

        if (error) {
            console.error('Error following topic:', error)
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

export async function DELETE(
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

        // Unfollow topic
        const { error } = await supabase
            .from('user_topic_follows')
            .delete()
            .eq('topic_id', topic.id)
            .eq('user_id', user.id)

        if (error) {
            console.error('Error unfollowing topic:', error)
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

