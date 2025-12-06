import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        const { id } = await params

        const { data, error } = await supabase
            .from('ugc_posts')
            .select(`
                *,
                profiles:user_id (
                    id,
                    username,
                    full_name
                ),
                post_products (
                    product_id,
                    position,
                    products (
                        id,
                        name,
                        category,
                        affiliate_link,
                        image_url
                    )
                )
            `)
            .eq('id', id)
            .eq('status', 'published')
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Post not found' }, { status: 404 })
            }
            console.error('Error fetching post:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Increment view count
        await supabase
            .from('ugc_posts')
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq('id', id)

        return NextResponse.json({ data })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

