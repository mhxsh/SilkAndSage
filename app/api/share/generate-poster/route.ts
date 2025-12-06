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
        const { contentType, contentId, contentData } = body

        if (!contentType || !contentData) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // For now, we'll return a share code and let the frontend generate the poster
        // In production, you might want to use a service like Puppeteer or Canvas API
        // to generate the poster server-side

        // Save share record
        const { data, error } = await supabase
            .from('shared_content')
            .insert({
                user_id: user.id,
                content_type: contentType,
                content_id: contentId || null,
                content_data: contentData,
                is_public: true
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating share:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            data: {
                shareCode: data.share_code,
                shareUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/share/${data.share_code}`
            }
        })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

