import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { title, content, postType, images, coverImageUrl, tags, productIds } = body

        if (!title || !postType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Create UGC post
        const { data: post, error: postError } = await supabase
            .from('ugc_posts')
            .insert({
                user_id: user.id,
                title,
                content: content || null,
                post_type: postType,
                images: images || [],
                cover_image_url: coverImageUrl || null,
                tags: tags || [],
                status: 'published',
                published_at: new Date().toISOString()
            })
            .select()
            .single()

        if (postError) {
            console.error('Error creating post:', postError)
            return NextResponse.json({ error: postError.message }, { status: 500 })
        }

        // Associate products if provided
        if (productIds && productIds.length > 0) {
            const productAssociations = productIds.map((productId: string, index: number) => ({
                post_id: post.id,
                product_id: productId,
                position: index
            }))

            const { error: productError } = await supabase
                .from('post_products')
                .insert(productAssociations)

            if (productError) {
                console.error('Error associating products:', productError)
                // Don't fail the request, just log the error
            }
        }

        return NextResponse.json({ success: true, data: post })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET(request: Request) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const postType = searchParams.get('type')
        const limit = parseInt(searchParams.get('limit') || '20')
        const offset = parseInt(searchParams.get('offset') || '0')

        let query = supabase
            .from('ugc_posts')
            .select('*')
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        if (postType) {
            query = query.eq('post_type', postType)
        }

        const { data, error } = await query

        if (error) {
            console.error('Error fetching posts:', error)
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

